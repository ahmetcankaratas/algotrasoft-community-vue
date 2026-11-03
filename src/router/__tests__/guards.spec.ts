import { describe, it, expect, beforeEach } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { requireAuth } from '../guards'
import { useAuthStore } from '@/stores/auth'

const to = {} as RouteLocationNormalized
const from = {} as RouteLocationNormalized
const next = () => {}

describe('requireAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('redirects to the login route when there is no session', () => {
    expect(requireAuth(to, from, next)).toEqual({ name: 'login' })
  })

  it('allows the navigation when the user is authenticated', () => {
    useAuthStore().user = {
      email: 'ahmet@example.com',
      id: 'uid',
      token: 'token',
      tokenExpirationDate: new Date(Date.now() + 60_000),
    }

    expect(requireAuth(to, from, next)).toBe(true)
  })
})
