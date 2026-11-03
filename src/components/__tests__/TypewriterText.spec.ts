import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import Typewriter from 'typewriter-effect/dist/core'
import TypewriterText from '../TypewriterText.vue'

type Chainable = (...args: unknown[]) => unknown

const { instance } = vi.hoisted(() => {
  const instance = {
    typeString: vi.fn<Chainable>(),
    pauseFor: vi.fn<Chainable>(),
    deleteAll: vi.fn<Chainable>(),
    start: vi.fn<Chainable>(),
    stop: vi.fn<Chainable>(),
  }
  for (const fn of Object.values(instance)) {
    fn.mockReturnValue(instance)
  }
  return { instance }
})

vi.mock('typewriter-effect/dist/core', () => ({
  default: vi.fn<Chainable>(function () {
    return instance
  }),
}))

describe('TypewriterText', () => {
  beforeEach(() => {
    vi.mocked(Typewriter).mockClear()
    for (const fn of Object.values(instance)) {
      fn.mockClear()
    }
  })

  it('types every string in a loop on mount', () => {
    const wrapper = mount(TypewriterText, { props: { strings: ['Stocks', 'Crypto'] } })

    expect(Typewriter).toHaveBeenCalledWith(wrapper.element, { loop: true, delay: 75 })
    expect(instance.typeString.mock.calls).toEqual([['Stocks'], ['Crypto']])
    expect(instance.pauseFor).toHaveBeenCalledWith(1000)
    expect(instance.deleteAll).toHaveBeenCalledTimes(2)
    expect(instance.start).toHaveBeenCalledTimes(1)
  })

  it('passes custom delay and pause', () => {
    mount(TypewriterText, { props: { strings: ['A'], delay: 10, pause: 50 } })

    expect(Typewriter).toHaveBeenCalledWith(expect.anything(), { loop: true, delay: 10 })
    expect(instance.pauseFor).toHaveBeenCalledWith(50)
  })

  it('stops the animation on unmount', () => {
    const wrapper = mount(TypewriterText, { props: { strings: ['A'] } })

    wrapper.unmount()

    expect(instance.stop).toHaveBeenCalledTimes(1)
  })
})
