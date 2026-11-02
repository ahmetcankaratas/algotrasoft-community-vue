import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'

describe('AppFooter', () => {
  it('should create', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.exists()).toBe(true)
  })
})
