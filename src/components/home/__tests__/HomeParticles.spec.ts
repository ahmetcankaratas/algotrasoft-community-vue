import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeParticles from '../HomeParticles.vue'

describe('HomeParticles', () => {
  it('should create', () => {
    const wrapper = mount(HomeParticles, {
      global: { stubs: { VueParticles: true } },
    })
    expect(wrapper.find('vue-particles-stub').exists()).toBe(true)
  })
})
