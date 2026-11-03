import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ResultDetails from '../ResultDetails.vue'
import InfoRow from '../InfoRow.vue'
import BarGraph from '../BarGraph.vue'

describe('ResultDetails', () => {
  it('renders three info rows and four bar graphs', () => {
    const wrapper = mount(ResultDetails)
    expect(wrapper.findAllComponents(InfoRow)).toHaveLength(3)
    expect(wrapper.findAllComponents(BarGraph)).toHaveLength(4)
  })

  it('shows the placeholder details', () => {
    const text = mount(ResultDetails).text()
    expect(text).toContain('Sector')
    expect(text).toContain('Basic Industries')
    expect(text).toContain('NASDAQ')
    expect(text).toContain('$868.22M')
    expect(text).toContain('1 Year Result')
  })
})
