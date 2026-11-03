import { describe, it, expect } from 'vitest'

import { isEmail, isPassword } from '../validation'

describe('isEmail', () => {
  it.each(['ahmet@example.com', 'first.last+tag@sub.domain.org'])('accepts %s', (value) => {
    expect(isEmail(value)).toBe(true)
  })

  it.each(['', 'ahmet', 'ahmet@', '@example.com', 'ahmet@example'])('rejects %s', (value) => {
    expect(isEmail(value)).toBe(false)
  })
})

describe('isPassword', () => {
  it('requires a digit, a lowercase letter and at least six characters', () => {
    expect(isPassword('secret1')).toBe(true)
    expect(isPassword('secret')).toBe(false)
    expect(isPassword('123456')).toBe(false)
    expect(isPassword('abc1')).toBe(false)
  })
})
