import { createRouter, createWebHistory } from 'vue-router'
import { scrollBehavior } from './scrollBehavior'

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
      component: () => import('@/views/ScannerView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
    },
  ],
})

export default router
