import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ContactView from '../ContactView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/contact', component: ContactView }],
})

describe('ContactView', () => {
  it('should create', () => {
    const wrapper = mount(ContactView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Email: algotrasoft@gmail.com')
  })
})
