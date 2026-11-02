import { describe, it, expect, vi } from 'vitest'

import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SignupView from '../SignupView.vue'

function mountSignup(): VueWrapper {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/signup', component: SignupView },
      { path: '/login', component: { template: '<div />' } },
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

  it('logs the data and resets the form on submit', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const wrapper = mountSignup()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')

    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Ahmet', email: 'ahmet@example.com' }),
    )
    expect((wrapper.find('#firstName').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    log.mockRestore()
  })
})
