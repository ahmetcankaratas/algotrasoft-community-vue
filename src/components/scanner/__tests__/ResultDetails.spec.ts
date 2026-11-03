import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ResultDetails from '../ResultDetails.vue'
import InfoRow from '../InfoRow.vue'
import BarGraph from '../BarGraph.vue'

const details = {
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
  it('renders the given details as info rows and bar graphs', () => {
    const wrapper = mount(ResultDetails, { props: { details } })

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
