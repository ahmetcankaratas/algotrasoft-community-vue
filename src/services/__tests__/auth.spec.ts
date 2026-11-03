import { describe, it, expect, vi, afterEach } from 'vitest'

import { signup } from '../auth'
import { http } from '../http'

vi.mock('../http', () => ({
  http: { post: vi.fn<typeof http.post>() },
}))

const postMock = vi.mocked(http.post)

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

  it('rejects when the request fails', async () => {
    const failure = new Error('Network Error')
    postMock.mockRejectedValue(failure)

    await expect(signup('ahmet@example.com', 'secret1')).rejects.toBe(failure)
  })
})
