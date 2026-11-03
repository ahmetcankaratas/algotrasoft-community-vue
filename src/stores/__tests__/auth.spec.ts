import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import * as authApi from '@/services/auth'

vi.mock('@/services/auth', () => ({
  signup: vi.fn<typeof authApi.signup>(),
  login: vi.fn<typeof authApi.login>(),
}))

const response = {
  kind: 'identitytoolkit#VerifyPasswordResponse',
  idToken: 'token',
  email: 'ahmet@example.com',
  refreshToken: 'refresh',
  expiresIn: '3600',
  localId: 'uid',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.mocked(authApi.signup).mockReset()
    vi.mocked(authApi.login).mockReset()
  })

  it('starts without a user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('stores the user after a successful login', async () => {
    vi.mocked(authApi.login).mockResolvedValue(response)
    const store = useAuthStore()

    const data = await store.login('ahmet@example.com', 'secret1')

    expect(data).toBe(response)
    expect(authApi.login).toHaveBeenCalledWith('ahmet@example.com', 'secret1')
    expect(store.user).toEqual({
      email: 'ahmet@example.com',
      id: 'uid',
      token: 'token',
      tokenExpirationDate: new Date('2026-01-01T11:00:00Z'),
    })
    expect(store.token).toBe('token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('stores the user after a successful signup', async () => {
    vi.mocked(authApi.signup).mockResolvedValue(response)
    const store = useAuthStore()

    await store.signup('ahmet@example.com', 'secret1')

    expect(store.user?.email).toBe('ahmet@example.com')
    expect(store.isAuthenticated).toBe(true)
  })

  it('returns no token when the expiration date is in the past', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ ...response, expiresIn: '-1' })
    const store = useAuthStore()
    await store.login('ahmet@example.com', 'secret1')

    expect(store.user?.token).toBe('token')
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('keeps the user empty when the request fails', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('This password is not correct!'))
    const store = useAuthStore()

    await expect(store.login('ahmet@example.com', 'wrong1')).rejects.toThrow(
      'This password is not correct!',
    )
    expect(store.user).toBeNull()
  })
})
