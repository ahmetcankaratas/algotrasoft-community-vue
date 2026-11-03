import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BarGraph from '../BarGraph.vue'

function mountGraph(props: { value?: number; description?: string } = {}) {
  return mount(BarGraph, { props })
}

function bar(wrapper: ReturnType<typeof mountGraph>) {
  return wrapper.find('.h-full')
}

describe('BarGraph', () => {
  it('renders the description and the rounded value', () => {
    const wrapper = mountGraph({ value: 6.3, description: '1 Month Result' })
    expect(wrapper.text()).toContain('1 Month Result')
    expect(wrapper.text()).toContain('6%')
  })

  it('falls back to n/a and 0% without props', () => {
    const wrapper = mountGraph()
    expect(wrapper.text()).toContain('n/a')
    expect(wrapper.text()).toContain('0%')
    expect(bar(wrapper).attributes('style')).toContain('width: 0%')
  })

  it('draws a cyan bar as wide as the positive value', () => {
    const element = bar(mountGraph({ value: 20.9 }))
    expect(element.attributes('style')).toContain('width: 20.9%')
    expect(element.classes()).toContain('bg-darkCyan')
  })

  it('draws a red bar as wide as the absolute negative value', () => {
    const element = bar(mountGraph({ value: -6.5 }))
    expect(element.attributes('style')).toContain('width: 6.5%')
    expect(element.classes()).toContain('bg-red-500')
  })

  it('caps the bar width at 100%', () => {
    expect(bar(mountGraph({ value: 150 })).attributes('style')).toContain('width: 100%')
    expect(bar(mountGraph({ value: -150 })).attributes('style')).toContain('width: 100%')
  })
})
