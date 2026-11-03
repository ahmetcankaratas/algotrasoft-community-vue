import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import router from '../index'
import { useAuthStore } from '@/stores/auth'

function authenticate() {
  useAuthStore().user = {
    email: 'ahmet@example.com',
    id: 'uid',
    token: 'token',
    tokenExpirationDate: new Date(Date.now() + 60_000),
  }
}

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
    authenticate()

    await router.push('/scanner')

    expect(router.currentRoute.value.path).toBe('/scanner')
    expect(router.currentRoute.value.name).toBe('scanner')
  })

  it('sends anonymous visitors from /scanner/:id to the login page', async () => {
    await router.push('/')
    await router.push('/scanner/0')

    expect(router.currentRoute.value.path).toBe('/auth/login')
  })

  it('resolves the details route with its id param for authenticated users', async () => {
    authenticate()
    await router.push('/')
    await router.push('/scanner/0')

    expect(router.currentRoute.value.name).toBe('details')
    expect(router.currentRoute.value.params).toEqual({ id: '0' })
  })
})
