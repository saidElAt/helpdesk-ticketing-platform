import { apiFetch } from './client'
import type { UserSummary } from '../types/user'

export function getAgents(): Promise<UserSummary[]> {
  return apiFetch<UserSummary[]>(
    '/users/agents'
  )
}