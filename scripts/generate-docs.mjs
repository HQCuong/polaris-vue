#!/usr/bin/env node
// Generates docs/components/*.md and docs/.vitepress/components-sidebar.json from
// @shopify/polaris-types' Custom Elements Manifest, the same source `scripts/generate.mjs`
// reads for the library code itself.
//
// Usage: node scripts/generate-docs.mjs
//
// This script must be deterministic and idempotent: running it twice in a row must
// produce zero diff. It fails loudly (non-zero exit, clear message) if the manifest
// shape doesn't match what the generator assumes, so a Shopify update that changes the
// schema is caught immediately instead of silently producing bad docs.
//
// docs/examples/<tag>.md is a hand-written override mechanism (mirrors the philosophy of
// src/lib/overrides.ts): when present, its content is inlined verbatim into that
// component's "Example" section instead of a generated one.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const polarisTypesDir = path.join(repoRoot, 'node_modules', '@shopify', 'polaris-types')
const manifestPath = path.join(polarisTypesDir, 'dist', 'custom-elements.json')
const pkgPath = path.join(polarisTypesDir, 'package.json')

const overridesPath = path.join(repoRoot, 'src', 'lib', 'overrides.ts')
const examplesDir = path.join(repoRoot, 'docs', 'examples')
const componentsDir = path.join(repoRoot, 'docs', 'components')
const sidebarPath = path.join(repoRoot, 'docs', '.vitepress', 'components-sidebar.json')

function fail(message) {
  console.error(`[generate-docs] ${message}`)
  process.exit(1)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

// ---------------------------------------------------------------------------
// Load inputs
// ---------------------------------------------------------------------------

let manifestRaw
try {
  manifestRaw = readFileSync(manifestPath, 'utf8')
} catch (error) {
  fail(
    `could not read manifest at ${manifestPath}: ${error.message}. Is @shopify/polaris-types installed?`,
  )
}

let manifest
try {
  manifest = JSON.parse(manifestRaw)
} catch (error) {
  fail(`manifest at ${manifestPath} is not valid JSON: ${error.message}`)
}

let polarisTypesPkg
try {
  polarisTypesPkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
} catch (error) {
  fail(`could not read ${pkgPath}: ${error.message}`)
}

const polarisTypesVersion = polarisTypesPkg.version
assert(
  typeof polarisTypesVersion === 'string' && polarisTypesVersion.length > 0,
  '@shopify/polaris-types package.json is missing a "version" field',
)

let overridesRaw
try {
  overridesRaw = readFileSync(overridesPath, 'utf8')
} catch (error) {
  fail(`could not read ${overridesPath}: ${error.message}`)
}

// ---------------------------------------------------------------------------
// Schema assumption guards + extraction (mirrors scripts/generate.mjs)
// ---------------------------------------------------------------------------

assert(Array.isArray(manifest.modules), 'manifest.modules is not an array')

const rawComponents = []
for (const mod of manifest.modules) {
  for (const decl of mod.declarations ?? []) {
    if (!decl.tagName) continue
    rawComponents.push(decl)
  }
}

assert(rawComponents.length > 0, 'no components with a tagName were found in the manifest')

const IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9]*$/
const FUNCTION_TYPE_RE = /=>/

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join('')
}

function toComponentName(tagName) {
  assert(tagName.startsWith('s-'), `tag "${tagName}" does not start with "s-"`)
  return `S${toPascalCase(tagName.slice(2))}`
}

const components = []

