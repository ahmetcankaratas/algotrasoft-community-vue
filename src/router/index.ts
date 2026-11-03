import { createRouter, createWebHistory } from 'vue-router'
import { scrollBehavior } from './scrollBehavior'
import { requireAuth } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/scanner',
      name: 'scanner',
      beforeEnter: requireAuth,
      component: () => import('@/views/ScannerView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/auth',
      redirect: { name: 'login' },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/SignupView.vue'),
        },
      ],
    },
  ],
})

export default router
