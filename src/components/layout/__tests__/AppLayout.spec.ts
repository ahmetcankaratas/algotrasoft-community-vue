import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from '../AppLayout.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('AppLayout', () => {
  it('renders default header and footer', () => {
    const wrapper = mount(AppLayout, { global: { plugins: [router] } })
    expect(wrapper.find('#navbar').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('renders the default slot as the main area', () => {
    const wrapper = mount(AppLayout, {
      global: { plugins: [router] },
      slots: { default: '<h1>main area</h1>' },
    })
    expect(wrapper.find('.layout-body').text()).toBe('main area')
  })
})
