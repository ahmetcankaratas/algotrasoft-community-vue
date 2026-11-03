import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ErrorAlert from '../ErrorAlert.vue'

describe('ErrorAlert', () => {
  it('renders the message as an alert', () => {
    const wrapper = mount(ErrorAlert, { props: { message: 'This email exists already!' } })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.text()).toBe('This email exists already!')
    expect(wrapper.classes()).toContain('bg-red-300')
  })
})
