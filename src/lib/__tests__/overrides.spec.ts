import { describe, expect, it } from 'vitest'
import { vModelOverrides } from '../overrides'
import { readManifestComponents } from './manifest-helpers'

describe('vModelOverrides', () => {
  const manifestComponents = readManifestComponents()
  const byTag = new Map(manifestComponents.map((c) => [c.tagName, c]))

  it('every override key is a real manifest tag', () => {
    for (const tag of Object.keys(vModelOverrides)) {
      expect(byTag.has(tag), `"${tag}" is not a tag in the manifest`).toBe(true)
    }
  })

  it("every override's event exists on that component", () => {
    for (const [tag, override] of Object.entries(vModelOverrides)) {
      const component = byTag.get(tag)
      expect(component, `"${tag}" is not a tag in the manifest`).toBeDefined()
      const eventNames = (component?.events ?? []).map((e) => e.name)
      expect(
        eventNames,
        `"${tag}" has no "${override.event}" event (has: ${eventNames.join(', ')})`,
      ).toContain(override.event)
    }
  })

  it("every override's prop exists as a field on that component", () => {
    for (const [tag, override] of Object.entries(vModelOverrides)) {
      const component = byTag.get(tag)
      const fieldNames = (component?.members ?? [])
        .filter((m) => m.kind === 'field' && m.name)
        .map((m) => m.name)
      expect(
        fieldNames,
        `"${tag}" has no "${override.prop}" field (has: ${fieldNames.join(', ')})`,
      ).toContain(override.prop)
    }
  })

  it('no form-like component is missing a v-model override', () => {
    // A "form-like" component: has an `input` or `change` event, and a `value` or
    // `checked` field to bind. If a new Shopify component matches this shape, it needs
    // an entry in overrides.ts — this test fails hard so it can't slip through silently.
    const missing: string[] = []
    for (const component of manifestComponents) {
      const eventNames = new Set((component.events ?? []).map((e) => e.name))
      const hasFormEvent = eventNames.has('input') || eventNames.has('change')
      const fieldNames = new Set((component.members ?? [])
        .filter((m) => m.kind === 'field' && m.name)
        .map((m) => m.name))
      const hasFormField = fieldNames.has('value') || fieldNames.has('checked')

      if (hasFormEvent && hasFormField && !(component.tagName in vModelOverrides)) {
        missing.push(component.tagName)
      }
    }

    expect(missing, `these form-like components have no v-model override: ${missing.join(', ')}`).toEqual(
      [],
    )
  })
})
