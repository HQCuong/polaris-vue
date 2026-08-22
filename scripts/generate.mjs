#!/usr/bin/env node
// Generates src/lib/generated/* from @shopify/polaris-types' Custom Elements Manifest.
//
// Usage: node scripts/generate.mjs
//
// This script must be deterministic and idempotent: running it twice in a row must
// produce zero diff. It fails loudly (non-zero exit, clear message) if the manifest
// shape doesn't match what the generator assumes, so a Shopify update that changes the
// schema is caught immediately instead of silently producing bad output.

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const polarisTypesDir = path.join(repoRoot, 'node_modules', '@shopify', 'polaris-types')
const manifestPath = path.join(polarisTypesDir, 'dist', 'custom-elements.json')
const pkgPath = path.join(polarisTypesDir, 'package.json')

const outDir = path.join(repoRoot, 'src', 'lib', 'generated')

function fail(message) {
  console.error(`[generate] ${message}`)
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

// ---------------------------------------------------------------------------
// Schema assumption guards + extraction
// ---------------------------------------------------------------------------

assert(Array.isArray(manifest.modules), 'manifest.modules is not an array')

/** @type {Array<{tagName: string, name: string, members: unknown[], events: unknown[], attributes: unknown[], slots: unknown[]}>} */
const rawComponents = []

for (const mod of manifest.modules) {
  for (const decl of mod.declarations ?? []) {
    if (!decl.tagName) continue
    rawComponents.push(decl)
  }
}

assert(rawComponents.length > 0, 'no components with a tagName were found in the manifest')

// Identifier-like JS property name: starts with a letter, only letters/digits.
const IDENTIFIER_RE = /^[A-Za-z][A-Za-z0-9]*$/

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

  const attributesByFieldName = new Map()
  for (const attr of attributes) {
    assert(typeof attr.name === 'string', `component "${raw.tagName}" has an attribute with no name`)
    // The manifest links an attribute back to its property via `fieldName`; fall back
    // to matching lowercase(field name) === attribute name if that's ever missing.
    const fieldName = typeof attr.fieldName === 'string' ? attr.fieldName : attr.name
    attributesByFieldName.set(fieldName.toLowerCase(), attr)
  }

  // A field whose type text is a function signature (e.g. `() => void`) is a method on
  // the custom element's JS interface, not a settable property — the manifest's
  // `members` list makes no distinction between the two ("field" covers both class
  // properties and class methods), so we detect it here by shape and route it to
  // `methods` instead of `props`. Setting an HTML attribute for a method does nothing.
  const FUNCTION_TYPE_RE = /=>/

  const props = []
  const methods = []
  for (const field of fields) {
    // Skip synthetic/private/static members that aren't real instance props
    // (e.g. `[internals]`, inherited static flags, or unnamed members).
    if (!field.name || !IDENTIFIER_RE.test(field.name)) continue
    if (field.privacy === 'private' || field.privacy === 'protected') continue
    if (field.static) continue

    const typeText = field.type && typeof field.type.text === 'string' ? field.type.text : 'string'

    if (FUNCTION_TYPE_RE.test(typeText)) {
      methods.push({ name: field.name, type: typeText })
      continue
    }

    const attr = attributesByFieldName.get(field.name.toLowerCase())
    props.push({
      name: field.name,
      attribute: attr ? attr.name : null,
      type: typeText,
    })
  }
  props.sort((a, b) => a.name.localeCompare(b.name))
  methods.sort((a, b) => a.name.localeCompare(b.name))

  const events = (raw.events ?? []).map((e) => {
    assert(typeof e.name === 'string', `component "${raw.tagName}" has an event with no name`)
    const typeText = e.type && typeof e.type.text === 'string' ? e.type.text : 'CustomEvent'
    return { name: e.name, type: typeText }
  })
  events.sort((a, b) => a.name.localeCompare(b.name))

  const slots = (raw.slots ?? []).map((s) => (typeof s.name === 'string' ? s.name : ''))
  slots.sort((a, b) => a.localeCompare(b))

  components.push({
    tagName: raw.tagName,
    exportName: toComponentName(raw.tagName),
    typeName: toPascalCase(raw.tagName.slice(2)),
    props,
    events,
    slots,
    methods,
  })
}

