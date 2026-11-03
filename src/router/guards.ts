import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const requireAuth: NavigationGuard = () => {
  if (useAuthStore().isAuthenticated) {
    return true
  }
  return { name: 'login' }
}
