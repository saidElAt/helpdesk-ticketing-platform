import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { login as loginRequest } from '../api/authApi'
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '../api/authStorage'
import type {
  AuthSession,
  LoginRequest,
} from '../types/auth'

export interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<AuthSession | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    setSession(getAuthSession())
    setIsLoading(false)
  }, [])

  async function login(
    credentials: LoginRequest
  ): Promise<void> {
    const response =
      await loginRequest(credentials)

    const savedSession =
      saveAuthSession(response)

    setSession(savedSession)
  }

  function logout(): void {
    clearAuthSession()
    setSession(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isLoading,
      login,
      logout,
    }),
    [session, isLoading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}