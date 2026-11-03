import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/services/auth'
import type { AuthResponseData } from '@/services/auth'

export interface User {
  email: string
  id: string
  token: string
  tokenExpirationDate: Date
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const token = computed(() => {
    if (!user.value || new Date() > user.value.tokenExpirationDate) {
      return null
    }
    return user.value.token
  })

  const isAuthenticated = computed(() => token.value !== null)

  function handleAuthentication(data: AuthResponseData) {
    const expiresInMs = Number(data.expiresIn) * 1000
    user.value = {
      email: data.email,
      id: data.localId,
      token: data.idToken,
      tokenExpirationDate: new Date(Date.now() + expiresInMs),
    }
  }

  async function signup(email: string, password: string): Promise<AuthResponseData> {
    const data = await authApi.signup(email, password)
    handleAuthentication(data)
    return data
  }

  async function login(email: string, password: string): Promise<AuthResponseData> {
    const data = await authApi.login(email, password)
    handleAuthentication(data)
    return data
  }

  return { user, token, isAuthenticated, signup, login }
})
