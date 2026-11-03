import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import AppHeader from '../AppHeader.vue'

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

describe('AppHeader', () => {
  let router: Router

  beforeEach(() => {
    router = createTestRouter()
  })

  it('should create', async () => {
    await router.push('/')
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('marks only the current route link as active', async () => {
    await router.push('/scanner')
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')

    expect(links.map((l) => l.text())).toEqual(['Home', 'Scanner', 'Contact', 'Login', 'Sign Up'])
    expect(links[0]!.classes()).not.toContain('active')
    expect(links[1]!.classes()).toContain('active')
    expect(links[2]!.classes()).not.toContain('active')
    expect(links[3]!.classes()).not.toContain('active')
    expect(links[4]!.classes()).not.toContain('active')
  })
})
