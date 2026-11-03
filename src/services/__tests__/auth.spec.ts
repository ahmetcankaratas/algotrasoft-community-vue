import { describe, it, expect, vi, afterEach } from 'vitest'

import { AxiosError, type AxiosResponse } from 'axios'
import { signup, login } from '../auth'
import { http } from '../http'

vi.mock('../http', () => ({
  http: { post: vi.fn<typeof http.post>() },
}))

const postMock = vi.mocked(http.post)

function firebaseError(code: string): AxiosError {
  const response = { status: 400, data: { error: { message: code } } } as AxiosResponse
  return new AxiosError(
    'Request failed with status code 400',
    '400',
    undefined,
    undefined,
    response,
  )
}

describe('signup', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    postMock.mockReset()
  })

  it('posts the credentials to the Firebase signup endpoint and returns the response body', async () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key')
    postMock.mockResolvedValue({ data: { idToken: 'token', email: 'ahmet@example.com' } })

    const data = await signup('ahmet@example.com', 'secret1')

    expect(data).toMatchObject({ idToken: 'token', email: 'ahmet@example.com' })
    expect(postMock).toHaveBeenCalledWith(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
      { email: 'ahmet@example.com', password: 'secret1', returnSecureToken: true },
      { params: { key: 'test-key' } },
    )
  })

  it('posts the credentials to the Firebase sign-in endpoint', async () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key')
    postMock.mockResolvedValue({ data: { idToken: 'token', registered: true } })

    const data = await login('ahmet@example.com', 'secret1')

    expect(data).toMatchObject({ idToken: 'token', registered: true })
    expect(postMock).toHaveBeenCalledWith(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
      { email: 'ahmet@example.com', password: 'secret1', returnSecureToken: true },
      { params: { key: 'test-key' } },
    )
  })

  it.each([
    ['EMAIL_EXISTS', 'This email exists already!'],
    ['EMAIL_NOT_FOUND', 'This email does not exist!'],
    ['INVALID_PASSWORD', 'This password is not correct!'],
  ])('maps the Firebase error code %s to a readable message', async (code, message) => {
    postMock.mockRejectedValue(firebaseError(code))

    await expect(signup('ahmet@example.com', 'secret1')).rejects.toThrow(message)
  })

  it('maps login errors the same way', async () => {
    postMock.mockRejectedValue(firebaseError('INVALID_PASSWORD'))

    await expect(login('ahmet@example.com', 'wrong1')).rejects.toThrow(
      'This password is not correct!',
    )
  })

  it('falls back to a generic message for unknown Firebase codes', async () => {
    postMock.mockRejectedValue(firebaseError('SOMETHING_ELSE'))

    await expect(signup('ahmet@example.com', 'secret1')).rejects.toThrow(
      'An unknown error occurred!',
    )
  })

  it('falls back to a generic message when the failure is not an HTTP response', async () => {
    postMock.mockRejectedValue(new Error('Network Error'))

    await expect(signup('ahmet@example.com', 'secret1')).rejects.toThrow(
      'An unknown error occurred!',
    )
  })
})
