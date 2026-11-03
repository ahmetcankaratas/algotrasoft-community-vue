import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ScannerView from '../ScannerView.vue'
import { getStocks } from '@/services/dataStorage'

vi.mock('@/services/dataStorage', () => ({
  getStocks: vi.fn<typeof getStocks>(),
}))

const getStocksMock = vi.mocked(getStocks)

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE', return_yearly_1: 6.3 },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX', return_yearly_1: -2.4 },
  { id: 3, name: 'First Trust High Income ETF', symbol: 'FTHI', return_yearly_1: 4.3 },
]

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
    getStocksMock.mockReset()
    getStocksMock.mockResolvedValue({ stocks })
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
})
