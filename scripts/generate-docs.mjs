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

const repoPkgPath = path.join(repoRoot, 'package.json')

const overridesPath = path.join(repoRoot, 'src', 'lib', 'overrides.ts')
const examplesDir = path.join(repoRoot, 'docs', 'examples')
const componentsDir = path.join(repoRoot, 'docs', 'components')
const sidebarPath = path.join(repoRoot, 'docs', '.vitepress', 'components-sidebar.json')
const indexPath = path.join(componentsDir, 'index.md')

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

// The published package name — used in every import example so docs always
// match what consumers actually install.
let repoPkg
try {
  repoPkg = JSON.parse(readFileSync(repoPkgPath, 'utf8'))
} catch (error) {
  fail(`could not read ${repoPkgPath}: ${error.message}`)
}
const packageName = repoPkg.name
assert(
  typeof packageName === 'string' && packageName.length > 0,
  'root package.json is missing a "name" field',
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
// Categories
// ---------------------------------------------------------------------------

// Shopify's Custom Elements Manifest carries no category information, so this map is
// the one piece of docs taxonomy that cannot be derived from it. The category names and
// membership mirror the grouping Shopify uses on
// https://shopify.dev/docs/api/app-home/polaris-web-components so the sidebar reads the
// same way as the upstream reference.
//
// Sub-components that Shopify documents inside a parent's page rather than as their own
// sidebar entry (s-table-cell, s-option, s-grid-item, ...) are filed under the same
// category as their parent.
//
// The two assertions below keep this map honest in both directions: a tag listed here
// that no longer exists upstream, or a newly shipped Polaris component nobody has filed
// yet, fails `npm run docs:generate` loudly instead of silently skewing the sidebar.
const CATEGORIES = [
  {
    text: 'Actions',
    tags: [
      's-button',
      's-button-group',
      's-clickable',
      's-clickable-chip',
      's-link',
      's-menu',
      's-press-button',
    ],
  },
  {
    text: 'Feedback and status',
    tags: ['s-badge', 's-banner', 's-spinner'],
  },
  {
    text: 'Forms',
    tags: [
      's-checkbox',
      's-choice',
      's-choice-list',
      's-color-field',
      's-color-picker',
      's-date-field',
      's-date-picker',
      's-drop-zone',
      's-email-field',
      's-money-field',
      's-number-field',
      's-option',
      's-option-group',
      's-password-field',
      's-search-field',
      's-select',
      's-switch',
      's-text-area',
      's-text-field',
      's-url-field',
    ],
  },
  {
    text: 'Layout and structure',
    tags: [
      's-box',
      's-divider',
      's-grid',
      's-grid-item',
      's-list-item',
      's-ordered-list',
      's-page',
      's-query-container',
      's-scroll-box',
      's-section',
      's-stack',
      's-table',
      's-table-body',
      's-table-cell',
      's-table-header',
      's-table-header-row',
      's-table-row',
      's-unordered-list',
    ],
  },
  {
    text: 'Media and visuals',
    tags: ['s-avatar', 's-icon', 's-image', 's-thumbnail'],
  },
  {
    text: 'Overlays',
    tags: ['s-modal', 's-popover'],
  },
  {
    text: 'Typography and content',
    tags: ['s-chip', 's-heading', 's-paragraph', 's-text', 's-tooltip'],
  },
]

const categoryByTag = new Map()
for (const category of CATEGORIES) {
  for (const tag of category.tags) {
    assert(
      !categoryByTag.has(tag),
      `tag "${tag}" is listed in more than one category ("${categoryByTag.get(tag)}" and "${category.text}")`,
    )
    assert(
      components.some((c) => c.tagName === tag),
      `category "${category.text}" references unknown tag "${tag}" (not found in the manifest). Has Shopify removed it?`,
    )
    categoryByTag.set(tag, category.text)
  }
}

const uncategorized = components.filter((c) => !categoryByTag.has(c.tagName)).map((c) => c.tagName)
assert(
  uncategorized.length === 0,
  `these manifest tags are not assigned to a category in CATEGORIES: ${uncategorized.join(', ')}. Add them (see https://shopify.dev/docs/api/app-home/polaris-web-components for where Shopify files them).`,
)

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
  lines.push(`import { ${component.exportName} } from '${packageName}'`)
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
  lines.push(`import { ${component.exportName} } from '${packageName}'`)
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
    `import { ${component.exportName} } from '${packageName}'`,
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

const componentByTag = new Map(components.map((c) => [c.tagName, c]))

// One VitePress sidebar group per category, in the order CATEGORIES declares them, with
// components sorted by export name inside each group. Groups start collapsed — VitePress
// auto-expands whichever one contains the page you're on, so the sidebar stays short.
const sidebar = CATEGORIES.map((category) => ({
  text: category.text,
  collapsed: true,
  items: category.tags
    .map((tag) => componentByTag.get(tag))
    .toSorted((a, b) => a.exportName.localeCompare(b.exportName))
    .map((c) => ({ text: c.exportName, link: `/components/${c.tagName}` })),
}))

mkdirSync(path.dirname(sidebarPath), { recursive: true })
writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2) + '\n')

// docs/components/index.md — the target of the "Components" nav link, and a
// browse-by-category overview of every wrapper.
function renderComponentsIndex() {
  const lines = [banner(), '', '# Components', '']
  lines.push(
    `${components.length} typed Vue wrappers, one per Polaris web component, grouped the way [Shopify's own reference](https://shopify.dev/docs/api/app-home/polaris-web-components) groups them.`,
  )
  lines.push('')

  for (const category of CATEGORIES) {
    lines.push(`## ${category.text}`)
    lines.push('')
    lines.push('<div class="component-grid">')
    lines.push('')
    for (const c of category.tags
      .map((tag) => componentByTag.get(tag))
      .toSorted((a, b) => a.exportName.localeCompare(b.exportName))) {
      lines.push(
        `- [**${c.exportName}**<span class="component-grid-tag">&lt;${c.tagName}&gt;</span>](/components/${c.tagName})`,
      )
    }
    lines.push('')
    lines.push('</div>')
    lines.push('')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

writeFileSync(indexPath, renderComponentsIndex())

console.warn(
  `[generate-docs] wrote ${components.length} component pages in ${CATEGORIES.length} categories to ${path.relative(repoRoot, componentsDir)}, plus ${path.relative(repoRoot, indexPath)} and ${path.relative(repoRoot, sidebarPath)}`,
)
