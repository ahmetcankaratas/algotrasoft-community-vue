import type { ObjectDirective } from 'vue'

export type VisibilityCallback = (element: HTMLElement) => void

export interface VisibilityOptions {
  onVisible: VisibilityCallback
  /** Milliseconds the element has to stay visible before `onVisible` fires. */
  debounce?: number
  /** Fraction of the element that has to be visible (IntersectionObserver threshold). */
  threshold?: number
}

export type VisibilityBinding = VisibilityCallback | VisibilityOptions

interface Watcher {
  observer: IntersectionObserver
  timer: ReturnType<typeof setTimeout> | null
}

const watchers = new WeakMap<HTMLElement, Watcher>()

function normalize(value: VisibilityBinding): Required<VisibilityOptions> {
  const options = typeof value === 'function' ? { onVisible: value } : value
  return { debounce: 0, threshold: 1, ...options }
}

function stop(element: HTMLElement) {
  const watcher = watchers.get(element)
  if (!watcher) return
  if (watcher.timer) clearTimeout(watcher.timer)
  watcher.observer.disconnect()
  watchers.delete(element)
}

// Calls `onVisible` once the element has stayed visible for `debounce` ms, then stops observing.
// Leaving the viewport before the delay has passed cancels the pending call.
export const vObserveVisibility: ObjectDirective<HTMLElement, VisibilityBinding> = {
  mounted(element, binding) {
    const { onVisible, debounce, threshold } = normalize(binding.value)
    const watcher: Watcher = {
      timer: null,
      observer: new IntersectionObserver(
        ([entry]) => {
          if (watcher.timer) {
            clearTimeout(watcher.timer)
            watcher.timer = null
          }
          if (!entry?.isIntersecting) return
          watcher.timer = setTimeout(() => {
            stop(element)
            onVisible(element)
          }, debounce)
        },
        { threshold },
      ),
    }
    watchers.set(element, watcher)
    watcher.observer.observe(element)
  },
  unmounted(element) {
    stop(element)
  },
}
