import { http } from './http'

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

const SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp'

export async function signup(email: string, password: string): Promise<AuthResponseData> {
  const { data } = await http.post<AuthResponseData>(
    SIGNUP_URL,
    { email, password, returnSecureToken: true },
    { params: { key: import.meta.env.VITE_FIREBASE_API_KEY } },
  )
  return data
}
