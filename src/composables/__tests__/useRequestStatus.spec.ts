import { describe, it, expect } from 'vitest'

import { useRequestStatus } from '../useRequestStatus'

describe('useRequestStatus', () => {
  it('starts idle without an error', () => {
    const { isLoading, error } = useRequestStatus()
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('is loading while the request is pending and resolves with its value', async () => {
    const { isLoading, run } = useRequestStatus()
    let resolveRequest!: (value: string) => void
    const pending = run(() => new Promise<string>((resolve) => (resolveRequest = resolve)))

    expect(isLoading.value).toBe(true)

    resolveRequest('done')
    expect(await pending).toBe('done')
    expect(isLoading.value).toBe(false)
  })

  it('records the error message and resolves with undefined when the request fails', async () => {
    const { isLoading, error, run } = useRequestStatus()

    const value = await run(() => Promise.reject(new Error('This password is not correct!')))

    expect(value).toBeUndefined()
    expect(error.value).toBe('This password is not correct!')
    expect(isLoading.value).toBe(false)
  })

  it('falls back to a generic message for non-Error failures', async () => {
    const { error, run } = useRequestStatus()

    await run(() => Promise.reject('boom'))

    expect(error.value).toBe('An unknown error occurred!')
  })

  it('clears the previous error when a new request starts', async () => {
    const { error, run } = useRequestStatus()
    await run(() => Promise.reject(new Error('first')))

    const pending = run(() => Promise.resolve('ok'))
    expect(error.value).toBeNull()
    await pending
    expect(error.value).toBeNull()
  })
})
