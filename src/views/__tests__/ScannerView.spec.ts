import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ScannerView from '../ScannerView.vue'
import { getStocks, getBacktest } from '@/services/dataStorage'
import {
  MockIntersectionObserver,
  installIntersectionObserverMock,
} from '@/directives/__tests__/intersectionObserver.mock'

vi.mock('@/services/dataStorage', () => ({
  getStocks: vi.fn<typeof getStocks>(),
  getBacktest: vi.fn<typeof getBacktest>(),
}))

const getStocksMock = vi.mocked(getStocks)
const getBacktestMock = vi.mocked(getBacktest)

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE' },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX' },
  { id: 3, name: 'First Trust High Income ETF', symbol: 'FTHI' },
]

function backtestFor(index: number) {
  return {
    ...stocks[index]!,
    market: 'NASDAQ',
    sector: 'Energy',
    industry: 'n/a',
    market_cap: '1B',
    return_monthly_1: 1,
    return_monthly_3: 2,
    return_monthly_6: 3,
    return_yearly_1: index + 1,
  }
}

function mountScanner() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/scanner', component: ScannerView },
      { path: '/scanner/:id', component: { template: '<div />' } },
    ],
  })
  return mount(ScannerView, { global: { plugins: [createPinia(), router] } })
}

describe('ScannerView', () => {
  beforeEach(() => {
    installIntersectionObserverMock()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    getStocksMock.mockReset()
    getStocksMock.mockResolvedValue({ stocks })
    getBacktestMock.mockReset()
    getBacktestMock.mockImplementation(async (index) => backtestFor(index))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should create', () => {
    const wrapper = mountScanner()
    expect(wrapper.find('h1').text()).toBe('Scanner')
  })

  it('shows the spinner and hides the search box while loading', () => {
    getStocksMock.mockReturnValue(new Promise(() => {}))
    const wrapper = mountScanner()

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Enter Stock Name"]').exists()).toBe(false)
    expect(wrapper.findAll('ul > li')).toHaveLength(0)
  })

  it('fills the list and shows the search box once the data arrives', async () => {
    const wrapper = mountScanner()
    await flushPromises()

    expect(getStocksMock).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('input[placeholder="Enter Stock Name"]').exists()).toBe(true)
    expect(wrapper.findAll('ul > li')).toHaveLength(3)
  })

  it('stops loading and logs the error when the request fails', async () => {
    const failure = new Error('Request failed with status code 401')
    getStocksMock.mockRejectedValue(failure)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mountScanner()
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.findAll('ul > li')).toHaveLength(0)
    expect(consoleError).toHaveBeenCalledWith(failure)
    consoleError.mockRestore()
  })

  it('filters the list by the typed stock name', async () => {
    const wrapper = mountScanner()
    await flushPromises()

    await wrapper.find('input[placeholder="Enter Stock Name"]').setValue('first')
    MockIntersectionObserver.revealAll()
    vi.advanceTimersByTime(300)
    await flushPromises()

    expect(wrapper.findAll('ul > li').map((li) => li.find('h4').text())).toEqual(['FTHI'])
  })
})
