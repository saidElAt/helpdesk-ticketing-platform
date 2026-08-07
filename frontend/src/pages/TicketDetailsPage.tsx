import {
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'
import { getTicketById } from '../api/ticketApi'
import type { Ticket } from '../types/ticket'

export default function TicketDetailsPage() {
  const { id } = useParams()

  const [ticket, setTicket] =
    useState<Ticket | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    async function loadTicket() {
      const ticketId = Number(id)

      if (
        !Number.isInteger(ticketId) ||
        ticketId <= 0
      ) {
        setError('Invalid ticket ID')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const response =
          await getTicketById(ticketId)

        setTicket(response)
      } catch (exception) {
        if (exception instanceof Error) {
          setError(exception.message)
        } else {
          setError(
            'Could not load ticket'
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadTicket()
  }, [id])

  return (
    <main className="ticket-details-page">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">
            Helpdesk Ticketing Platform
          </p>

          <h1>Ticket details</h1>
        </div>

        <div className="ticket-details-actions">
          {ticket && (
            <Link
              className="primary-link-button"
              to={`/tickets/${ticket.id}/edit`}
            >
              Edit ticket
            </Link>
          )}

          <Link
            className="button-secondary-link"
            to="/tickets"
          >
            Back to tickets
          </Link>
        </div>
      </header>

      <section className="page-content">
        {isLoading && (
          <div className="page-message">
            <p>Loading ticket...</p>
          </div>
        )}

        {!isLoading && error && (
          <div
            className="page-message page-message--error"
            role="alert"
          >
            <h2>
              Could not load ticket
            </h2>

            <p>{error}</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          ticket && (
            <article className="ticket-details-card">
              <div className="ticket-details-card__header">
                <div>
                  <p className="ticket-details-card__id">
                    Ticket #{ticket.id}
                  </p>

                  <h2>{ticket.title}</h2>
                </div>

                <div className="ticket-details-card__badges">
                  <span
                    className={`badge badge--status-${ticket.status.toLowerCase()}`}
                  >
                    {ticket.status.replace(
                      '_',
                      ' '
                    )}
                  </span>

                  <span
                    className={`badge badge--priority-${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <section className="ticket-details-card__section">
                <h3>Description</h3>

                <p>{ticket.description}</p>
              </section>

              <dl className="ticket-details-grid">
                <div>
                  <dt>Category</dt>
                  <dd>
                    {ticket.categoryName}
                  </dd>
                </div>

                <div>
                  <dt>Customer</dt>
                  <dd>
                    <span className="person-name">
                      {ticket.customerName}
                    </span>

                    <span className="person-email">
                      {ticket.customerEmail}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt>Assigned agent</dt>
                  <dd>
                    {ticket.assignedAgentId ? (
                      <>
                        <span className="person-name">
                          {ticket.assignedAgentName}
                        </span>

                        <span className="person-email">
                          {ticket.assignedAgentEmail}
                        </span>
                      </>
                    ) : (
                      'Unassigned'
                    )}
                  </dd>
                </div>

                <div>
                  <dt>Status</dt>
                  <dd>
                    {ticket.status.replace(
                      '_',
                      ' '
                    )}
                  </dd>
                </div>

                <div>
                  <dt>Priority</dt>
                  <dd>
                    {ticket.priority}
                  </dd>
                </div>

                <div>
                  <dt>Ticket ID</dt>
                  <dd>
                    #{ticket.id}
                  </dd>
                </div>
              </dl>
            </article>
          )}
      </section>
    </main>
  )
}