import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import ThemeToggle from '../ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

describe('ThemeToggle', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  function mountToggle() {
    return mount(ThemeToggle, { global: { plugins: [pinia] } })
  }

  it('shows the sun icon in dark mode and the moon icon in light mode', async () => {
    const wrapper = mountToggle()
    const moon = wrapper.find('.theme-icon-dark')
    const sun = wrapper.find('.theme-icon-light')

    expect(moon.classes()).toContain('hidden')
    expect(sun.classes()).not.toContain('hidden')

    await wrapper.find('button').trigger('click')

    expect(useThemeStore().theme).toBe('light')
    expect(moon.classes()).not.toContain('hidden')
    expect(sun.classes()).toContain('hidden')
  })

  it('merges extra classes onto the button', () => {
    const wrapper = mount(ThemeToggle, { props: { class: 'p-2' }, global: { plugins: [pinia] } })
    expect(wrapper.find('button').classes()).toContain('p-2')
  })
})
