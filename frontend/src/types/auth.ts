export type UserRole = 'CUSTOMER' | 'AGENT' | 'ADMIN'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number
  userId: number
  email: string
  role: UserRole
}

export interface AuthSession {
  token: string
  userId: number
  email: string
  role: UserRole
}