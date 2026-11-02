import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeWork from '../HomeWork.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner', component: { template: '<div />' } }],
})

describe('HomeWork', () => {
  it('should create', () => {
    const wrapper = mount(HomeWork, { global: { plugins: [router] } })
    expect(wrapper.find('#work').exists()).toBe(true)
    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual([
      'Grow Together',
      'Coding Sessions',
      'Events',
      'Scanner',
    ])
  })

  it('links to the scanner anchor', () => {
    const wrapper = mount(HomeWork, { global: { plugins: [router] } })
    expect(wrapper.find('a').attributes('href')).toBe('/scanner#scanner')
  })
})
