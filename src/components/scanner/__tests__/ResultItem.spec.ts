import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultItem from '../ResultItem.vue'
import { getBacktest } from '@/services/dataStorage'
import type { BacktestDetails } from '@/types/backtest'

vi.mock('@/services/dataStorage', () => ({
  getBacktest: vi.fn<typeof getBacktest>(),
}))

const getBacktestMock = vi.mocked(getBacktest)

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner/:id', component: { template: '<div />' } }],
})

const backtest: BacktestDetails = {
  id: 1,
  symbol: 'GPRE',
  name: 'Green Plains, Inc.',
  market: 'NASDAQ',
  sector: 'Energy',
  industry: 'Renewable Fuels',
  market_cap: '1.6B',
  return_monthly_1: 1.2,
  return_monthly_3: 2.8,
  return_monthly_6: 4.1,
  return_yearly_1: 6.3,
}

async function mountItem(id = 1, overrides: Partial<BacktestDetails> = {}) {
  getBacktestMock.mockResolvedValue({ ...backtest, id, ...overrides })
  const wrapper = mount(ResultItem, { props: { id }, global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('ResultItem', () => {
  beforeEach(() => {
    getBacktestMock.mockReset()
  })

  it('shows a spinner until the backtest arrives', () => {
    getBacktestMock.mockReturnValue(new Promise(() => {}))
    const wrapper = mount(ResultItem, { props: { id: 1 }, global: { plugins: [router] } })

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('fetches the zero-based backtest for its id', async () => {
    await mountItem(3)
    expect(getBacktestMock).toHaveBeenCalledWith(2)
  })

  it('renders the name, symbol and rounded yearly return', async () => {
    const wrapper = await mountItem()
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.text()).toContain('Green Plains, Inc.')
    expect(wrapper.text()).toContain('GPRE')
    expect(wrapper.find('h4.font-bold').text()).toBe('% 6')
  })

  it('links to the zero-based detail route', async () => {
    const wrapper = await mountItem(3)
    expect(wrapper.find('a').attributes('href')).toBe('/scanner/2')
  })

  it('colours positive returns cyan and negative returns red', async () => {
    expect((await mountItem(1, { return_yearly_1: 6.3 })).find('h4.font-bold').classes()).toContain(
      'text-darkCyan',
    )
    expect(
      (await mountItem(1, { return_yearly_1: -2.4 })).find('h4.font-bold').classes(),
    ).toContain('text-red-500')
    const zero = (await mountItem(1, { return_yearly_1: 0 })).find('h4.font-bold').classes()
    expect(zero).not.toContain('text-darkCyan')
    expect(zero).not.toContain('text-red-500')
  })

  it('renders nothing when the database has no backtest for the id', async () => {
    getBacktestMock.mockResolvedValue(null)
    const wrapper = mount(ResultItem, { props: { id: 99 }, global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('stops loading and shows the error when the request fails', async () => {
    getBacktestMock.mockRejectedValue(new Error('Request failed with status code 401'))
    const wrapper = mount(ResultItem, { props: { id: 1 }, global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('[role="alert"]').text()).toBe('Request failed with status code 401')
  })
})
