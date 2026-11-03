import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SignupView from '../SignupView.vue'
import { signup } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  signup: vi.fn<typeof signup>(),
}))

const signupMock = vi.mocked(signup)

function mountSignup(): VueWrapper {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/signup', component: SignupView },
      { path: '/auth/login', component: { template: '<div />' } },
    ],
  })
  return mount(SignupView, { global: { plugins: [router] } })
}

async function fillValidForm(wrapper: VueWrapper) {
  await wrapper.find('#firstName').setValue('Ahmet')
  await wrapper.find('#lastName').setValue('Karatas')
  await wrapper.find('#email').setValue('ahmet@example.com')
  await wrapper.find('#password').setValue('secret1')
}

describe('SignupView', () => {
  beforeEach(() => {
    signupMock.mockReset()
    signupMock.mockResolvedValue({
      kind: 'identitytoolkit#SignupNewUserResponse',
      idToken: 'token',
      email: 'ahmet@example.com',
      refreshToken: 'refresh',
      expiresIn: '3600',
      localId: 'uid',
    })
  })

  it('should create', () => {
    const wrapper = mountSignup()
    expect(wrapper.find('h1').text()).toBe('Create account')
  })

  it('disables submit until the form is valid', async () => {
    const wrapper = mountSignup()
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()
    await fillValidForm(wrapper)
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows a validation message only after the field is touched', async () => {
    const wrapper = mountSignup()
    expect(wrapper.text()).not.toContain('Please enter a valid first name!')

    await wrapper.find('#firstName').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid first name!')

    await wrapper.find('#firstName').setValue('Ahmet')
    expect(wrapper.text()).not.toContain('Please enter a valid first name!')
  })

  it('rejects a password without a digit', async () => {
    const wrapper = mountSignup()
    await wrapper.find('#password').setValue('secretonly')
    await wrapper.find('#password').trigger('blur')
    expect(wrapper.text()).toContain('Must contain at least one number')
  })

  it('sends the signup request and resets the form on submit', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const wrapper = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(signupMock).toHaveBeenCalledWith('ahmet@example.com', 'secret1')
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ idToken: 'token' }))
    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    log.mockRestore()
  })

  it('logs the error when the signup request fails', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const failure = new Error('EMAIL_EXISTS')
    signupMock.mockRejectedValue(failure)
    const wrapper = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(log).toHaveBeenCalledWith(failure)
    log.mockRestore()
  })
})
