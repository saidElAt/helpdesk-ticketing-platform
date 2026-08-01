import type { AuthResponse, AuthSession } from '../types/auth'

const TOKEN_KEY = 'token'
const SESSION_KEY = 'authSession'

export function saveAuthSession(response: AuthResponse): AuthSession {
  const session: AuthSession = {
    token: response.token,
    userId: response.userId,
    email: response.email,
    role: response.role,
  }

  localStorage.setItem(TOKEN_KEY, response.token)
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return session
}

export function getAuthSession(): AuthSession | null {
  const storedSession = localStorage.getItem(SESSION_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as AuthSession
  } catch {
    clearAuthSession()
    return null
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(SESSION_KEY)
}