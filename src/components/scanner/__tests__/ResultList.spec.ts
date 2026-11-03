import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ResultList from '../ResultList.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/scanner/:id', component: { template: '<div />' } }],
})

describe('ResultList', () => {
  it('renders one item per result', () => {
    const wrapper = mount(ResultList, { global: { plugins: [router] } })
    const items = wrapper.findAll('li')
    expect(items).toHaveLength(3)
    expect(items.map((li) => li.find('h4').text())).toEqual(['GPRE', 'TSLX', 'FTHI'])
  })
})
