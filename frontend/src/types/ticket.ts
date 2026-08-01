export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'

export type TicketPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  customerId: number
  assignedAgentId: number | null
  categoryId: number
  categoryName: string
}

export interface TicketFilters {
  search?: string
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: number
  assignedAgentId?: number
  customerId?: number
}