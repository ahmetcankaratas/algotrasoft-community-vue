import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'theme'

function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark')

  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(next: Theme) {
    const root = document.documentElement
    root.classList.remove(theme.value)
    theme.value = next
    root.classList.add(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    applyTheme(isTheme(stored) ? stored : theme.value)
  }

  function toggleTheme() {
    applyTheme(isDark.value ? 'light' : 'dark')
  }

  return { theme, isDark, initTheme, toggleTheme }
})