components.sort((a, b) => a.tagName.localeCompare(b.tagName))

// Guard against tag collisions producing duplicate export names.
const seenExportNames = new Set()
for (const c of components) {
  assert(
    !seenExportNames.has(c.exportName),
    `duplicate export name "${c.exportName}" derived from tag "${c.tagName}"`,
  )
  seenExportNames.add(c.exportName)
}

// ---------------------------------------------------------------------------
// TS type text conversion (manifest type text -> embeddable TS, or a safe fallback)
// ---------------------------------------------------------------------------

const STRING_LITERAL_RE = /^"[^"]*"$/

function convertTypeText(typeText) {
  const tokens = typeText
    .split('|')
    .map((t) => t.trim())
    .filter(Boolean)

  if (tokens.length > 0 && tokens.every((t) => STRING_LITERAL_RE.test(t))) {
    return { ts: tokens.join(' | '), embeddable: true }
  }

  const nonUndefined = tokens.filter((t) => t !== 'undefined' && t !== 'null')
  if (nonUndefined.length === 1 && ['string', 'boolean', 'number'].includes(nonUndefined[0])) {
    return { ts: nonUndefined[0], embeddable: true }
  }

  if (typeText === 'string[]' || typeText === 'boolean[]' || typeText === 'number[]') {
    return { ts: typeText, embeddable: true }
  }

  return { ts: 'string', embeddable: false, original: typeText }
}

// An event type is embeddable as-is only when it is a bare `Event` or `CustomEvent`
// reference (no generics, no unions) — anything else (e.g. a `CallbackEventListener<...>`
// generic) falls back to `CustomEvent`, with the original manifest text preserved in a
// comment, consistent with how prop types fall back above.
const EMBEDDABLE_EVENT_TYPES = new Set(['Event', 'CustomEvent'])

function convertEventTypeText(typeText) {
  if (EMBEDDABLE_EVENT_TYPES.has(typeText)) {
    return { ts: typeText, embeddable: true }
  }
  return { ts: 'CustomEvent', embeddable: false, original: typeText }
}

