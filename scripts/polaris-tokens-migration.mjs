// Compares the legacy Polaris React token list (`@shopify/polaris-tokens`, a devDependency)
// with tokens/tokens.json, for the "Migrating from @shopify/polaris-tokens" section of
// docs/guide/css-variables.md. Called by scripts/generate-docs.mjs; deterministic.

import { readFileSync } from 'node:fs'
import path from 'node:path'

import { parse as parseCss } from 'postcss'

import { compareNames, isTokenName } from './tokens-lib.mjs'

/** @param {Iterable<string>} names */
const sorted = (names) => [...names].toSorted(compareNames)

/**
 * @param {string} repoRoot
 * @returns {{ package: string, version: string, shared: number, legacyOnly: string[], runtimeOnly: string[] }}
 */
export function polarisTokensMigration(repoRoot) {
  const pkgDir = path.join(repoRoot, 'node_modules', '@shopify', 'polaris-tokens')
  const { version } = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
  const css = readFileSync(path.join(pkgDir, 'dist', 'css', 'styles.css'), 'utf8')

  // The default (light) theme is the `:root` rule; the other themes only override values.
  const legacy = new Set()
  parseCss(css).walkRules((rule) => {
    if (!rule.selectors.some((s) => s.trim() === ':root')) return
    rule.walkDecls((decl) => {
      if (isTokenName(decl.prop)) legacy.add(decl.prop)
    })
  })
  if (legacy.size < 100) {
    throw new Error(`only ${legacy.size} tokens found in @shopify/polaris-tokens ${version}; did its CSS layout change?`)
  }

  const runtime = new Set(
    Object.keys(JSON.parse(readFileSync(path.join(repoRoot, 'tokens', 'tokens.json'), 'utf8')).tokens),
  )
  return {
    package: '@shopify/polaris-tokens',
    version,
    shared: [...legacy].filter((n) => runtime.has(n)).length,
    legacyOnly: sorted([...legacy].filter((n) => !runtime.has(n))),
    runtimeOnly: sorted([...runtime].filter((n) => !legacy.has(n))),
  }
}
