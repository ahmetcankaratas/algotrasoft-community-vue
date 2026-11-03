import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { vObserveVisibility, type VisibilityBinding } from '../observeVisibility'
import {
  MockIntersectionObserver,
  installIntersectionObserverMock,
} from './intersectionObserver.mock'

function mountWithDirective(binding: VisibilityBinding) {
  return mount(
    {
      directives: { observeVisibility: vObserveVisibility },
      props: { binding: { type: [Function, Object], required: true } },
      template: '<div v-observe-visibility="binding">content</div>',
    },
    { props: { binding } },
  )
}

function observer() {
  return MockIntersectionObserver.instances[0]!
}

describe('vObserveVisibility', () => {
  beforeEach(() => {
    installIntersectionObserverMock()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('observes the element with the given threshold', () => {
    mountWithDirective({ onVisible: () => {}, threshold: 0.5 })
    expect(observer().elements.size).toBe(1)
    expect(observer().thresholds).toEqual([0.5])
  })

  it('calls the callback with the element when it becomes visible', () => {
    const onVisible = vi.fn<(element: HTMLElement) => void>()
    const wrapper = mountWithDirective(onVisible)

    observer().trigger(wrapper.element, true)
    vi.runAllTimers()

    expect(onVisible).toHaveBeenCalledWith(wrapper.element)
    expect(observer().disconnected).toBe(true)
  })

  it('waits for the debounce delay and fires only once', () => {
    const onVisible = vi.fn<(element: HTMLElement) => void>()
    const wrapper = mountWithDirective({ onVisible, debounce: 300 })

    observer().trigger(wrapper.element, true)
    expect(onVisible).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(onVisible).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onVisible).toHaveBeenCalledTimes(1)
    expect(observer().disconnected).toBe(true)
  })

  it('cancels the pending call when the element leaves before the delay', () => {
    const onVisible = vi.fn<(element: HTMLElement) => void>()
    const wrapper = mountWithDirective({ onVisible, debounce: 300 })

    observer().trigger(wrapper.element, true)
    vi.advanceTimersByTime(100)
    observer().trigger(wrapper.element, false)
    vi.advanceTimersByTime(300)

    expect(onVisible).not.toHaveBeenCalled()
    expect(observer().disconnected).toBe(false)
  })

  it('stops observing when the element is unmounted', () => {
    const onVisible = vi.fn<(element: HTMLElement) => void>()
    const wrapper = mountWithDirective({ onVisible, debounce: 300 })
    observer().trigger(wrapper.element, true)

    wrapper.unmount()
    vi.advanceTimersByTime(300)

    expect(onVisible).not.toHaveBeenCalled()
    expect(observer().disconnected).toBe(true)
  })
})
