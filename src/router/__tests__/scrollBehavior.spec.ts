import { describe, it, expect } from 'vitest'

import type { RouteLocationNormalized } from 'vue-router'
import { scrollBehavior } from '../scrollBehavior'

const route = (hash = '') => ({ hash }) as RouteLocationNormalized

describe('router scrollBehavior', () => {
  it('restores the saved position on back/forward navigation', () => {
    expect(scrollBehavior(route(), route(), { left: 0, top: 420 })).toEqual({ left: 0, top: 420 })
  })

  it('scrolls smoothly to the anchor when the target has a hash', () => {
    expect(scrollBehavior(route('#work'), route(), null)).toEqual({
      el: '#work',
      behavior: 'smooth',
    })
  })

  it('scrolls to the top otherwise', () => {
    expect(scrollBehavior(route(), route(), null)).toEqual({ top: 0 })
  })
})
