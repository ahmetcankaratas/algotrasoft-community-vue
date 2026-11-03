import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import DetailsView from '../DetailsView.vue'
import ResultDetails from '@/components/scanner/ResultDetails.vue'
import BackButton from '@/components/BackButton.vue'

function mountDetails() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/scanner', component: { template: '<div />' } },
      { path: '/scanner/:id', component: DetailsView },
    ],
  })
  return mount(DetailsView, { global: { plugins: [createPinia(), router] } })
}

describe('DetailsView', () => {
  it('should create', () => {
    const wrapper = mountDetails()
    expect(wrapper.find('h1').text()).toBe('Scanner')
  })

  it('renders the details and the back button without a spinner', () => {
    const wrapper = mountDetails()
    expect(wrapper.findComponent(ResultDetails).exists()).toBe(true)
    expect(wrapper.findComponent(BackButton).exists()).toBe(true)
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
  })
})
