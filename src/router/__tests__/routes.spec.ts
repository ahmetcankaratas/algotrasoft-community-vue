import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import router from '../index'
import { useAuthStore } from '@/stores/auth'

describe('router', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('scrollTo', vi.fn<typeof window.scrollTo>())
  })

  it('redirects /auth to the login page', async () => {
    await router.push('/auth')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/auth/login')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('resolves the nested signup route', () => {
    const resolved = router.resolve('/auth/signup')
    expect(resolved.name).toBe('signup')
  })

  it('sends anonymous visitors from /scanner to the login page', async () => {
    await router.push('/scanner')

    expect(router.currentRoute.value.path).toBe('/auth/login')
  })

  it('lets authenticated users open /scanner', async () => {
    useAuthStore().user = {
      email: 'ahmet@example.com',
      id: 'uid',
      token: 'token',
      tokenExpirationDate: new Date(Date.now() + 60_000),
    }

    await router.push('/scanner')

    expect(router.currentRoute.value.path).toBe('/scanner')
  })
})
