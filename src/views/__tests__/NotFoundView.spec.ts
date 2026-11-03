import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import NotFoundView from '../NotFoundView.vue'
import BackButton from '@/components/BackButton.vue'

function mountNotFound() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: NotFoundView }],
  })
  return mount(NotFoundView, { global: { plugins: [createPinia(), router] } })
}

describe('NotFoundView', () => {
  it('shows the Not Found cover and a back button', () => {
    const wrapper = mountNotFound()
    expect(wrapper.find('h1').text()).toBe('Not Found')
    expect(wrapper.findComponent(BackButton).exists()).toBe(true)
  })
})
