import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeAbout from '../HomeAbout.vue'

describe('HomeAbout', () => {
  it('should create', () => {
    const wrapper = mount(HomeAbout)
    expect(wrapper.find('#about-us').exists()).toBe(true)
    expect(wrapper.text()).toContain('About Us')
  })
})
