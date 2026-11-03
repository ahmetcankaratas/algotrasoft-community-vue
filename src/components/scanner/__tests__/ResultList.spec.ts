import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultList from '../ResultList.vue'
import { useResultsStore } from '@/stores/results'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner/:id', component: { template: '<div />' } }],
})

describe('ResultList', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders nothing while the store is empty', () => {
    const wrapper = mount(ResultList, { global: { plugins: [pinia, router] } })
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('renders one item per stored result and follows store updates', async () => {
    const wrapper = mount(ResultList, { global: { plugins: [pinia, router] } })

    useResultsStore().setResults([
      { id: 1, name: 'Green Plains, Inc.', symbol: 'GPRE', return_yearly_1: 6.3 },
      { id: 2, name: 'TPG Specialty Lending, Inc.', symbol: 'TSLX', return_yearly_1: -2.4 },
    ])
    await wrapper.vm.$nextTick()

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
    expect(items.map((li) => li.find('h4').text())).toEqual(['GPRE', 'TSLX'])
  })
})
