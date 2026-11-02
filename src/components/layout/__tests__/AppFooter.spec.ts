import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppFooter from '../AppFooter.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('AppFooter', () => {
  it('should create', () => {
    const wrapper = mount(AppFooter, { global: { plugins: [router] } })
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('algotrasoft@gmail.com')
  })

  it('opens the LinkedIn link in a new tab', () => {
    const wrapper = mount(AppFooter, { global: { plugins: [router] } })
    const external = wrapper.find('a[target="_blank"]')
    expect(external.attributes('href')).toContain('linkedin.com')
    expect(external.attributes('rel')).toBe('noreferrer')
  })
})
