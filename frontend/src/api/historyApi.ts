import { apiFetch } from './client'
import type { TicketStatusHistory } from '../types/ticketHistory'

export function getTicketHistory(
  ticketId: number
): Promise<TicketStatusHistory[]> {
  return apiFetch<TicketStatusHistory[]>(
    `/tickets/${ticketId}/history`
  )
}