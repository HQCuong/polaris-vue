// Compares the legacy Polaris React token list (`@shopify/polaris-tokens`) with
// tokens/tokens.json, for the "Migrating from @shopify/polaris-tokens" page,
// docs/css-variables/migration.md. Called by scripts/generate-docs.mjs; deterministic.
//
// The legacy names come from scripts/data/polaris-tokens-names.json, a snapshot of the
// `:root` rule in @shopify/polaris-tokens 9.4.2's dist/css/styles.css. The package is
// Polaris React's and no longer changes, so a snapshot avoids carrying it (and its
// dependencies) as a devDependency.

import { readFileSync } from 'node:fs'
import path from 'node:path'

import { compareNames } from './tokens-lib.mjs'

/** @param {Iterable<string>} names */
const sorted = (names) => [...names].toSorted(compareNames)

/**
 * @param {string} repoRoot
 * @returns {{ package: string, version: string, shared: number, legacyOnly: string[], runtimeOnly: string[] }}
 */
export function polarisTokensMigration(repoRoot) {
  const snapshot = JSON.parse(
    readFileSync(path.join(repoRoot, 'scripts', 'data', 'polaris-tokens-names.json'), 'utf8'),
  )
  const { version } = snapshot
  const legacy = new Set(snapshot.names)
  if (legacy.size < 100) {
    throw new Error(`only ${legacy.size} names in scripts/data/polaris-tokens-names.json`)
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
