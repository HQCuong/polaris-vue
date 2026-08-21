import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { SButton, STextField } from '../generated/components'

describe('SButton', () => {
  it('renders an s-button element', () => {
    const wrapper = mount(SButton)
    expect(wrapper.element.tagName.toLowerCase()).toBe('s-button')
  })

  it('renders a non-boolean prop as an attribute', () => {
    const wrapper = mount(SButton, { props: { variant: 'primary' } })
    expect(wrapper.attributes('variant')).toBe('primary')
  })

  it('does not render a false boolean prop as an attribute', () => {
    const wrapper = mount(SButton, { props: { disabled: false } })
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('renders a true boolean prop as an empty attribute', () => {
    const wrapper = mount(SButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBe('')
  })

  it('fires a click listener attached via @click', async () => {
    const onClick = vi.fn<() => void>()
    const wrapper = mount(SButton, { attrs: { onClick } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('STextField v-model', () => {
  it('renders modelValue as the value attribute', () => {
    const wrapper = mount(STextField, { props: { modelValue: 'hello' } })
    expect(wrapper.attributes('value')).toBe('hello')
  })

  it('emits update:modelValue from the mapped input event', async () => {
    const wrapper = mount(STextField, { props: { modelValue: 'hello' } })
    const el = wrapper.element as unknown as { value: string }
    el.value = 'world'
    wrapper.element.dispatchEvent(new CustomEvent('input'))
    await wrapper.vm.$nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['world'])
  })
})
