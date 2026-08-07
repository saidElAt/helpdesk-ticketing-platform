import { apiFetch } from './client'
import type { TicketMetrics } from '../types/dashboard'

export function getDashboardSummary(): Promise<TicketMetrics> {
  return apiFetch<TicketMetrics>(
    '/dashboard/summary'
  )
}