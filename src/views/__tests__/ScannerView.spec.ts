import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ScannerView from '../ScannerView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner', component: ScannerView }],
})

describe('ScannerView', () => {
  it('should create', () => {
    const wrapper = mount(ScannerView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Selam')
  })
})
