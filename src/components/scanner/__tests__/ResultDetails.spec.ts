import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import ResultDetails from '../ResultDetails.vue'
import InfoRow from '../InfoRow.vue'
import BarGraph from '../BarGraph.vue'
import { useResultsStore } from '@/stores/results'

const backtest = {
  id: 2,
  symbol: 'TSLX',
  name: 'TPG Specialty Lending, Inc.',
  market: 'NYSE',
  sector: 'Financial Services',
  industry: 'Asset Management',
  market_cap: '1.8B',
  return_monthly_1: -0.8,
  return_monthly_3: 1.1,
  return_monthly_6: -1.5,
  return_yearly_1: -2.4,
}

describe('ResultDetails', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  function mountDetails() {
    return mount(ResultDetails, { global: { plugins: [pinia] } })
  }

  it('renders nothing while the store has no details', () => {
    expect(mountDetails().html()).toBe('<!--v-if-->')
  })

  it('renders the stored details and follows store updates', async () => {
    const wrapper = mountDetails()

    useResultsStore().setDetails(backtest)
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAllComponents(InfoRow)
    expect(rows.map((row) => row.findAll(':scope > div').map((cell) => cell.text()))).toEqual([
      ['Sector', 'Financial Services'],
      ['Market', 'NYSE'],
      ['Market Cap', '1.8B'],
    ])
    const graphs = wrapper.findAllComponents(BarGraph)
    expect(graphs.map((graph) => graph.props('value'))).toEqual([-0.8, 1.1, -1.5, -2.4])
    expect(graphs.map((graph) => graph.props('description'))).toEqual([
      '1 Month Result',
      '3 Month Result',
      '6 Month Result',
      '1 Year Result',
    ])
  })
})
