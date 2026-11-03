import { describe, it, expect, vi, beforeEach } from 'vitest'

import { nextTick } from 'vue'
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

  it('rejects an email without a domain', async () => {
    const wrapper = mountSignup()
    await wrapper.find('#email').setValue('ahmet@')
    await wrapper.find('#email').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid email!')
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

  it('shows the spinner instead of the form while the request is pending', async () => {
    let resolveSignup!: (value: Awaited<ReturnType<typeof signup>>) => void
    signupMock.mockReturnValue(new Promise((resolve) => (resolveSignup = resolve)))
    const wrapper = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await nextTick()

    expect(wrapper.find('.lds-ring').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)

    resolveSignup({
      kind: 'identitytoolkit#SignupNewUserResponse',
      idToken: 'token',
      email: 'ahmet@example.com',
      refreshToken: 'refresh',
      expiresIn: '3600',
      localId: 'uid',
    })
    await flushPromises()

    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('shows the error message when the signup request fails', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    signupMock.mockRejectedValue(new Error('This email exists already!'))
    const wrapper = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('This email exists already!')
    expect(wrapper.find('.lds-ring').exists()).toBe(false)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(log).toHaveBeenCalledWith('This email exists already!')
    log.mockRestore()
  })

  it('clears a previous error when submitting again', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    signupMock.mockRejectedValueOnce(new Error('This email exists already!'))
    const wrapper = mountSignup()
    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('This email exists already!')

    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).not.toContain('This email exists already!')
    vi.restoreAllMocks()
  })
})
