import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'
import router from '../router'
import { useAuthStore } from '@/stores/auth'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('scrollTo', vi.fn<typeof window.scrollTo>())
  })

  function mountApp() {
    return mount(App, {
      global: { plugins: [router], stubs: { VueParticles: true } },
    })
  }

  it('renders the home route', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mountApp()
    await flushPromises()

    expect(wrapper.find('#hero').exists()).toBe(true)
  })

  it('redirects to the login page when the session ends', async () => {
    useAuthStore().user = {
      email: 'ahmet@example.com',
      id: 'uid',
      token: 'token',
      tokenExpirationDate: new Date(Date.now() + 60_000),
    }
    await router.push('/scanner')
    await router.isReady()
    mountApp()
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/scanner')

    useAuthStore().logout()

    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/auth/login'))
  })
})
