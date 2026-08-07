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
  customerName: string
  customerEmail: string

  assignedAgentId: number | null
  assignedAgentName: string | null
  assignedAgentEmail: string | null

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