import { describe, expect, it } from 'vitest'
import * as components from '../generated/components'
import { readManifestComponents } from './manifest-helpers'

describe('generated component coverage', () => {
  const manifestComponents = readManifestComponents()
  const manifestTags = manifestComponents.map((c) => c.tagName).toSorted()

  it('has a componentTags entry for every manifest tag, and only those', () => {
    const generatedTags = [...components.componentTags].toSorted()
    expect(generatedTags).toEqual(manifestTags)
  })

  it('exports a wrapper component for every manifest tag', () => {
    const exportNames = new Set(Object.keys(components))
    for (const tag of manifestTags) {
      const pascal = tag
        .slice(2)
        .split('-')
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
        .join('')
      const expectedExportName = `S${pascal}`
      expect(exportNames.has(expectedExportName), `expected export "${expectedExportName}" for tag "${tag}"`).toBe(
        true,
      )
    }
  })
})
