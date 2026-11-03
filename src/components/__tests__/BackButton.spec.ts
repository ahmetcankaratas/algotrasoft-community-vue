import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BackButton from '../BackButton.vue'

const Stub = { template: '<div />' }

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/scanner', component: Stub },
      { path: '/scanner/:id', component: Stub },
    ],
  })
}

describe('BackButton', () => {
  it('renders a Back button', () => {
    const wrapper = mount(BackButton, { global: { plugins: [createTestRouter()] } })
    expect(wrapper.find('button').text()).toBe('Back')
  })

  it('goes back to the previous history entry when clicked', async () => {
    const router = createTestRouter()
    await router.push('/scanner')
    await router.push('/scanner/0')
    const wrapper = mount(BackButton, { global: { plugins: [router] } })

    await wrapper.find('button').trigger('click')

    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/scanner'))
  })
})
