import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { attachToken, installTokenInterceptor } from '../tokenInterceptor'
import { http } from '../http'
import { useAuthStore } from '@/stores/auth'

function authenticate(expiresInMs = 60_000) {
  useAuthStore().user = {
    email: 'ahmet@example.com',
    id: 'uid',
    token: 'id-token',
    tokenExpirationDate: new Date(Date.now() + expiresInMs),
  }
}

function config(params?: Record<string, unknown>): InternalAxiosRequestConfig {
  return { headers: {}, params } as unknown as InternalAxiosRequestConfig
}

describe('attachToken', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('leaves the request untouched while logged out', () => {
    expect(attachToken(config({ key: 'k' })).params).toEqual({ key: 'k' })
    expect(attachToken(config()).params).toBeUndefined()
  })

  it('adds the auth parameter next to the existing ones while logged in', () => {
    authenticate()
    expect(attachToken(config({ key: 'k' })).params).toEqual({ key: 'k', auth: 'id-token' })
    expect(attachToken(config()).params).toEqual({ auth: 'id-token' })
  })

  it('sends nothing for an expired session', () => {
    authenticate(-1)
    expect(attachToken(config()).params).toBeUndefined()
  })
})

describe('installTokenInterceptor', () => {
  let interceptorId: number
  const originalAdapter = http.defaults.adapter

  beforeEach(() => {
    setActivePinia(createPinia())
    interceptorId = installTokenInterceptor()
  })

  afterEach(() => {
    http.interceptors.request.eject(interceptorId)
    http.defaults.adapter = originalAdapter
  })

  it('applies the token to requests sent through the shared instance', async () => {
    authenticate()
    const adapter = vi.fn<AxiosAdapter>(async (requestConfig) => ({
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: requestConfig,
    }))
    http.defaults.adapter = adapter

    await http.get('https://example.test/market.json', { params: { shallow: true } })

    expect(adapter.mock.calls[0]![0].params).toEqual({ shallow: true, auth: 'id-token' })
  })
})
