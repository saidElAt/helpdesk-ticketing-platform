import type { TicketPriority } from './ticket'

export interface UpdateTicketRequest {
  title: string
  description: string
  priority: TicketPriority
  categoryId: number
}