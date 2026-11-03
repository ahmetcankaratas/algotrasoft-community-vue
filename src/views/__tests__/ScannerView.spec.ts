import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ScannerView from '../ScannerView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner', component: ScannerView }],
})

describe('ScannerView', () => {
  it('should create', () => {
    const wrapper = mount(ScannerView, { global: { plugins: [createPinia(), router] } })
    expect(wrapper.find('h1').text()).toBe('Scanner')
  })
})
