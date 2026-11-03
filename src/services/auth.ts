import { isAxiosError } from 'axios'
import { http } from './http'

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

interface AuthErrorBody {
  error?: { message?: string }
}

const AUTH_BASE_URL = 'https://identitytoolkit.googleapis.com/v1'

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

async function authRequest(
  endpoint: string,
  email: string,
  password: string,
): Promise<AuthResponseData> {
  try {
    const { data } = await http.post<AuthResponseData>(
      `${AUTH_BASE_URL}/${endpoint}`,
      { email, password, returnSecureToken: true },
      { params: { key: import.meta.env.VITE_FIREBASE_API_KEY } },
    )
    return data
  } catch (error) {
    throw toAuthError(error)
  }
}

export function signup(email: string, password: string): Promise<AuthResponseData> {
  return authRequest('accounts:signUp', email, password)
}

export function login(email: string, password: string): Promise<AuthResponseData> {
  return authRequest('accounts:signInWithPassword', email, password)
}
