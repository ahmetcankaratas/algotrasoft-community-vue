import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultItem from '../ResultItem.vue'
import type { MarketResponseResult } from '@/types/market'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner/:id', component: { template: '<div />' } }],
})

function mountItem(overrides: Partial<MarketResponseResult> = {}) {
  const result: MarketResponseResult = {
    id: 1,
    name: 'Green Plains, Inc.',
    symbol: 'GPRE',
    return_yearly_1: 6.3,
    ...overrides,
  }
  return mount(ResultItem, { props: { result }, global: { plugins: [router] } })
}

describe('ResultItem', () => {
  it('renders the name, symbol and rounded yearly return', () => {
    const wrapper = mountItem()
    expect(wrapper.text()).toContain('Green Plains, Inc.')
    expect(wrapper.text()).toContain('GPRE')
    expect(wrapper.find('h4.font-bold').text()).toBe('% 6')
  })

  it('links to the zero-based detail route', () => {
    const wrapper = mountItem({ id: 3 })
    expect(wrapper.find('a').attributes('href')).toBe('/scanner/2')
  })

  it('colours positive returns cyan and negative returns red', () => {
    expect(mountItem({ return_yearly_1: 6.3 }).find('h4.font-bold').classes()).toContain(
      'text-darkCyan',
    )
    expect(mountItem({ return_yearly_1: -2.4 }).find('h4.font-bold').classes()).toContain(
      'text-red-500',
    )
    const zero = mountItem({ return_yearly_1: 0 }).find('h4.font-bold').classes()
    expect(zero).not.toContain('text-darkCyan')
    expect(zero).not.toContain('text-red-500')
  })
})
