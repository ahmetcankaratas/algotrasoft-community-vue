import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders the four ring segments', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.findAll('.lds-ring > div')).toHaveLength(4)
  })
})
