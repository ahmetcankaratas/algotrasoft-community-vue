import { isAxiosError } from 'axios'
import { http } from './http'

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

interface AuthErrorBody {
  error?: { message?: string }
}

const SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_EXISTS: 'This email exists already!',
  EMAIL_NOT_FOUND: 'This email does not exist!',
  INVALID_PASSWORD: 'This password is not correct!',
}

const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred!'

function toAuthError(error: unknown): Error {
  const code = isAxiosError<AuthErrorBody>(error) ? error.response?.data?.error?.message : undefined
  const message = code === undefined ? undefined : ERROR_MESSAGES[code]
  return new Error(message ?? UNKNOWN_ERROR_MESSAGE)
}

export async function signup(email: string, password: string): Promise<AuthResponseData> {
  try {
    const { data } = await http.post<AuthResponseData>(
      SIGNUP_URL,
      { email, password, returnSecureToken: true },
      { params: { key: import.meta.env.VITE_FIREBASE_API_KEY } },
    )
    return data
  } catch (error) {
    throw toAuthError(error)
  }
}
