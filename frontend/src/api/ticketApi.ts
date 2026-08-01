import { apiFetch } from './client'
import type { CreateTicketRequest } from '../types/createTicket'
import type {
  Ticket,
  TicketFilters,
} from '../types/ticket'

function buildQueryString(
  filters: TicketFilters
): string {
  const params = new URLSearchParams()

  if (filters.search?.trim()) {
    params.set(
      'search',
      filters.search.trim()
    )
  }

  if (filters.status) {
    params.set(
      'status',
      filters.status
    )
  }

  if (filters.priority) {
    params.set(
      'priority',
      filters.priority
    )
  }

  if (filters.categoryId !== undefined) {
    params.set(
      'categoryId',
      String(filters.categoryId)
    )
  }

  if (
    filters.assignedAgentId !== undefined
  ) {
    params.set(
      'assignedAgentId',
      String(filters.assignedAgentId)
    )
  }

  if (filters.customerId !== undefined) {
    params.set(
      'customerId',
      String(filters.customerId)
    )
  }

  const queryString = params.toString()

  return queryString
    ? `?${queryString}`
    : ''
}

export function getTickets(
  filters: TicketFilters = {}
): Promise<Ticket[]> {
  return apiFetch<Ticket[]>(
    `/tickets${buildQueryString(filters)}`
  )
}

export function createTicket(
  request: CreateTicketRequest
): Promise<Ticket> {
  return apiFetch<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}