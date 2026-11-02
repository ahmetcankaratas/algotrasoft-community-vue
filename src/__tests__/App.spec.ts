import { describe, it, expect } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('renders the home route', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router], stubs: { VueParticles: true } },
    })
    await flushPromises()

    expect(wrapper.find('#hero').exists()).toBe(true)
  })
})
