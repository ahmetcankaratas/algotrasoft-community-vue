import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import InfoRow from '../InfoRow.vue'

function mountRow(props: { title?: string; description?: string } = {}) {
  return mount(InfoRow, { props })
}

describe('InfoRow', () => {
  it('renders the title and description', () => {
    const wrapper = mountRow({ title: 'Market', description: 'NASDAQ' })
    const cells = wrapper.findAll(':scope > div')
    expect(cells[0]!.text()).toBe('Market')
    expect(cells[1]!.text()).toBe('NASDAQ')
  })

  it('shows Not Available for both when no props are given', () => {
    const cells = mountRow().findAll(':scope > div')
    expect(cells[0]!.text()).toBe('Not Available')
    expect(cells[1]!.text()).toBe('Not Available')
  })

  it.each(['n/a', 'N/A'])('replaces "%s" with Not Available', (description) => {
    const cells = mountRow({ title: 'Sector', description }).findAll(':scope > div')
    expect(cells[1]!.text()).toBe('Not Available')
  })
})
