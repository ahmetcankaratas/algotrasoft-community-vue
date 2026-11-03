import type { InternalAxiosRequestConfig } from 'axios'
import { http } from './http'
import { useAuthStore } from '@/stores/auth'

// Adds the session token as the `auth` query parameter while a user is logged in.
export function attachToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const { token } = useAuthStore()
  if (token) {
    config.params = { ...config.params, auth: token }
  }
  return config
}

export function installTokenInterceptor(): number {
  return http.interceptors.request.use(attachToken)
}
