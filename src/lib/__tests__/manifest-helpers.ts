import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../../../')

export const manifestPath = path.join(
  repoRoot,
  'node_modules',
  '@shopify',
  'polaris-types',
  'dist',
  'custom-elements.json',
)

export function readManifestRaw(): string {
  return readFileSync(manifestPath, 'utf8')
}

export interface RawManifestComponent {
  tagName: string
  name: string
  events?: Array<{ name: string }>
  members?: Array<{ kind: string; name?: string; privacy?: string; static?: boolean }>
}

export function readManifestComponents(): RawManifestComponent[] {
  const manifest = JSON.parse(readManifestRaw()) as {
    modules: Array<{ declarations?: Array<Record<string, unknown>> }>
  }
  const components: RawManifestComponent[] = []
  for (const mod of manifest.modules) {
    for (const decl of mod.declarations ?? []) {
      if (decl.tagName) components.push(decl as unknown as RawManifestComponent)
    }
  }
  return components
}
