import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HamburgerButton from '../HamburgerButton.vue'

describe('HamburgerButton', () => {
  it('renders three bars and is closed by default', () => {
    const wrapper = mount(HamburgerButton)
    expect(wrapper.findAll('span')).toHaveLength(3)
    expect(wrapper.classes()).not.toContain('open')
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('reflects the bound open state', () => {
    const wrapper = mount(HamburgerButton, { props: { modelValue: true } })
    expect(wrapper.classes()).toContain('open')
    expect(wrapper.attributes('aria-expanded')).toBe('true')
  })

  it('toggles the model on click', async () => {
    const wrapper = mount(HamburgerButton, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.classes()).toContain('open')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true], [false]])
    expect(wrapper.classes()).not.toContain('open')
  })
})
