import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { SButton, SEmptyState, SIcon, SNumber, SProgress, SText } from '../generated/components'
import type { NumberProps, ProgressProps } from '../generated/types'
import { metadata } from '../generated/metadata'

// Components added in @shopify/polaris-types 1.1.0. Their runtime behavior was verified in a
// browser against polaris-1.js (and polaris-2.0-rc.js); these specs pin the wrapper-side
// contract those docs examples rely on.

describe('SProgress', () => {
  it('types value and max as numbers', () => {
    expectTypeOf<ProgressProps['value']>().toEqualTypeOf<number | undefined>()
    expectTypeOf<ProgressProps['max']>().toEqualTypeOf<number | undefined>()
  })

  it('renders bound numeric value and max onto the element', () => {
    const wrapper = mount(SProgress, { props: { value: 40, max: 100, tone: 'success' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('s-progress')
    expect(wrapper.attributes('value')).toBe('40')
    expect(wrapper.attributes('max')).toBe('100')
    expect(wrapper.attributes('tone')).toBe('success')
  })

  it('omits value when not provided, which Polaris renders as indeterminate', () => {
    const wrapper = mount(SProgress, { props: { accessibilityLabel: 'Preparing export' } })
    expect(wrapper.attributes('value')).toBeUndefined()
    expect(wrapper.attributes('accessibilitylabel')).toBe('Preparing export')
  })
})

describe('SNumber', () => {
  it('renders its default slot as given, with typography props as attributes', () => {
    const wrapper = mount(SNumber, {
      props: { tone: 'critical', fontWeight: 'semibold' },
      slots: { default: () => '-$58.25' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('s-number')
    expect(wrapper.text()).toBe('-$58.25')
    expect(wrapper.attributes('tone')).toBe('critical')
    expect(wrapper.attributes('fontweight')).toBe('semibold')
  })

  it('rejects a tone that Polaris does not define', () => {
    expectTypeOf<'critical'>().toMatchTypeOf<NonNullable<NumberProps['tone']>>()
    expectTypeOf<'danger'>().not.toMatchTypeOf<NonNullable<NumberProps['tone']>>()
  })
})

describe('SEmptyState', () => {
  const namedSlots = ['graphic', 'primary-action', 'secondary-actions', 'subheading']

  it('declares the named slots the docs example uses', () => {
    expect(metadata.SEmptyState.slots).toEqual(expect.arrayContaining(namedSlots))
  })

  it('forwards every named slot with a matching slot attribute', () => {
    const wrapper = mount(SEmptyState, {
      props: { heading: 'No orders yet' },
      slots: {
        graphic: () => h(SIcon, { type: 'cart' }),
        subheading: () => h(SText, {}, () => 'Orders show up here.'),
        'primary-action': () => h(SButton, { variant: 'primary' }, () => 'Create order'),
        'secondary-actions': () => h(SButton, { variant: 'secondary' }, () => 'Import orders'),
      },
    })

    expect(wrapper.attributes('heading')).toBe('No orders yet')
    const slotted = [...wrapper.element.children].map((el) => el.getAttribute('slot'))
    expect(slotted.toSorted()).toEqual(namedSlots)
    expect(wrapper.element.querySelector('[slot="primary-action"]')?.getAttribute('variant')).toBe('primary')
  })
})
