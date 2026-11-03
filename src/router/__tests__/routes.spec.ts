import { describe, it, expect, vi, beforeAll } from 'vitest'

import router from '../index'

describe('router', () => {
  beforeAll(() => {
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
})
