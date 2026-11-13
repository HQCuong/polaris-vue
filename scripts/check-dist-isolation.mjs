#!/usr/bin/env node
// Checks that the main `polaris-vue-elements` entry does not pull in App Bridge code.
// Run after `npm run build:lib` (CI and the release workflow do).
//
// - `npm pack --dry-run` must list the `polaris-vue-elements/app-bridge` files.
// - No published `.js` or `.d.ts` file outside `dist/app-bridge/` may mention an App
//   Bridge element or package (that would mean the main entry or a shared chunk carries it).
// - `dist/index.js` may import only `vue`, so no chunk is shared with the app-bridge entry.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FORBIDDEN =
  /ui-modal|ui-save-bar|ui-title-bar|ui-nav-menu|s-app-window|s-app-nav|app-bridge|AppBridge/
const REQUIRED = [
  'dist/app-bridge/index.js',
  'dist/app-bridge/index.d.ts',
  'dist/app-bridge/elements.d.ts',
]

const problems = []

const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
  }),
)
const files = pack.files.map((file) => file.path)

for (const required of REQUIRED) {
  if (!files.includes(required)) problems.push(`missing from the package: ${required}`)
}

for (const file of files) {
  if (file.startsWith('dist/app-bridge/')) continue
  if (!file.endsWith('.js') && !file.endsWith('.d.ts')) continue
  const match = readFileSync(path.join(root, file), 'utf8').match(FORBIDDEN)
  if (match) problems.push(`${file} mentions "${match[0]}"`)
}

const mainImports = [
  ...readFileSync(path.join(root, 'dist/index.js'), 'utf8').matchAll(
    /(?:^|[\s;])(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]/g,
  ),
].map((m) => m[1])
for (const specifier of new Set(mainImports)) {
  if (specifier !== 'vue') problems.push(`dist/index.js imports "${specifier}"`)
}

if (problems.length > 0) {
  console.error('[check-dist-isolation] The main entry is not isolated from App Bridge:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
process.stdout.write(`[check-dist-isolation] ok (${files.length} packed files checked)\n`)
