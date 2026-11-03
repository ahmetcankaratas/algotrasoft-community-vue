import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ScannerSearch from '../ScannerSearch.vue'

describe('ScannerSearch', () => {
  it('renders the search box', () => {
    const wrapper = mount(ScannerSearch)
    expect(wrapper.find('h5').text()).toBe('Search')
    expect(wrapper.find('input[type="text"]').attributes('placeholder')).toBe('Enter Stock Name')
  })
})
