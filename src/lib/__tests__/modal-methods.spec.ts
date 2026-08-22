import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { SButton, SModal } from '../generated/components'
import type { ModalElement } from '../generated/types'
import { metadata } from '../generated/metadata'

describe('SModal method fields', () => {
  it('does not list hideOverlay/showOverlay/toggleOverlay as props in generated metadata', () => {
    const propNames = metadata.SModal.props.map((p) => p.name)
    expect(propNames).not.toContain('hideOverlay')
    expect(propNames).not.toContain('showOverlay')
    expect(propNames).not.toContain('toggleOverlay')
  })

  it('ModalElement exposes the three overlay methods with a () => void signature', () => {
    expectTypeOf<ModalElement>().toHaveProperty('hideOverlay')
    expectTypeOf<ModalElement>().toHaveProperty('showOverlay')
    expectTypeOf<ModalElement>().toHaveProperty('toggleOverlay')
    expectTypeOf<ModalElement['hideOverlay']>().toEqualTypeOf<() => void>()
    expectTypeOf<ModalElement['showOverlay']>().toEqualTypeOf<() => void>()
    expectTypeOf<ModalElement['toggleOverlay']>().toEqualTypeOf<() => void>()
  })

  it('forwards a `slot="primary-action"` attribute onto named-slot children', () => {
    const wrapper = mount(SModal, {
      slots: {
        'primary-action': () => h(SButton, {}, () => 'Close'),
      },
    })

    const slotted = wrapper.element.querySelector('s-button')
    expect(slotted).not.toBeNull()
    expect(slotted?.getAttribute('slot')).toBe('primary-action')
  })

  it('forwards an undocumented slot name too, proving forwarding is not gated on meta.slots', () => {
    // "somethingCustom" is not in metadata.SModal.slots — the factory must forward it
    // anyway, since it now iterates the user-provided slots rather than the manifest's
    // (potentially wrong or incomplete) slot-name list.
    expect(metadata.SModal.slots).not.toContain('somethingCustom')

    const wrapper = mount(SModal, {
      slots: {
        somethingCustom: () => h(SButton, {}, () => 'Custom'),
      },
    })

    const slotted = wrapper.element.querySelector('s-button')
    expect(slotted).not.toBeNull()
    expect(slotted?.getAttribute('slot')).toBe('somethingCustom')
  })
})
