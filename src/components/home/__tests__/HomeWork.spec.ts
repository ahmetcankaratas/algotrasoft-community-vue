import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeWork from '../HomeWork.vue'

describe('HomeWork', () => {
  it('should create', () => {
    const wrapper = mount(HomeWork)
    expect(wrapper.find('#work').exists()).toBe(true)
    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual([
      'Grow Together',
      'Coding Sessions',
      'Events',
      'Scanner',
    ])
  })
})
