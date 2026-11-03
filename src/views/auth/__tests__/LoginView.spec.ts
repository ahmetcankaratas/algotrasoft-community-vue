import { describe, it, expect, vi, beforeEach } from 'vitest'

import { nextTick } from 'vue'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import LoginView from '../LoginView.vue'
import * as authApi from '@/services/auth'

vi.mock('@/services/auth', () => ({
  signup: vi.fn<typeof authApi.signup>(),
  login: vi.fn<typeof authApi.login>(),
}))

const loginMock = vi.mocked(authApi.login)

const response = {
  kind: 'identitytoolkit#VerifyPasswordResponse',
  idToken: 'token',
  email: 'ahmet@example.com',
  refreshToken: 'refresh',
  expiresIn: '3600',
  localId: 'uid',
  registered: true,
}

function mountLogin(): { wrapper: VueWrapper; router: Router } {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/login', component: LoginView },
      { path: '/auth/signup', component: { template: '<div />' } },
      { path: '/scanner', component: { template: '<div />' } },
    ],
  })
  const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router] } })
  return { wrapper, router }
}

async function fillValidForm(wrapper: VueWrapper) {
  await wrapper.find('#email').setValue('ahmet@example.com')
  await wrapper.find('#password').setValue('secret1')
}

describe('LoginView', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    loginMock.mockReset()
    loginMock.mockResolvedValue(response)
  })

  it('should create', () => {
    const { wrapper } = mountLogin()
    expect(wrapper.find('h1').text()).toBe('Login to your account')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('flags every field and shows a summary when an invalid form is submitted', async () => {
    const { wrapper } = mountLogin()
    expect(wrapper.text()).not.toContain('Please fill all areas')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Please fill all areas')
    expect(wrapper.find('#email').classes()).toContain('warning')
    expect(wrapper.find('#password').classes()).toContain('warning')
    expect(console.log).toHaveBeenCalledWith('Invalid form')
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('shows the email message only for an invalid, touched email', async () => {
    const { wrapper } = mountLogin()
    await wrapper.find('#email').setValue('not-an-email')
    expect(wrapper.text()).not.toContain('Please enter a valid email!')

    await wrapper.find('#email').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid email!')

    await wrapper.find('#email').setValue('ahmet@example.com')
    expect(wrapper.text()).not.toContain('Please enter a valid email!')
  })

  it('logs in, clears the summary and navigates to the scanner page', async () => {
    const { wrapper, router } = mountLogin()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Please fill all areas')

    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledWith('ahmet@example.com', 'secret1')
    expect(console.log).toHaveBeenCalledWith(response)
    expect(wrapper.text()).not.toContain('Please fill all areas')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
    expect(router.currentRoute.value.path).toBe('/scanner')
  })

  it('shows the spinner instead of the form while the request is pending', async () => {
    let resolveLogin!: (value: typeof response) => void
    loginMock.mockReturnValue(new Promise((resolve) => (resolveLogin = resolve)))
    const { wrapper } = mountLogin()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)

    resolveLogin(response)
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('shows the error message and stays on the page when the login fails', async () => {
    loginMock.mockRejectedValue(new Error('This password is not correct!'))
    const { wrapper, router } = mountLogin()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('This password is not correct!')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(router.currentRoute.value.path).not.toBe('/scanner')
  })

  it('links to the signup page', () => {
    const { wrapper } = mountLogin()
    const hrefs = wrapper.findAll('form a').map((a) => a.attributes('href'))
    expect(hrefs).toEqual(['/auth/signup', '/auth/signup'])
  })
})
