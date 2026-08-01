import type { TicketPriority } from './ticket'

export interface CreateTicketRequest {
  title: string
  description: string
  priority: TicketPriority
  customerId: number
  categoryId: number
}