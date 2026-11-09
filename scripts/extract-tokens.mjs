#!/usr/bin/env node
// Extracts Polaris CSS variables (design tokens) from the Polaris web components runtime
// into tokens/tokens.json. `npm run generate` then renders tokens/tokens.css from it.
//
// Usage:
//   node scripts/extract-tokens.mjs [<url-or-file>] [--summary <file>]
//
//   <url-or-file>  polaris-N.js to read. Defaults to the CDN build whose major matches
//                  @shopify/polaris-types in package.json:
//                  https://cdn.shopify.com/shopifycloud/polaris-<major>.js
//                  A local file is recorded in tokens.json under the default CDN URL.
//   --summary      Also write the Markdown diff summary (for the sync PR body) to <file>.
//
// Network access is only needed here; generation from tokens.json is offline. Exits
// non-zero, without touching tokens.json, when the extraction looks broken (fewer than
// MIN_BASE_TOKENS base tokens, a >20% drop versus the committed file, or CSS that fails
// to parse) so a runtime format change can never silently wipe the tokens.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { diffSummary, extractTokens, groupTokens, guardTokens } from './tokens-lib.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')
const tokensJsonPath = path.join(repoRoot, 'tokens', 'tokens.json')

function fail(message) {
  console.error(`[extract-tokens] ${message}`)
  process.exit(1)
}

function defaultSourceUrl() {
  const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'))
  const range = pkg.devDependencies?.['@shopify/polaris-types']
  const major = /\d+/.exec(range ?? '')?.[0]
  if (!major) fail(`can't read the @shopify/polaris-types major from package.json ("${range}")`)
  return `https://cdn.shopify.com/shopifycloud/polaris-${major}.js`
}

const args = process.argv.slice(2)
let input
let summaryPath
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--summary') summaryPath = args[++i]
  else if (args[i].startsWith('-')) fail(`unknown option ${args[i]}`)
  else input = args[i]
}
if (args.includes('--summary') && !summaryPath) fail('--summary needs a file path')

const isUrl = (value) => /^https?:\/\//.test(value)
const source = input && isUrl(input) ? input : defaultSourceUrl()

let js
if (input && !isUrl(input)) {
  js = readFileSync(input, 'utf8')
} else {
  const response = await fetch(source)
  if (!response.ok) fail(`GET ${source} failed: ${response.status} ${response.statusText}`)
  js = await response.text()
}

let extraction
try {
  extraction = extractTokens(js)
} catch (error) {
  fail(`could not parse ${source}: ${error.message}`)
}
if (extraction.parseErrors.length > 0) {
  fail(`CSS parse errors in ${source}:\n  ${extraction.parseErrors.join('\n  ')}`)
}

const previous = existsSync(tokensJsonPath)
  ? JSON.parse(readFileSync(tokensJsonPath, 'utf8'))
  : undefined

try {
  guardTokens(extraction.tokens, previous?.tokens)
} catch (error) {
  fail(error.message)
}

const doc = { source, tokens: extraction.tokens, themes: extraction.themes }
mkdirSync(path.dirname(tokensJsonPath), { recursive: true })
writeFileSync(tokensJsonPath, `${JSON.stringify(doc, null, 2)}\n`)

const { markdown } = diffSummary(previous, doc)
if (summaryPath) writeFileSync(summaryPath, markdown)

const log = (line) => process.stdout.write(`${line}\n`)
log(`[extract-tokens] ${source} (build hash: ${extraction.hash ?? 'none'})`)
log(`[extract-tokens] ${Object.keys(doc.tokens).length} base tokens`)
for (const [group, entries] of groupTokens(doc.tokens)) log(`  ${group}: ${entries.length}`)
for (const [theme, decls] of Object.entries(doc.themes)) {
  const aliases = extraction.themeAliases[theme] ?? []
  log(
    `[extract-tokens] theme ${theme}${aliases.length ? ` (also ${aliases.join(', ')})` : ''}: ${Object.keys(decls).length} overrides`,
  )
}
log(
  `[extract-tokens] ${extraction.conditional.length} declarations inside @media/@supports not merged (progressive enhancements such as P3 colors)`,
)
if (extraction.unresolved.length > 0) {
  log(`[extract-tokens] internal refs without fallback: ${extraction.unresolved.join(', ')}`)
}
log('')
log(markdown)