for (const raw of rawComponents) {
  assert(typeof raw.tagName === 'string' && raw.tagName.length > 0, 'component is missing a tagName')
  assert(typeof raw.name === 'string' && raw.name.length > 0, `component "${raw.tagName}" is missing a name`)

  const fields = (raw.members ?? []).filter((m) => m.kind === 'field')
  const attributes = raw.attributes ?? []
  assert(Array.isArray(attributes), `component "${raw.tagName}" has a non-array attributes field`)

  const props = []
  const methods = []
  for (const field of fields) {
    if (!field.name || !IDENTIFIER_RE.test(field.name)) continue
    if (field.privacy === 'private' || field.privacy === 'protected') continue
    if (field.static) continue

    const typeText = field.type && typeof field.type.text === 'string' ? field.type.text : 'string'
    const description = typeof field.description === 'string' ? field.description.trim() : ''

    if (FUNCTION_TYPE_RE.test(typeText)) {
      methods.push({ name: field.name, type: typeText, description })
      continue
    }

    props.push({ name: field.name, type: typeText, description })
  }
  props.sort((a, b) => a.name.localeCompare(b.name))
  methods.sort((a, b) => a.name.localeCompare(b.name))

  const events = (raw.events ?? []).map((e) => {
    assert(typeof e.name === 'string', `component "${raw.tagName}" has an event with no name`)
    const typeText = e.type && typeof e.type.text === 'string' ? e.type.text : 'CustomEvent'
    return { name: e.name, type: typeText }
  })
  events.sort((a, b) => a.name.localeCompare(b.name))

  const slots = (raw.slots ?? []).map((s) => ({
    name: typeof s.name === 'string' ? s.name : '',
    description: typeof s.description === 'string' ? s.description.trim() : '',
  }))
  slots.sort((a, b) => a.name.localeCompare(b.name))

  components.push({
    tagName: raw.tagName,
    exportName: toComponentName(raw.tagName),
    props,
    events,
    slots,
    methods,
  })
}

components.sort((a, b) => a.tagName.localeCompare(b.tagName))

const seenExportNames = new Set()
for (const c of components) {
  assert(
    !seenExportNames.has(c.exportName),
    `duplicate export name "${c.exportName}" derived from tag "${c.tagName}"`,
  )
  seenExportNames.add(c.exportName)
}

// ---------------------------------------------------------------------------
// v-model overrides — resilient regex extraction from src/lib/overrides.ts
// ---------------------------------------------------------------------------

// Parsing the TS file with a real parser is overkill and fragile to formatting changes;
// instead extract each `'s-tag': { prop: 'x', event: 'y' }` entry with a regex. If the
// shape of overrides.ts ever changes enough to break this, the sanity-floor assertion
// below will catch it (rather than silently emitting docs with no v-model sections).
const VMODEL_ENTRY_RE =
  /'(s-[a-z0-9-]+)':\s*\{\s*prop:\s*'([a-zA-Z]+)',\s*event:\s*'([a-zA-Z]+)'\s*\}/g

const vModelOverrides = new Map()
for (const match of overridesRaw.matchAll(VMODEL_ENTRY_RE)) {
  const [, tag, prop, event] = match
  vModelOverrides.set(tag, { prop, event })
}

const VMODEL_SANITY_FLOOR = 15
assert(
  vModelOverrides.size >= VMODEL_SANITY_FLOOR,
  `expected at least ${VMODEL_SANITY_FLOOR} v-model overrides extracted from ${overridesPath}, found ${vModelOverrides.size}. The regex extraction may be out of sync with the file's formatting.`,
)

for (const tag of vModelOverrides.keys()) {
  assert(
    components.some((c) => c.tagName === tag),
    `v-model override references unknown tag "${tag}" (not found in the manifest)`,
  )
}

// ---------------------------------------------------------------------------
// Hand-written example overrides (docs/examples/<tag>.md)
// ---------------------------------------------------------------------------

const exampleFiles = existsSync(examplesDir)
  ? readdirSync(examplesDir).filter((f) => f.endsWith('.md'))
  : []

const handWrittenExamples = new Map()
for (const file of exampleFiles) {
  const tag = file.slice(0, -'.md'.length)
  handWrittenExamples.set(tag, readFileSync(path.join(examplesDir, file), 'utf8').trimEnd())
}

// Simple presentational components where a generic "render it with a text child" demo is
// meaningful with no additional wiring (no required props, no complex composition).
const SAFE_PREVIEW_TAGS = new Set([
  's-badge',
  's-button',
  's-spinner',
  's-divider',
  's-heading',
  's-text',
  's-paragraph',
  's-link',
])

for (const tag of SAFE_PREVIEW_TAGS) {
  assert(
    components.some((c) => c.tagName === tag),
    `SAFE_PREVIEW_TAGS references unknown tag "${tag}" (not found in the manifest)`,
  )
}

