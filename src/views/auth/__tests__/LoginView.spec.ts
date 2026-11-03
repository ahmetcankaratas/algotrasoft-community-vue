import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

describe('LoginView', () => {
  it('should create', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.text()).toContain('login works!')
  })
})
