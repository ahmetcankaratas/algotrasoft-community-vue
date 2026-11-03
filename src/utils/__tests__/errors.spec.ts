import { describe, it, expect } from 'vitest'

import { toErrorMessage, UNKNOWN_ERROR_MESSAGE } from '../errors'

describe('toErrorMessage', () => {
  it('uses the message of an Error', () => {
    expect(toErrorMessage(new Error('EMAIL_EXISTS'))).toBe('EMAIL_EXISTS')
  })

  it.each(['text', 42, null, undefined, { message: 'object' }])(
    'falls back to the generic message for %o',
    (failure) => {
      expect(toErrorMessage(failure)).toBe(UNKNOWN_ERROR_MESSAGE)
    },
  )
})
