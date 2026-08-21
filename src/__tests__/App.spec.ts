import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the playground shell', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('name: Ada Lovelace')
    expect(wrapper.text()).toContain('Clicks: 0')
  })
})
