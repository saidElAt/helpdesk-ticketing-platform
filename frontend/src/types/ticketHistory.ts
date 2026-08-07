import type { TicketStatus } from './ticket'

export interface TicketStatusHistory {
  id: number
  ticketId: number
  oldStatus: TicketStatus | null
  newStatus: TicketStatus
  changedById: number | null
  changedByName: string | null
  changedAt: string
}