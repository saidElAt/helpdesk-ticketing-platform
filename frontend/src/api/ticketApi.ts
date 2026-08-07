import { apiFetch } from './client'
import type { CreateTicketRequest } from '../types/createTicket'
import type {
  Ticket,
  TicketFilters,
  TicketStatus,
} from '../types/ticket'
import type { UpdateTicketRequest } from '../types/updateTicket'

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

export function getTicketById(
  ticketId: number
): Promise<Ticket> {
  return apiFetch<Ticket>(
    `/tickets/${ticketId}`
  )
}

export function createTicket(
  request: CreateTicketRequest
): Promise<Ticket> {
  return apiFetch<Ticket>(
    '/tickets',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}

export function updateTicket(
  ticketId: number,
  request: UpdateTicketRequest
): Promise<Ticket> {
  return apiFetch<Ticket>(
    `/tickets/${ticketId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
}

export function changeTicketStatus(
  ticketId: number,
  status: TicketStatus
): Promise<Ticket> {
  return apiFetch<Ticket>(
    `/tickets/${ticketId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status,
      }),
    }
  )
}

export function assignTicket(
  ticketId: number,
  agentId: number
): Promise<Ticket> {
  return apiFetch<Ticket>(
    `/tickets/${ticketId}/assign/${agentId}`,
    {
      method: 'PATCH',
    }
  )
}