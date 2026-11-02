import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeHero from '../HomeHero.vue'

describe('HomeHero', () => {
  it('should create', () => {
    const wrapper = mount(HomeHero)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('THE NEXT GENERATION')
  })
})
