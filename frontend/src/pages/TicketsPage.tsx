import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import {
  Link,
} from 'react-router-dom'
import { getCategories } from '../api/categoryApi'
import { getTickets } from '../api/ticketApi'
import { useAuth } from '../auth/useAuth'
import type { Category } from '../types/category'
import type {
  Ticket,
  TicketFilters,
  TicketPriority,
  TicketStatus,
} from '../types/ticket'

export default function TicketsPage() {
  const {
    session,
    logout,
  } = useAuth()

  const [tickets, setTickets] =
    useState<Ticket[]>([])

  const [categories, setCategories] =
    useState<Category[]>([])

  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState<TicketStatus | ''>('')

  const [priority, setPriority] =
    useState<TicketPriority | ''>('')

  const [categoryId, setCategoryId] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true)
      setError('')

      try {
        const [
          ticketResponse,
          categoryResponse,
        ] = await Promise.all([
          getTickets(),
          getCategories(),
        ])

        setTickets(ticketResponse)

        setCategories(
          categoryResponse.filter(
            (category) => category.enabled
          )
        )
      } catch (exception) {
        if (exception instanceof Error) {
          setError(exception.message)
        } else {
          setError(
            'Could not load ticket data'
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadInitialData()
  }, [])

  async function loadTickets(
    filters: TicketFilters = {}
  ) {
    setIsLoading(true)
    setError('')

    try {
      const response =
        await getTickets(filters)

      setTickets(response)
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError(
          'Could not load tickets'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFilterSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    await loadTickets({
      search:
        search.trim() || undefined,

      status:
        status || undefined,

      priority:
        priority || undefined,

      categoryId:
        categoryId
          ? Number(categoryId)
          : undefined,
    })
  }

  async function handleReset() {
    setSearch('')
    setStatus('')
    setPriority('')
    setCategoryId('')

    await loadTickets()
  }

  return (
    <main className="tickets-page">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">
            Helpdesk Ticketing Platform
          </p>

          <h1>Tickets</h1>
        </div>

        <div className="app-header__account">
          <div>
            <strong>
              {session?.email}
            </strong>

            <span>
              {session?.role}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="page-content">
        <div className="page-toolbar">
          <div>
            <h2>Ticket management</h2>

            <p>
              Search existing tickets or create a new support request.
            </p>
          </div>

          <Link
            className="primary-link-button"
            to="/tickets/new"
          >
            Create ticket
          </Link>
        </div>

        <form
          className="ticket-filters"
          onSubmit={handleFilterSubmit}
        >
          <div className="ticket-filters__field">
            <label htmlFor="search">
              Search
            </label>

            <input
              id="search"
              type="search"
              placeholder="Title or description"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="ticket-filters__field">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as TicketStatus | ''
                )
              }
            >
              <option value="">
                All statuses
              </option>

              <option value="OPEN">
                Open
              </option>

              <option value="IN_PROGRESS">
                In progress
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>
          </div>

          <div className="ticket-filters__field">
            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as TicketPriority | ''
                )
              }
            >
              <option value="">
                All priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>

          <div className="ticket-filters__field">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
            >
              <option value="">
                All categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="ticket-filters__actions">
            <button
              type="submit"
              disabled={isLoading}
            >
              Apply filters
            </button>

            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                void handleReset()
              }}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="page-message">
            <p>Loading tickets...</p>
          </div>
        )}

        {!isLoading && error && (
          <div
            className="page-message page-message--error"
            role="alert"
          >
            <h2>
              Could not load tickets
            </h2>

            <p>{error}</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          tickets.length === 0 && (
            <div className="empty-state">
              <h2>No tickets found</h2>

              <p>
                No tickets match the selected filters.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          tickets.length > 0 && (
            <div className="ticket-panel">
              <div className="ticket-panel__header">
                <div>
                  <h2>All tickets</h2>

                  <p>
                    {tickets.length}{' '}
                    {tickets.length === 1
                      ? 'ticket'
                      : 'tickets'}
                  </p>
                </div>
              </div>

              <div className="ticket-table-wrapper">
                <table className="ticket-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Customer</th>
                      <th>Agent</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tickets.map(
                      (ticket) => (
                        <tr key={ticket.id}>
                          <td>
                            #{ticket.id}
                          </td>

                          <td>
                            <div className="ticket-title-cell">
                              <strong>
                                {ticket.title}
                              </strong>

                              <span>
                                {ticket.description}
                              </span>
                            </div>
                          </td>

                          <td>
                            {ticket.categoryName}
                          </td>

                          <td>
                            <span
                              className={`badge badge--status-${ticket.status.toLowerCase()}`}
                            >
                              {ticket.status.replace(
                                '_',
                                ' '
                              )}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge badge--priority-${ticket.priority.toLowerCase()}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>

                          <td>
                            Customer #{ticket.customerId}
                          </td>

                          <td>
                            {ticket.assignedAgentId
                              ? `Agent #${ticket.assignedAgentId}`
                              : 'Unassigned'}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </section>
    </main>
  )
}