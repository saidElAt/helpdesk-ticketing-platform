export interface TicketMetrics {
  totalTickets: number

  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  closedTickets: number

  lowPriorityTickets: number
  mediumPriorityTickets: number
  highPriorityTickets: number
  criticalPriorityTickets: number

  assignedTickets: number
  unassignedTickets: number
}