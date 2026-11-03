import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import DetailsView from '../DetailsView.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'
import BackButton from '@/components/BackButton.vue'
import { getBacktest } from '@/services/dataStorage'

vi.mock('@/services/dataStorage', () => ({
  getBacktest: vi.fn<typeof getBacktest>(),
}))

const getBacktestMock = vi.mocked(getBacktest)

const backtest = {
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

describe('DetailsView', () => {
  let pinia: Pinia
  let router: Router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/scanner', component: { template: '<div />' } },
        { path: '/scanner/:id', component: DetailsView },
      ],
    })
    getBacktestMock.mockReset()
    getBacktestMock.mockResolvedValue(backtest)
  })

  async function mountDetails(id = 0) {
    await router.push(`/scanner/${id}`)
    return mount(DetailsView, { global: { plugins: [pinia, router] } })
  }

  it('should create', async () => {
    const wrapper = await mountDetails()
    expect(wrapper.find('p.text-darkCyan').text()).toBe('Result Details')
    expect(wrapper.findComponent(BackButton).exists()).toBe(true)
  })

  it('shows the spinner and hides the details while loading', async () => {
    getBacktestMock.mockReturnValue(new Promise(() => {}))
    const wrapper = await mountDetails()

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('')
    expect(wrapper.findComponent(ResultDetails).exists()).toBe(false)
  })

  it('clears the previous details while the next ones load', async () => {
    const wrapper = await mountDetails(0)
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('Green Plains, Inc.')

    getBacktestMock.mockReturnValue(new Promise(() => {}))
    await router.push('/scanner/1')
    await flushPromises()

    expect(wrapper.find('h1').text()).toBe('')
    expect(wrapper.findComponent(ResultDetails).exists()).toBe(false)
    expect(wrapper.find('.lds-ring').exists()).toBe(true)
  })

  it('fetches the backtest for the route id and shows the details', async () => {
    const wrapper = await mountDetails(0)
    await flushPromises()

    expect(getBacktestMock).toHaveBeenCalledWith(0)
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('h1').text()).toBe('Green Plains, Inc.')
    expect(wrapper.findComponent(ResultDetails).props('details')).toEqual(backtest)
  })

  it('re-fetches when the id changes while the view stays mounted', async () => {
    await mountDetails(0)
    await flushPromises()

    await router.push('/scanner/1')
    await flushPromises()

    expect(getBacktestMock).toHaveBeenNthCalledWith(2, 1)
  })

  it('shows the error cover when the request fails', async () => {
    getBacktestMock.mockRejectedValue(new Error('Request failed with status code 401'))
    const wrapper = await mountDetails()
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.findComponent(ResultDetails).exists()).toBe(false)
    expect(wrapper.find('h1').text()).toBe('Something went wrong')
    expect(wrapper.find('p.text-darkCyan').text()).toBe('Request failed with status code 401')
    expect(wrapper.findComponent(BackButton).exists()).toBe(true)
  })

  it('shows the Not Found cover when the database has no entry for the id', async () => {
    getBacktestMock.mockResolvedValue(null)
    const wrapper = await mountDetails(99)
    await flushPromises()

    expect(wrapper.find('h1').text()).toBe('Not Found')
    expect(wrapper.find('p.text-darkCyan').text()).toBe('')
    expect(wrapper.findComponent(ResultDetails).exists()).toBe(false)
    expect(wrapper.findComponent(BackButton).exists()).toBe(true)
  })
})
