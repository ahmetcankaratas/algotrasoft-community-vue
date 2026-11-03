import { describe, it, expect, beforeEach } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '../theme'

const rootClasses = () => Array.from(document.documentElement.classList)

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to dark and persists it when nothing is stored', () => {
    const store = useThemeStore()

    store.initTheme()

    expect(store.theme).toBe('dark')
    expect(store.isDark).toBe(true)
    expect(rootClasses()).toEqual(['dark'])
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('restores the stored theme', () => {
    localStorage.setItem('theme', 'light')
    const store = useThemeStore()

    store.initTheme()

    expect(store.theme).toBe('light')
    expect(rootClasses()).toEqual(['light'])
  })

  it('ignores an invalid stored value', () => {
    localStorage.setItem('theme', 'blue')
    const store = useThemeStore()

    store.initTheme()

    expect(store.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggles between dark and light and keeps the root class in sync', () => {
    const store = useThemeStore()
    store.initTheme()

    store.toggleTheme()
    expect(store.theme).toBe('light')
    expect(rootClasses()).toEqual(['light'])
    expect(localStorage.getItem('theme')).toBe('light')

    store.toggleTheme()
    expect(store.theme).toBe('dark')
    expect(rootClasses()).toEqual(['dark'])
  })
})
