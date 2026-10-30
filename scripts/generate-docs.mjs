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

import { domEventType } from './dom-event-types.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const polarisTypesDir = path.join(repoRoot, 'node_modules', '@shopify', 'polaris-types')
const manifestPath = path.join(polarisTypesDir, 'dist', 'custom-elements.json')
const pkgPath = path.join(polarisTypesDir, 'package.json')

const repoPkgPath = path.join(repoRoot, 'package.json')

const overridesPath = path.join(repoRoot, 'src', 'lib', 'overrides.ts')
const examplesDir = path.join(repoRoot, 'docs', 'examples')
const bestPracticesDir = path.join(repoRoot, 'docs', 'best-practices')
const localesDir = path.join(repoRoot, 'docs', 'locales')

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

// Manifest descriptions link to Shopify's own docs with root-relative markdown links
// (e.g. `[responsive values](/docs/api/polaris/using-polaris-web-components)`). On this
// site those resolve to nonexistent pages and fail the VitePress dead-link check, so
// point them back at shopify.dev.
function manifestDescription(value) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\]\(\/(?!\/)/g, '](https://shopify.dev/')
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
    const description = manifestDescription(field.description)
    const source = typeof field.description === 'string' ? field.description.trim() : ''

    if (FUNCTION_TYPE_RE.test(typeText)) {
      methods.push({ name: field.name, type: typeText, description, source })
      continue
    }

    props.push({ name: field.name, type: typeText, description, source })
  }
  props.sort((a, b) => a.name.localeCompare(b.name))
  methods.sort((a, b) => a.name.localeCompare(b.name))

  const events = (raw.events ?? []).map((e) => {
    assert(typeof e.name === 'string', `component "${raw.tagName}" has an event with no name`)
    const typeText = e.type && typeof e.type.text === 'string' ? e.type.text : 'CustomEvent'
    return { name: e.name, type: domEventType(raw.tagName, e.name, typeText) }
  })
  events.sort((a, b) => a.name.localeCompare(b.name))

  const slots = (raw.slots ?? []).map((s) => ({
    name: typeof s.name === 'string' ? s.name : '',
    description: manifestDescription(s.description),
    source: typeof s.description === 'string' ? s.description.trim() : '',
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

// ---------------------------------------------------------------------------
// Hand-written best practices (docs/best-practices/<tag>.md)
//
// Our own wording of Shopify's guidance for each component, ending with a link
// to the matching section on shopify.dev. Not every component has one: Shopify
// doesn't publish best practices for all of them, and we don't invent any.
// ---------------------------------------------------------------------------

const bestPracticeFiles = existsSync(bestPracticesDir)
  ? readdirSync(bestPracticesDir).filter((f) => f.endsWith('.md'))
  : []

const bestPractices = new Map()
for (const file of bestPracticeFiles) {
  const tag = file.slice(0, -'.md'.length)
  assert(
    components.some((c) => c.tagName === tag),
    `docs/best-practices/${file} is for unknown tag "${tag}" (not found in the manifest). Has Shopify removed it?`,
  )
  bestPractices.set(tag, readFileSync(path.join(bestPracticesDir, file), 'utf8').trimEnd())
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
    tags: ['s-badge', 's-banner', 's-empty-state', 's-progress', 's-spinner'],
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
    tags: ['s-chip', 's-heading', 's-number', 's-paragraph', 's-text', 's-tooltip'],
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

// Hand-written one-sentence summary per component. The manifest has no component-level
// prose (its descriptions are boilerplate like "Configure the following properties on the
// avatar component."), so this is the only place a page says what the component is for.
// It becomes the page's lead paragraph, the start of its meta description, and the card
// text on the components index. Like CATEGORIES, every manifest tag must have exactly one.
const SUMMARIES = {
  's-button': 'Triggers an action or navigates, with primary, secondary and tertiary variants, icons and a loading state.',
  's-button-group': 'Lays out a set of related buttons together, such as a primary action and its secondary actions.',
  's-clickable': 'Makes any content clickable as a button or link, without imposing button styling.',
  's-clickable-chip': 'An interactive chip that can be clicked, followed as a link or removed — useful for filters and applied tags.',
  's-link': 'A text link that navigates to another page or URL, or runs a command.',
  's-menu': 'A list of actions shown in an overlay, opened from a button.',
  's-press-button': 'A toggle button that stays pressed or unpressed, for turning a mode or filter on and off.',
  's-badge': 'A small label that shows the status of an object, such as an order, payment or fulfillment.',
  's-banner': 'A prominent message that surfaces important information, warnings or errors at the top of a page or section.',
  's-empty-state': 'Explains why a view has no content yet and points merchants to the first action to take.',
  's-progress': 'A progress bar that shows how far a task has advanced toward its maximum value.',
  's-spinner': 'An animated indicator that content or an action is loading.',
  's-checkbox': 'A single checkbox for a yes/no choice, bound to its checked state with v-model.',
  's-choice': 'One option inside a choice list.',
  's-choice-list': 'A group of radio buttons or checkboxes for picking one or several options.',
  's-color-field': 'A text input for entering a color value, with an optional alpha channel.',
  's-color-picker': 'A visual control for picking a color.',
  's-date-field': 'An input for entering a date.',
  's-date-picker': 'A calendar for selecting a single date or a date range.',
  's-drop-zone': 'A file upload area that accepts files by drag and drop or from a file picker.',
  's-email-field': 'A text input for email addresses.',
  's-money-field': 'A numeric input for monetary amounts.',
  's-number-field': 'A numeric input with optional minimum, maximum and step.',
  's-option': 'One option inside a select.',
  's-option-group': 'Groups related options inside a select under a shared label.',
  's-password-field': 'A text input for passwords that masks what is typed.',
  's-search-field': 'A text input for search queries.',
  's-select': 'A dropdown for choosing one option from a list.',
  's-switch': 'A toggle switch that turns a setting on or off.',
  's-text-area': 'A multi-line text input for longer content such as notes or descriptions.',
  's-text-field': 'A single-line text input with label, placeholder, validation error and help text.',
  's-url-field': 'A text input for web addresses.',
  's-box': 'A generic container for padding, background, border, radius and sizing.',
  's-divider': 'A horizontal or vertical line that separates content.',
  's-grid': 'A CSS grid container for laying out content in rows and columns.',
  's-grid-item': 'A child of a grid that can span several columns or rows.',
  's-list-item': 'One item inside an ordered or unordered list.',
  's-ordered-list': 'A numbered list.',
  's-page': 'The top-level page layout, with a heading, page actions and content areas.',
  's-query-container': 'Turns an element into a size container so its children can adapt to its width with container queries.',
  's-scroll-box': 'A container that scrolls its content when it overflows.',
  's-section': 'Groups related content, with an optional heading, subheading and actions.',
  's-stack': 'Arranges its children in a row or column with consistent spacing and alignment.',
  's-table': 'A table for structured data, with optional pagination, a loading state and a list layout on small screens.',
  's-table-body': 'The body of a table, holding its data rows.',
  's-table-cell': 'One cell in a table row.',
  's-table-header': 'One column header in a table.',
  's-table-header-row': 'The row of column headers at the top of a table.',
  's-table-row': 'One row of data in a table.',
  's-unordered-list': 'A bulleted list.',
  's-avatar': "Shows a person's or business's image, or their initials when there is no image.",
  's-icon': 'Displays an icon from the Polaris icon set by name.',
  's-image': 'Displays an image with control over aspect ratio, fit, borders and lazy loading.',
  's-thumbnail': 'A small, fixed-size preview image of a product or file.',
  's-modal': 'A dialog overlay for focused tasks and confirmations, opened by a command or a method call.',
  's-popover': 'Floating content anchored to the button that opens it.',
  's-chip': 'A static label for a tag or attribute, optionally removable.',
  's-heading': 'A heading that titles a page section.',
  's-number': 'Displays a number you have already formatted, with typography, tone and color styling.',
  's-paragraph': 'A block of body text.',
  's-text': 'Inline text with tone, weight and emphasis styling.',
  's-tooltip': 'A short label that appears when another element is hovered or focused.',
}

for (const tag of Object.keys(SUMMARIES)) {
  assert(
    components.some((c) => c.tagName === tag),
    `SUMMARIES has an entry for unknown tag "${tag}" (not found in the manifest). Has Shopify removed it?`,
  )
}
const unsummarized = components.filter((c) => !SUMMARIES[c.tagName]).map((c) => c.tagName)
assert(
  unsummarized.length === 0,
  `these manifest tags have no one-sentence entry in SUMMARIES: ${unsummarized.join(', ')}.`,
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
function rewriteRelativeImportsForInlining(content, examplesPath) {
  return content.replace(/(from\s+['"])\.\//g, `$1${examplesPath}/`)
}

// ---------------------------------------------------------------------------
// Locales
//
// English is the source of truth and renders to docs/components/. Every other
// locale renders the same pages under docs/<code>/components/ from its folder in
// docs/locales/<code>/: generator.mjs (the generated prose), summaries.json,
// manifest.json (Shopify's prop/slot descriptions keyed by their English text)
// and best-practices/ / examples/ overrides. A description with no translation
// yet (Shopify added or reworded one) falls back to English, so a polaris-types
// sync never breaks the build; the count is reported below.
// ---------------------------------------------------------------------------

const EN = {
  code: 'en',
  linkPrefix: '',
  componentsDir: path.join(repoRoot, 'docs', 'components'),
  sidebarPath: path.join(repoRoot, 'docs', '.vitepress', 'components-sidebar.json'),
  examplesPath: '../examples',
  summaries: SUMMARIES,
  bestPractices,
  examples: handWrittenExamples,
  translate: (item) => item.description,
  t: {
    categories: {},
    headings: {
      bestPractices: 'Best practices',
      example: 'Example',
      vModel: 'v-model',
      props: 'Props',
      events: 'Events',
      methods: 'Methods',
      slots: 'Slots',
    },
    table: { prop: 'Prop', type: 'Type', description: 'Description', event: 'Event', slot: 'Slot' },
    defaultSlot: 'default',
    exampleContent: (name) => `Example ${name} content`,
    intro: (summary, name, tag) =>
      `${summary} \`${name}\` is the typed Vue 3 wrapper for Shopify's Polaris \`<${tag}>\` web component.`,
    // `<title>` per component page. The H1 stays `SButton <s-button>`; the title adds the
    // words people search for (Shopify, Polaris, Vue) and the component's plain name.
    title: (name, tag, plain) => `${name} (${tag}) – Shopify Polaris ${plain} for Vue 3`,
    // One-line `<meta name="description">`: the hand-written summary, which makes each
    // page's snippet distinct, followed by what the reference documents.
    description: (name, summary, tag, vModel) =>
      `${name}: ${summary} Typed Vue 3 wrapper for Shopify Polaris <${tag}> — props, events${vModel ? ', v-model' : ''} and slots.`,
    vModel: (name, prop, event) =>
      `\`v-model\` on \`<${name}>\` binds to the \`${prop}\` property and listens for the \`${event}\` DOM event.`,
    vModelEquivalent: 'is equivalent to:',
    truncatedTypes:
      "> Some type columns above are truncated for readability; the full union is available in the library's generated TypeScript types (`src/lib/generated/types.ts`).",
    eventsHint: (event, name) => `Listen for these with \`@${event}\`-style listeners on \`<${name}>\`.`,
    methodsIntro: (name) =>
      `\`<${name}>\` exposes the following methods on its underlying DOM element (accessible via a typed template ref):`,
    index: {
      title: 'Shopify Polaris web components for Vue 3',
      description: (count) =>
        `Browse all ${count} typed Vue 3 wrappers for Shopify Polaris web components, grouped by category — actions, forms, layout, feedback, tables and more.`,
      heading: 'Components',
      lead: (count) =>
        `${count} typed Vue wrappers, one per Polaris web component, grouped the way [Shopify's own reference](https://shopify.dev/docs/api/app-home/polaris-web-components) groups them.`,
    },
  },
}

function readTagFiles(dir, label) {
  const map = new Map()
  if (!existsSync(dir)) return map
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const tag = file.slice(0, -'.md'.length)
    assert(
      components.some((c) => c.tagName === tag),
      `${label}/${file} is for unknown tag "${tag}" (not found in the manifest). Has Shopify removed it?`,
    )
    map.set(tag, readFileSync(path.join(dir, file), 'utf8').trimEnd())
  }
  return map
}

async function loadLocale(code) {
  const dir = path.join(localesDir, code)
  const rel = path.relative(repoRoot, dir)
  const t = (await import(path.join(dir, 'generator.mjs'))).default
  const summaries = JSON.parse(readFileSync(path.join(dir, 'summaries.json'), 'utf8'))
  for (const tag of Object.keys(SUMMARIES)) {
    assert(typeof summaries[tag] === 'string', `${rel}/summaries.json is missing "${tag}"`)
  }
  const catalogPath = path.join(dir, 'manifest.json')
  const catalog = existsSync(catalogPath) ? JSON.parse(readFileSync(catalogPath, 'utf8')) : {}
  const untranslated = new Set()
  return {
    code,
    linkPrefix: `/${code}`,
    componentsDir: path.join(repoRoot, 'docs', code, 'components'),
    sidebarPath: path.join(repoRoot, 'docs', '.vitepress', `components-sidebar.${code}.json`),
    examplesPath: '../../examples',
    summaries,
    // Untranslated best practices fall back to English rather than vanishing.
    bestPractices: new Map([...bestPractices, ...readTagFiles(path.join(dir, 'best-practices'), `${rel}/best-practices`)]),
    examples: new Map([...handWrittenExamples, ...readTagFiles(path.join(dir, 'examples'), `${rel}/examples`)]),
    untranslated,
    translate(item) {
      if (!item.source) return item.description
      const translated = catalog[item.source]
      if (typeof translated === 'string' && translated.trim() !== '') return manifestDescription(translated)
      untranslated.add(item.source)
      return item.description
    },
    t,
  }
}

function renderBestPracticesSection(component, loc) {
  const content = loc.bestPractices.get(component.tagName)
  return content ? [`## ${loc.t.headings.bestPractices}`, '', content, ''].join('\n') : ''
}

function renderExampleSection(component, loc) {
  const handWritten = loc.examples.get(component.tagName)
  if (handWritten) {
    return [
      `## ${loc.t.headings.example}`,
      '',
      rewriteRelativeImportsForInlining(handWritten, loc.examplesPath),
      '',
    ].join('\n')
  }

  if (!SAFE_PREVIEW_TAGS.has(component.tagName)) {
    return ''
  }

  const content = loc.t.exampleContent(component.exportName)
  const lines = []
  lines.push(`## ${loc.t.headings.example}`)
  lines.push('')
  lines.push('<script setup>')
  lines.push(`import { ${component.exportName} } from '@lib'`)
  lines.push('</script>')
  lines.push('')
  lines.push(`<${component.exportName}>${content}</${component.exportName}>`)
  lines.push('')
  lines.push('```vue')
  lines.push('<script setup>')
  lines.push(`import { ${component.exportName} } from '${packageName}'`)
  lines.push('</script>')
  lines.push('')
  lines.push('<template>')
  lines.push(`  <${component.exportName}>${content}</${component.exportName}>`)
  lines.push('</template>')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderVModelSection(component, loc) {
  const override = vModelOverrides.get(component.tagName)
  if (!override) return ''

  const lines = []
  lines.push(`## ${loc.t.headings.vModel}`)
  lines.push('')
  lines.push(loc.t.vModel(component.exportName, override.prop, override.event))
  lines.push('')
  lines.push('```vue-html')
  lines.push(`<${component.exportName} v-model="value" />`)
  lines.push('```')
  lines.push('')
  lines.push(loc.t.vModelEquivalent)
  lines.push('')
  lines.push('```vue-html')
  lines.push(
    `<${component.exportName} :${override.prop}="value" @${override.event}="value = $event.target.${override.prop}" />`,
  )
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

function renderPropsSection(component, loc) {
  if (component.props.length === 0) return ''

  let anyTruncated = false
  const rows = component.props.map((p) => {
    const { cell, truncated } = formatTypeCell(p.type)
    if (truncated) anyTruncated = true
    const description = loc.translate(p)
    return [`\`${p.name}\``, cell, description ? escapeTableCell(description) : '']
  })

  const lines = []
  lines.push(`## ${loc.t.headings.props}`)
  lines.push('')
  lines.push(renderTable([loc.t.table.prop, loc.t.table.type, loc.t.table.description], rows))
  if (anyTruncated) {
    lines.push('')
    lines.push(loc.t.truncatedTypes)
  }
  lines.push('')
  return lines.join('\n')
}

function renderEventsSection(component, loc) {
  if (component.events.length === 0) return ''

  const rows = component.events.map((e) => [`\`${e.name}\``, `\`${escapeTableCell(e.type)}\``])

  const lines = []
  lines.push(`## ${loc.t.headings.events}`)
  lines.push('')
  lines.push(renderTable([loc.t.table.event, loc.t.table.type], rows))
  lines.push('')
  lines.push(loc.t.eventsHint(component.events[0].name, component.exportName))
  lines.push('')
  return lines.join('\n')
}

function renderMethodsSection(component, loc) {
  if (component.methods.length === 0) return ''

  const lines = []
  lines.push(`## ${loc.t.headings.methods}`)
  lines.push('')
  lines.push(loc.t.methodsIntro(component.exportName))
  lines.push('')
  for (const m of component.methods) {
    const description = loc.translate(m)
    lines.push(`- \`${m.name}${m.type}\`${description ? ` — ${description}` : ''}`)
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

function renderSlotsSection(component, loc) {
  if (component.slots.length === 0) return ''

  const rows = component.slots.map((s) => {
    const description = loc.translate(s)
    return [
      `\`${s.name === '' ? loc.t.defaultSlot : s.name}\``,
      description ? escapeTableCell(description) : '',
    ]
  })

  const lines = []
  lines.push(`## ${loc.t.headings.slots}`)
  lines.push('')
  lines.push(renderTable([loc.t.table.slot, loc.t.table.description], rows))
  lines.push('')
  return lines.join('\n')
}

// YAML front matter. Descriptions are double-quoted so `<s-tag>`, colons and
// commas never need escaping beyond `"` and `\`.
function frontmatter(fields) {
  const lines = ['---']
  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key}: ${JSON.stringify(value)}`)
  }
  lines.push('---')
  return lines.join('\n')
}

function renderComponentPage(component, loc) {
  const summary = loc.summaries[component.tagName]
  const plainName = component.tagName.replace(/^s-/, '').replaceAll('-', ' ')
  const header = [
    frontmatter({
      title: loc.t.title(component.exportName, component.tagName, plainName),
      description: loc.t.description(
        component.exportName,
        summary,
        component.tagName,
        vModelOverrides.has(component.tagName),
      ),
    }),
    banner(),
    '',
    `# ${component.exportName} \`<${component.tagName}>\``,
    '',
    loc.t.intro(summary, component.exportName, component.tagName),
    '',
    '```ts',
    `import { ${component.exportName} } from '${packageName}'`,
    '```',
  ].join('\n')

  const optionalSections = [
    renderBestPracticesSection(component, loc),
    renderExampleSection(component, loc),
    renderVModelSection(component, loc),
    renderPropsSection(component, loc),
    renderEventsSection(component, loc),
    renderMethodsSection(component, loc),
    renderSlotsSection(component, loc),
  ].filter((s) => s !== '')

  const body = [header, ...optionalSections].join('\n\n')

  return body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

const componentByTag = new Map(components.map((c) => [c.tagName, c]))

function categoryComponents(category) {
  return category.tags
    .map((tag) => componentByTag.get(tag))
    .toSorted((a, b) => a.exportName.localeCompare(b.exportName))
}

function categoryText(category, loc) {
  return loc.t.categories[category.text] ?? category.text
}

// docs/components/index.md — the target of the "Components" nav link, and a
// browse-by-category overview of every wrapper.
function renderComponentsIndex(loc) {
  const lines = [
    frontmatter({
      title: loc.t.index.title,
      description: loc.t.index.description(components.length),
    }),
    banner(),
    '',
    `# ${loc.t.index.heading}`,
    '',
  ]
  lines.push(loc.t.index.lead(components.length))
  lines.push('')

  for (const category of CATEGORIES) {
    lines.push(`## ${categoryText(category, loc)}`)
    lines.push('')
    lines.push('<div class="component-grid">')
    lines.push('')
    for (const c of categoryComponents(category)) {
      lines.push(
        `- [**${c.exportName}**<span class="component-grid-tag">&lt;${c.tagName}&gt;</span><span class="component-grid-summary">${loc.summaries[c.tagName]}</span>](${loc.linkPrefix}/components/${c.tagName})`,
      )
    }
    lines.push('')
    lines.push('</div>')
    lines.push('')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

const localeCodes = existsSync(localesDir)
  ? readdirSync(localesDir)
      .toSorted()
      .filter((code) => existsSync(path.join(localesDir, code, 'generator.mjs')))
  : []
const locales = [EN, ...(await Promise.all(localeCodes.map(loadLocale)))]

for (const loc of locales) {
  mkdirSync(loc.componentsDir, { recursive: true })

  for (const component of components) {
    writeFileSync(path.join(loc.componentsDir, `${component.tagName}.md`), renderComponentPage(component, loc))
  }

  // One VitePress sidebar group per category, in the order CATEGORIES declares them, with
  // components sorted by export name inside each group. Groups start collapsed — VitePress
  // auto-expands whichever one contains the page you're on, so the sidebar stays short.
  const sidebar = CATEGORIES.map((category) => ({
    text: categoryText(category, loc),
    collapsed: true,
    items: categoryComponents(category).map((c) => ({
      text: c.exportName,
      link: `${loc.linkPrefix}/components/${c.tagName}`,
    })),
  }))

  mkdirSync(path.dirname(loc.sidebarPath), { recursive: true })
  writeFileSync(loc.sidebarPath, JSON.stringify(sidebar, null, 2) + '\n')

  const indexPath = path.join(loc.componentsDir, 'index.md')
  writeFileSync(indexPath, renderComponentsIndex(loc))

  const untranslated = loc.untranslated?.size
    ? ` (${loc.untranslated.size} Shopify descriptions not yet translated, shown in English)`
    : ''
  console.warn(
    `[generate-docs] ${loc.code}: wrote ${components.length} component pages in ${CATEGORIES.length} categories to ${path.relative(repoRoot, loc.componentsDir)}, plus ${path.relative(repoRoot, indexPath)} and ${path.relative(repoRoot, loc.sidebarPath)}${untranslated}`,
  )
}
