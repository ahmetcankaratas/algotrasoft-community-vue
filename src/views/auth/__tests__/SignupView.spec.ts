import { describe, it, expect, vi, beforeEach } from 'vitest'

import { nextTick } from 'vue'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import SignupView from '../SignupView.vue'
import * as authApi from '@/services/auth'

vi.mock('@/services/auth', () => ({
  signup: vi.fn<typeof authApi.signup>(),
  login: vi.fn<typeof authApi.login>(),
}))

const signupMock = vi.mocked(authApi.signup)

const response = {
  kind: 'identitytoolkit#SignupNewUserResponse',
  idToken: 'token',
  email: 'ahmet@example.com',
  refreshToken: 'refresh',
  expiresIn: '3600',
  localId: 'uid',
}

function mountSignup(): { wrapper: VueWrapper; router: Router } {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/signup', component: SignupView },
      { path: '/auth/login', component: { template: '<div />' } },
      { path: '/scanner', component: { template: '<div />' } },
    ],
  })
  const wrapper = mount(SignupView, { global: { plugins: [createPinia(), router] } })
  return { wrapper, router }
}

async function fillValidForm(wrapper: VueWrapper) {
  await wrapper.find('#firstName').setValue('Ahmet')
  await wrapper.find('#lastName').setValue('Karatas')
  await wrapper.find('#email').setValue('ahmet@example.com')
  await wrapper.find('#password').setValue('secret1')
}

describe('SignupView', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    signupMock.mockReset()
    signupMock.mockResolvedValue(response)
  })

  it('should create', () => {
    const { wrapper } = mountSignup()
    expect(wrapper.find('h1').text()).toBe('Create account')
  })

  it('disables submit until the form is valid', async () => {
    const { wrapper } = mountSignup()
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
    await fillValidForm(wrapper)
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows a validation message only after the field is touched', async () => {
    const { wrapper } = mountSignup()
    expect(wrapper.text()).not.toContain('Please enter a valid first name!')

    await wrapper.find('#firstName').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid first name!')

    await wrapper.find('#firstName').setValue('Ahmet')
    expect(wrapper.text()).not.toContain('Please enter a valid first name!')
  })

  it('rejects an email without a domain', async () => {
    const { wrapper } = mountSignup()
    await wrapper.find('#email').setValue('ahmet@')
    await wrapper.find('#email').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid email!')
  })

  it('rejects a password without a digit', async () => {
    const { wrapper } = mountSignup()
    await wrapper.find('#password').setValue('secretonly')
    await wrapper.find('#password').trigger('blur')
    expect(wrapper.text()).toContain('Must contain at least one number')
  })

  it('signs up, resets the form and navigates to the scanner page', async () => {
    const { wrapper, router } = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(signupMock).toHaveBeenCalledWith('ahmet@example.com', 'secret1')
    expect(console.log).toHaveBeenCalledWith(response)
    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(router.currentRoute.value.path).toBe('/scanner')
  })

  it('shows the spinner instead of the form while the request is pending', async () => {
    let resolveSignup!: (value: typeof response) => void
    signupMock.mockReturnValue(new Promise((resolve) => (resolveSignup = resolve)))
    const { wrapper } = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)

    resolveSignup(response)
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('shows the error message and stays on the page when the signup fails', async () => {
    signupMock.mockRejectedValue(new Error('This email exists already!'))
    const { wrapper, router } = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('This email exists already!')
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(console.log).toHaveBeenCalledWith('This email exists already!')
    expect(router.currentRoute.value.path).not.toBe('/scanner')
  })

  it('clears a previous error when submitting again', async () => {
    signupMock.mockRejectedValueOnce(new Error('This email exists already!'))
    const { wrapper } = mountSignup()
    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('This email exists already!')

    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).not.toContain('This email exists already!')
  })
})
