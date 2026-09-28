#!/usr/bin/env node
// Small helpers around CHANGELOG.md (Keep a Changelog format), used by the release and
// polaris-types sync workflows.
//
// Usage:
//   node scripts/changelog.mjs notes <version>
//     Print the body of the `## [<version>]` section (for GitHub Release notes). Exits
//     non-zero if the section is missing or empty, so a release can't ship undocumented.
//
//   node scripts/changelog.mjs add <Added|Changed|Deprecated|Removed|Fixed|Security> <entry>
//     Append `- <entry>` under `### <kind>` in the `## [Unreleased]` section, creating the
//     subsection if needed. Idempotent: an identical entry is not added twice.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const changelogPath = path.resolve(scriptDir, '..', 'CHANGELOG.md')

// Keep a Changelog's subsection order.
const KINDS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security']

function fail(message) {
  console.error(`[changelog] ${message}`)
  process.exit(1)
}

// Returns [start, end) line indexes of the body of `## [name]` (the lines after the
// heading, up to the next `## ` heading or the link reference definitions at the end).
function findSection(lines, name) {
  const heading = lines.findIndex((line) => line.startsWith(`## [${name}]`))
  if (heading === -1) return null
  let end = heading + 1
  while (end < lines.length && !lines[end].startsWith('## ') && !/^\[[^\]]+\]: /.test(lines[end])) {
    end++
  }
  return [heading + 1, end]
}

function notes(version) {
  if (!version) fail('usage: notes <version>')
  const lines = readFileSync(changelogPath, 'utf8').split('\n')
  const section = findSection(lines, version.replace(/^v/, ''))
  if (!section) fail(`CHANGELOG.md has no "## [${version}]" section`)
  const body = lines.slice(...section).join('\n').trim()
  if (!body) fail(`CHANGELOG.md section "## [${version}]" is empty`)
  process.stdout.write(`${body}\n`)
}

function add(kind, entry) {
  if (!KINDS.includes(kind)) fail(`kind must be one of ${KINDS.join(', ')}`)
  if (!entry) fail('usage: add <kind> <entry>')
  const lines = readFileSync(changelogPath, 'utf8').split('\n')
  const section = findSection(lines, 'Unreleased')
  if (!section) fail('CHANGELOG.md has no "## [Unreleased]" section')
  const [start, end] = section
  const bullet = `- ${entry}`
  if (lines.slice(start, end).includes(bullet)) return

  const subheading = lines.findIndex((line, i) => i >= start && i < end && line === `### ${kind}`)
  if (subheading !== -1) {
    // Append after the subsection's last bullet (or its heading if it has none yet).
    let insertAt = subheading + 1
    while (insertAt < end && !lines[insertAt].startsWith('### ')) insertAt++
    while (insertAt > subheading + 1 && lines[insertAt - 1].trim() === '') insertAt--
    lines.splice(insertAt, 0, bullet)
  } else {
    // Insert a new subsection before the first existing subsection that sorts after it.
    const rank = KINDS.indexOf(kind)
    let insertAt = end
    for (let i = start; i < end; i++) {
      const match = /^### (\w+)$/.exec(lines[i])
      if (match && KINDS.indexOf(match[1]) > rank) {
        insertAt = i
        break
      }
    }
    while (insertAt > start && lines[insertAt - 1].trim() === '') insertAt--
    lines.splice(insertAt, 0, '', `### ${kind}`, '', bullet)
  }
  writeFileSync(changelogPath, lines.join('\n'))
}

const [command, ...args] = process.argv.slice(2)
if (command === 'notes') notes(args[0])
else if (command === 'add') add(args[0], args.slice(1).join(' '))
else fail('usage: changelog.mjs notes <version> | add <kind> <entry>')
