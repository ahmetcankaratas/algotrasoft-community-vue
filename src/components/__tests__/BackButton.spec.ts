import { describe, it, expect } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BackButton from '../BackButton.vue'

const Stub = { template: '<div />' }

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Stub },
      {
        path: '/scanner',
        children: [
          { path: '', component: Stub },
          { path: ':id', component: Stub },
        ],
      },
      { path: '/:pathMatch(.*)*', component: Stub },
    ],
  })
}

async function mountAt(path: string) {
  const router = createTestRouter()
  await router.push(path)
  const wrapper = mount(BackButton, { global: { plugins: [router] } })
  return { wrapper, router }
}

describe('BackButton', () => {
  it('renders a Back button', async () => {
    const { wrapper } = await mountAt('/scanner/0')
    expect(wrapper.find('button').text()).toBe('Back')
  })

  it('navigates to the parent route when clicked', async () => {
    const { wrapper, router } = await mountAt('/scanner/0')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/scanner')
  })

  it('navigates home from a route without a parent', async () => {
    const { wrapper, router } = await mountAt('/no/such/page')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/')
  })
})