// ---------------------------------------------------------------------------
// Markdown rendering helpers
// ---------------------------------------------------------------------------

function banner() {
  return `<!-- Generated by scripts/generate-docs.mjs from @shopify/polaris-types@${polarisTypesVersion} — DO NOT EDIT. -->`
}

// Escapes a value for use inside a Markdown table cell: backslash-escape pipes so a
// union type like \`"a" | "b"\` doesn't split into extra table columns, and collapse any
// stray newline (none are expected from the manifest today, but a table row must stay on
// one line regardless).
function escapeTableCell(text) {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

const MAX_UNION_ALTERNATIVES = 8

function formatTypeCell(typeText) {
  const alternatives = typeText.split('|').map((t) => t.trim())
  let display = typeText
  let truncated = false
  if (alternatives.length > MAX_UNION_ALTERNATIVES) {
    const shown = alternatives.slice(0, MAX_UNION_ALTERNATIVES)
    const more = alternatives.length - MAX_UNION_ALTERNATIVES
    display = `${shown.join(' | ')} … (${more} more)`
    truncated = true
  }
  return { cell: `\`${escapeTableCell(display)}\``, truncated }
}

function renderTable(headers, rows) {
  const lines = []
  lines.push(`| ${headers.join(' | ')} |`)
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`)
  for (const row of rows) {
    lines.push(`| ${row.join(' | ')} |`)
  }
  return lines.join('\n')
}

// docs/examples/<tag>.md is authored (and independently buildable by VitePress as its
// own page) assuming its own directory, docs/examples/, as the base for relative
// imports — e.g. `from './demos/SButtonDemo.vue'`. When its content is inlined
// verbatim into docs/components/<tag>.md, a sibling directory of docs/examples/, that
// same specifier must become `from '../examples/demos/SButtonDemo.vue'` to keep
// resolving to the same file. Only single-level `./`-relative specifiers are rewritten;
// there are currently no `../`-relative imports in any example file.
function rewriteRelativeImportsForInlining(content) {
  return content.replace(/(from\s+['"])\.\//g, "$1../examples/")
}

function renderExampleSection(component) {
  const handWritten = handWrittenExamples.get(component.tagName)
  if (handWritten) {
    return ['## Example', '', rewriteRelativeImportsForInlining(handWritten), ''].join('\n')
  }

  if (!SAFE_PREVIEW_TAGS.has(component.tagName)) {
    return ''
  }

  const lines = []
  lines.push('## Example')
  lines.push('')
  lines.push('<script setup>')
  lines.push(`import { ${component.exportName} } from '@lib'`)
  lines.push('</script>')
  lines.push('')
  lines.push(`<${component.exportName}>Example ${component.exportName} content</${component.exportName}>`)
  lines.push('')
  lines.push('```vue')
  lines.push('<script setup>')
  lines.push(`import { ${component.exportName} } from 'polaris-vue'`)
  lines.push('</script>')
  lines.push('')
  lines.push('<template>')
  lines.push(`  <${component.exportName}>Example ${component.exportName} content</${component.exportName}>`)
  lines.push('</template>')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderVModelSection(component) {
  const override = vModelOverrides.get(component.tagName)
  if (!override) return ''

  const lines = []
  lines.push('## v-model')
  lines.push('')
  lines.push(
    `\`v-model\` on \`<${component.exportName}>\` binds to the \`${override.prop}\` property and listens for the \`${override.event}\` DOM event.`,
  )
  lines.push('')
  lines.push('```vue-html')
  lines.push(`<${component.exportName} v-model="value" />`)
  lines.push('```')
  lines.push('')
  lines.push('is equivalent to:')
  lines.push('')
  lines.push('```vue-html')
  lines.push(
    `<${component.exportName} :${override.prop}="value" @${override.event}="value = $event.target.${override.prop}" />`,
  )
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderPropsSection(component) {
  if (component.props.length === 0) return ''

  let anyTruncated = false
  const rows = component.props.map((p) => {
    const { cell, truncated } = formatTypeCell(p.type)
    if (truncated) anyTruncated = true
    const description = p.description ? escapeTableCell(p.description) : ''
    return [`\`${p.name}\``, cell, description]
  })

  const lines = []
  lines.push('## Props')
  lines.push('')
  lines.push(renderTable(['Prop', 'Type', 'Description'], rows))
  if (anyTruncated) {
    lines.push('')
    lines.push(
      '> Some type columns above are truncated for readability; the full union is available in the library\'s generated TypeScript types (`src/lib/generated/types.ts`).',
    )
  }
  lines.push('')
  return lines.join('\n')
}

function renderEventsSection(component) {
  if (component.events.length === 0) return ''

  const rows = component.events.map((e) => [`\`${e.name}\``, `\`${escapeTableCell(e.type)}\``])

  const lines = []
  lines.push('## Events')
  lines.push('')
  lines.push(renderTable(['Event', 'Type'], rows))
  lines.push('')
  lines.push(`Listen for these with \`@${component.events[0].name}\`-style listeners on \`<${component.exportName}>\`.`)
  lines.push('')
  return lines.join('\n')
}

function renderMethodsSection(component) {
  if (component.methods.length === 0) return ''

  const lines = []
  lines.push('## Methods')
  lines.push('')
  lines.push(
    `\`<${component.exportName}>\` exposes the following methods on its underlying DOM element (accessible via a typed template ref):`,
  )
  lines.push('')
  for (const m of component.methods) {
    lines.push(`- \`${m.name}${m.type}\`${m.description ? ` — ${m.description}` : ''}`)
  }
  lines.push('')
  const refName = component.tagName.slice('s-'.length).replace(/-/g, '')
  lines.push('```vue')
  lines.push('<script setup>')
  lines.push("import { useTemplateRef } from 'vue'")
  lines.push(`import { ${component.exportName} } from 'polaris-vue'`)
  lines.push('')
  lines.push(
    `const ${refName} = useTemplateRef<InstanceType<typeof ${component.exportName}>>('${refName}')`,
  )
  lines.push('')
  const firstMethodName = component.methods[0].name
  const firstMethodPascal = firstMethodName.charAt(0).toUpperCase() + firstMethodName.slice(1)
  lines.push(`function call${firstMethodPascal}() {`)
  lines.push(`  ${refName}.value?.$el.${component.methods[0].name}()`)
  lines.push('}')
  lines.push('</script>')
  lines.push('')
  lines.push('<template>')
  lines.push(`  <${component.exportName} ref="${refName}" />`)
  lines.push('</template>')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderSlotsSection(component) {
  if (component.slots.length === 0) return ''

  const rows = component.slots.map((s) => [
    `\`${s.name === '' ? 'default' : s.name}\``,
    s.description ? escapeTableCell(s.description) : '',
  ])

  const lines = []
  lines.push('## Slots')
  lines.push('')
  lines.push(renderTable(['Slot', 'Description'], rows))
  lines.push('')
  return lines.join('\n')
}

function renderComponentPage(component) {
  const header = [
    banner(),
    '',
    `# ${component.exportName} \`<${component.tagName}>\``,
    '',
    '```ts',
    `import { ${component.exportName} } from 'polaris-vue'`,
    '```',
  ].join('\n')

  const optionalSections = [
    renderExampleSection(component),
    renderVModelSection(component),
    renderPropsSection(component),
    renderEventsSection(component),
    renderMethodsSection(component),
    renderSlotsSection(component),
  ].filter((s) => s !== '')

  const body = [header, ...optionalSections].join('\n\n')

  return body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

mkdirSync(componentsDir, { recursive: true })

for (const component of components) {
  writeFileSync(path.join(componentsDir, `${component.tagName}.md`), renderComponentPage(component))
}

const sidebar = components
  .map((c) => ({
    text: `${c.exportName} (${c.tagName})`,
    link: `/components/${c.tagName}`,
  }))
  .toSorted((a, b) => a.text.localeCompare(b.text))

mkdirSync(path.dirname(sidebarPath), { recursive: true })
writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2) + '\n')

console.warn(
  `[generate-docs] wrote ${components.length} component pages to ${path.relative(repoRoot, componentsDir)} and ${path.relative(repoRoot, sidebarPath)}`,
)
