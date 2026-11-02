import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppLayout from '../AppLayout.vue'

describe('AppLayout', () => {
  it('renders default header and footer', () => {
    const wrapper = mount(AppLayout)
    expect(wrapper.text()).toContain('header works!')
    expect(wrapper.text()).toContain('footer works!')
  })

  it('renders the default slot as the main area', () => {
    const wrapper = mount(AppLayout, {
      slots: { default: '<h1>main area</h1>' },
    })
    expect(wrapper.find('.layout-body').text()).toBe('main area')
  })
})
