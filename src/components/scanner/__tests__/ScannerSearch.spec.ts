import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ScannerSearch from '../ScannerSearch.vue'

describe('ScannerSearch', () => {
  it('renders the search box', () => {
    const wrapper = mount(ScannerSearch)
    expect(wrapper.find('h5').text()).toBe('Search')
    expect(wrapper.find('input[type="text"]').attributes('placeholder')).toBe('Enter Stock Name')
  })

  it('shows the bound value', () => {
    const wrapper = mount(ScannerSearch, { props: { modelValue: 'green' } })
    expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('green')
  })

  it('emits the typed text through v-model', async () => {
    const wrapper = mount(ScannerSearch)

    await wrapper.find('input').setValue('tr')

    expect(wrapper.emitted('update:modelValue')).toEqual([['tr']])
  })
})
