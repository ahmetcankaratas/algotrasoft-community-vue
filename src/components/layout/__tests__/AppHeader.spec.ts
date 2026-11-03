import { describe, it, expect, beforeEach } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import AppHeader from '../AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const Stub = { template: '<div />' }

function createTestRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    linkActiveClass: 'active',
    routes: [
      { path: '/', component: Stub },
      { path: '/scanner', component: Stub },
      { path: '/contact', component: Stub },
      { path: '/auth/login', component: Stub },
      { path: '/auth/signup', component: Stub },
    ],
  })
}

function authenticate() {
  useAuthStore().user = {
    email: 'ahmet@example.com',
    id: 'uid',
    token: 'token',
    tokenExpirationDate: new Date(Date.now() + 60_000),
  }
}

describe('AppHeader', () => {
  let router: Router
  let pinia: Pinia

  beforeEach(() => {
    router = createTestRouter()
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  function mountHeader() {
    return mount(AppHeader, { global: { plugins: [pinia, router] } })
  }

  it('should create', async () => {
    await router.push('/')
    const wrapper = mountHeader()
    expect(wrapper.exists()).toBe(true)
  })

  it('shows Login and Sign Up when logged out', async () => {
    await router.push('/')
    const wrapper = mountHeader()

    expect(wrapper.findAll('a').map((l) => l.text())).toEqual([
      'Home',
      'Contact',
      'Login',
      'Sign Up',
    ])
    expect(wrapper.find('button[type="button"]').exists()).toBe(false)
  })

  it('shows Logout and Scanner when logged in', async () => {
    authenticate()
    await router.push('/')
    const wrapper = mountHeader()

    expect(wrapper.findAll('a').map((l) => l.text())).toEqual(['Home', 'Contact', 'Scanner'])
    expect(wrapper.find('button[type="button"]').text()).toBe('Logout')
  })

  it('marks only the current route link as active', async () => {
    await router.push('/contact')
    const wrapper = mountHeader()
    const links = wrapper.findAll('a')

    expect(links[0]!.classes()).not.toContain('active')
    expect(links[1]!.classes()).toContain('active')
    expect(links[2]!.classes()).not.toContain('active')
  })

  it('never marks the pill button as active', async () => {
    await router.push('/auth/signup')
    const wrapper = mountHeader()
    const signUp = wrapper.findAll('a')[3]!

    expect(signUp.text()).toBe('Sign Up')
    expect(signUp.classes()).not.toContain('active')
    expect(signUp.classes()).not.toContain('router-link-exact-active')
  })

  it('logs out and navigates to the login page', async () => {
    authenticate()
    await router.push('/scanner')
    const wrapper = mountHeader()

    await wrapper.find('button[type="button"]').trigger('click')
    await flushPromises()

    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(router.currentRoute.value.path).toBe('/auth/login')
    expect(wrapper.findAll('a').map((l) => l.text())).toEqual([
      'Home',
      'Contact',
      'Login',
      'Sign Up',
    ])
  })
})
