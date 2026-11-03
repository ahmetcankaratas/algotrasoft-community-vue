import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: HomeView }],
})

describe('HomeView', () => {
  it('should create', () => {
    const wrapper = mount(HomeView, {
      global: { plugins: [createPinia(), router], stubs: { VueParticles: true } },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('#hero').exists()).toBe(true)
  })
})
