import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AppHeader from '../AppHeader.vue'

describe('AppHeader', () => {
  it('should create', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.exists()).toBe(true)
  })
})
