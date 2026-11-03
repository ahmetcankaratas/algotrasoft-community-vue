import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultList from '../ResultList.vue'
import ResultItem from '../ResultItem.vue'
import { useResultsStore } from '@/stores/results'
import { getBacktest } from '@/services/dataStorage'
import {
  MockIntersectionObserver,
  installIntersectionObserverMock,
} from '@/directives/__tests__/intersectionObserver.mock'

vi.mock('@/services/dataStorage', () => ({
  getBacktest: vi.fn<typeof getBacktest>(),
}))

const getBacktestMock = vi.mocked(getBacktest)

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner/:id', component: { template: '<div />' } }],
})

const stocks = [
  { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE' },
  { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX' },
  { id: 3, name: 'First Trust High Income ETF', symbol: 'FTHI' },
]

function backtestFor(id: number) {
  const stock = stocks.find((s) => s.id === id)!
  return {
    ...stock,
    market: 'NASDAQ',
    sector: 'Energy',
    industry: 'n/a',
    market_cap: '1B',
    return_monthly_1: 1,
    return_monthly_3: 2,
    return_monthly_6: 3,
    return_yearly_1: id,
  }
}

// Reports every list slot as visible and lets the debounce and the fetches settle.
async function scrollEverythingIntoView() {
  MockIntersectionObserver.revealAll()
  vi.advanceTimersByTime(300)
  await flushPromises()
}

describe('ResultList', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    installIntersectionObserverMock()
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    getBacktestMock.mockReset()
    getBacktestMock.mockImplementation(async (index) => backtestFor(index + 1))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  function mountList(query = '') {
    return mount(ResultList, { props: { query }, global: { plugins: [pinia, router] } })
  }

  it('renders nothing while the store is empty', () => {
    const wrapper = mountList()
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('renders one slot per stored result and follows store updates', async () => {
    const wrapper = mountList()

    useResultsStore().setResults(stocks)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.findAllComponents(ResultItem)).toHaveLength(0)
    expect(getBacktestMock).not.toHaveBeenCalled()
  })

  it('creates an item and fetches its backtest only once its slot becomes visible', async () => {
    useResultsStore().setResults(stocks)
    const wrapper = mountList()
    const [first] = MockIntersectionObserver.instances

    first!.trigger(wrapper.findAll('li')[0]!.element, true)
    vi.advanceTimersByTime(300)
    await flushPromises()

    expect(wrapper.findAllComponents(ResultItem)).toHaveLength(1)
    expect(getBacktestMock).toHaveBeenCalledTimes(1)
    expect(getBacktestMock).toHaveBeenCalledWith(0)
    expect(wrapper.findAll('li')[0]!.find('h4').text()).toBe('GPRE')
  })

  it('shows every item once all slots have been scrolled into view', async () => {
    useResultsStore().setResults(stocks)
    const wrapper = mountList()

    await scrollEverythingIntoView()

    expect(wrapper.findAll('li').map((li) => li.find('h4').text())).toEqual([
      'GPRE',
      'TSLX',
      'FTHI',
    ])
  })

  it('shows only the results whose name contains the query', async () => {
    useResultsStore().setResults(stocks)
    const wrapper = mountList('INC.')
    await scrollEverythingIntoView()
    expect(wrapper.findAll('li').map((li) => li.find('h4').text())).toEqual(['GPRE', 'TSLX'])

    await wrapper.setProps({ query: 'trust' })
    await scrollEverythingIntoView()
    expect(wrapper.findAll('li').map((li) => li.find('h4').text())).toEqual(['FTHI'])

    await wrapper.setProps({ query: '' })
    await scrollEverythingIntoView()
    expect(wrapper.findAll('li')).toHaveLength(3)
  })
})
