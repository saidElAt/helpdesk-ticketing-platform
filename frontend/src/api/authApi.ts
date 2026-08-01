import { apiFetch } from './client'
import type { AuthResponse, LoginRequest } from '../types/auth'

export function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}