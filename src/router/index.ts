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
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          name: 'scanner',
          component: () => import('@/views/ScannerView.vue'),
        },
        {
          path: ':id',
          name: 'details',
          component: () => import('@/views/DetailsView.vue'),
        },
      ],
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
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
