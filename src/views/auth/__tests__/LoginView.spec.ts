import { describe, it, expect, vi } from 'vitest'

import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginView from '../LoginView.vue'

function mountLogin(): VueWrapper {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/auth/login', component: LoginView },
      { path: '/auth/signup', component: { template: '<div />' } },
    ],
  })
  return mount(LoginView, { global: { plugins: [router] } })
}

describe('LoginView', () => {
  it('should create', () => {
    const wrapper = mountLogin()
    expect(wrapper.find('h1').text()).toBe('Login to your account')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('flags every field and shows a summary when an invalid form is submitted', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const wrapper = mountLogin()
    expect(wrapper.text()).not.toContain('Please fill all areas')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Please fill all areas')
    expect(wrapper.find('#email').classes()).toContain('warning')
    expect(wrapper.find('#password').classes()).toContain('warning')
    expect(log).toHaveBeenCalledWith('Invalid form')
    log.mockRestore()
  })

  it('shows the email message only for an invalid, touched email', async () => {
    const wrapper = mountLogin()
    await wrapper.find('#email').setValue('not-an-email')
    expect(wrapper.text()).not.toContain('Please enter a valid email!')

    await wrapper.find('#email').trigger('blur')
    expect(wrapper.text()).toContain('Please enter a valid email!')

    await wrapper.find('#email').setValue('ahmet@example.com')
    expect(wrapper.text()).not.toContain('Please enter a valid email!')
  })

  it('logs the credentials, clears the summary and resets the form on a valid submit', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const wrapper = mountLogin()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Please fill all areas')

    await wrapper.find('#email').setValue('ahmet@example.com')
    await wrapper.find('#password').setValue('secret1')
    await wrapper.find('form').trigger('submit')

    expect(log).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'ahmet@example.com', password: 'secret1' }),
    )
    expect(wrapper.text()).not.toContain('Please fill all areas')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('#email').classes()).not.toContain('warning')
    log.mockRestore()
  })

  it('links to the signup page', () => {
    const wrapper = mountLogin()
    const hrefs = wrapper.findAll('form a').map((a) => a.attributes('href'))
    expect(hrefs).toEqual(['/auth/signup', '/auth/signup'])
  })
})