// A method type is embeddable as a zero-arg `(): void` signature only when it is
// exactly `() => void` — the only shape the manifest currently produces (see
// `s-modal`'s `hideOverlay`/`showOverlay`/`toggleOverlay`). Anything else falls back to
// a generic call signature, with the original manifest text preserved in a comment,
// consistent with the prop/event type fallbacks above.
function convertMethodTypeText(typeText) {
  if (typeText === '() => void') {
    return { ts: '(): void', embeddable: true }
  }
  return { ts: '(...args: unknown[]): unknown', embeddable: false, original: typeText }
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

function banner() {
  return [
    '// Generated by scripts/generate.mjs from @shopify/polaris-types@' + polarisTypesVersion + '.',
    '// DO NOT EDIT — re-run `npm run generate` after updating @shopify/polaris-types.',
    '',
  ].join('\n')
}

function jsonLiteral(value) {
  return JSON.stringify(value)
}

// ---------------------------------------------------------------------------
// metadata.ts
// ---------------------------------------------------------------------------

function renderMetadata() {
  const lines = []
  lines.push(banner())
  lines.push("import type { ComponentMeta } from '../runtime/createWrapper'")
  lines.push('')
  lines.push('export interface Metadata {')
  for (const c of components) {
    lines.push(`  ${c.exportName}: ComponentMeta`)
  }
  lines.push('}')
  lines.push('')
  lines.push('export const metadata: Metadata = {')
  for (const c of components) {
    lines.push(`  ${c.exportName}: {`)
    lines.push(`    tagName: ${jsonLiteral(c.tagName)},`)
    lines.push('    props: [')
    for (const p of c.props) {
      lines.push(
        `      { name: ${jsonLiteral(p.name)}, attribute: ${jsonLiteral(p.attribute)}, type: ${jsonLiteral(p.type)} },`,
      )
    }
    lines.push('    ],')
    lines.push(`    events: ${jsonLiteral(c.events.map((e) => e.name))},`)
    lines.push(`    slots: ${jsonLiteral(c.slots)},`)
    lines.push('  },')
  }
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// types.ts
// ---------------------------------------------------------------------------

function renderTypes() {
  const lines = []
  lines.push(banner())
  for (const c of components) {
    lines.push(`export interface ${c.typeName}Props {`)
    for (const p of c.props) {
      const converted = convertTypeText(p.type)
      if (converted.embeddable) {
        lines.push(`  ${p.name}?: ${converted.ts}`)
      } else {
        lines.push(`  /** original manifest type: ${converted.original.replace(/\*\//g, '*\\/')} */`)
        lines.push(`  ${p.name}?: ${converted.ts}`)
      }
    }
    lines.push('}')
    lines.push('')

    if (c.events.length === 0) {
      // An empty interface would allow any non-nullish value (and trip
      // @typescript-eslint/no-empty-object-type), so components with no manifest events
      // get a type alias that has no keys instead.
      lines.push(`export type ${c.typeName}Events = Record<string, never>`)
    } else {
      lines.push(`export interface ${c.typeName}Events {`)
      for (const e of c.events) {
        const converted = convertEventTypeText(e.type)
        if (!converted.embeddable) {
          lines.push(`  /** original manifest type: ${converted.original.replace(/\*\//g, '*\\/')} */`)
        }
        lines.push(`  ${e.name}: ${converted.ts}`)
      }
      lines.push('}')
    }
    lines.push('')

    if (c.methods.length > 0) {
      lines.push(`export interface ${c.typeName}Element extends HTMLElement {`)
      for (const m of c.methods) {
        const converted = convertMethodTypeText(m.type)
        if (!converted.embeddable) {
          lines.push(`  /** original manifest type: ${converted.original.replace(/\*\//g, '*\\/')} */`)
        }
        lines.push(`  ${m.name}${converted.ts}`)
      }
      lines.push('}')
      lines.push('')
    }
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// components.ts
// ---------------------------------------------------------------------------

function renderComponents() {
  const lines = []
  lines.push(banner())
  lines.push("import { createWrapper } from '../runtime/createWrapper'")
  lines.push("import { metadata } from './metadata'")
  const typeImports = components.flatMap((c) =>
    c.methods.length > 0
      ? [`${c.typeName}Props`, `${c.typeName}Events`, `${c.typeName}Element`]
      : [`${c.typeName}Props`, `${c.typeName}Events`],
  )
  lines.push(`import type { ${typeImports.join(', ')} } from './types'`)
  lines.push('')
  for (const c of components) {
    const typeArgs =
      c.methods.length > 0
        ? `${c.typeName}Props, ${c.typeName}Events, ${c.typeName}Element`
        : `${c.typeName}Props, ${c.typeName}Events`
    lines.push(
      `export const ${c.exportName} = createWrapper<${typeArgs}>(metadata.${c.exportName})`,
    )
  }
  lines.push('')
  lines.push('export const componentTags = [')
  for (const c of components) {
    lines.push(`  ${jsonLiteral(c.tagName)},`)
  }
  lines.push('] as const')
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

mkdirSync(outDir, { recursive: true })

writeFileSync(path.join(outDir, 'metadata.ts'), renderMetadata())
writeFileSync(path.join(outDir, 'types.ts'), renderTypes())
writeFileSync(path.join(outDir, 'components.ts'), renderComponents())

const manifestHash = createHash('sha256').update(manifestRaw).digest('hex')
writeFileSync(
  path.join(outDir, 'manifest-hash.json'),
  JSON.stringify({ hash: manifestHash, version: polarisTypesVersion }, null, 2) + '\n',
)

console.warn(`[generate] wrote ${components.length} components to ${path.relative(repoRoot, outDir)}`)
