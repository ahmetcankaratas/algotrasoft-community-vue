import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/services/auth'
import type { AuthResponseData } from '@/services/auth'
import type { User } from '@/types/user'

const USER_STORAGE_KEY = 'userData'

interface StoredUser extends Omit<User, 'tokenExpirationDate'> {
  tokenExpirationDate: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  let tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null

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
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    autoLogout(expiresInMs)
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

  function autoLogin() {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (!stored) {
      return
    }

    const loaded: StoredUser = JSON.parse(stored)
    const expirationDate = new Date(loaded.tokenExpirationDate)
    if (new Date() > expirationDate) {
      return
    }

    user.value = { ...loaded, tokenExpirationDate: expirationDate }
    autoLogout(expirationDate.getTime() - Date.now())
  }

  function autoLogout(expirationDuration: number) {
    tokenExpirationTimer = setTimeout(logout, expirationDuration)
  }

  function logout() {
    user.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
    if (tokenExpirationTimer) {
      clearTimeout(tokenExpirationTimer)
      tokenExpirationTimer = null
    }
  }

  return { user, token, isAuthenticated, signup, login, autoLogin, logout }
})
