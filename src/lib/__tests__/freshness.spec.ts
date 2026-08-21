import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { readManifestRaw } from './manifest-helpers'

const here = path.dirname(fileURLToPath(import.meta.url))
const manifestHashPath = path.resolve(here, '../generated/manifest-hash.json')

describe('generated code freshness', () => {
  it('matches the sha256 of the currently installed manifest', () => {
    const manifestRaw = readManifestRaw()
    const currentHash = createHash('sha256').update(manifestRaw).digest('hex')

    const recorded = JSON.parse(readFileSync(manifestHashPath, 'utf8')) as {
      hash: string
      version: string
    }

    expect(
      recorded.hash,
      'generated/manifest-hash.json is stale — run `npm run generate` after updating @shopify/polaris-types',
    ).toBe(currentHash)
  })
})
