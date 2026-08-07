import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'
import {
  createComment,
  getComments,
} from '../api/commentApi'
import { getTicketHistory } from '../api/historyApi'
import {
  assignTicket,
  changeTicketStatus,
  getTicketById,
} from '../api/ticketApi'
import { getAgents } from '../api/userApi'
import { useAuth } from '../auth/useAuth'
import type { Comment } from '../types/comment'
import type {
  Ticket,
  TicketStatus,
} from '../types/ticket'
import type { TicketStatusHistory } from '../types/ticketHistory'
import type { UserSummary } from '../types/user'

export default function TicketDetailsPage() {
  const { id } = useParams()
  const { session } = useAuth()

  const [ticket, setTicket] =
    useState<Ticket | null>(null)

  const [comments, setComments] =
    useState<Comment[]>([])

  const [history, setHistory] =
    useState<TicketStatusHistory[]>([])

  const [agents, setAgents] =
    useState<UserSummary[]>([])

  const [selectedStatus, setSelectedStatus] =
    useState<TicketStatus>('OPEN')

  const [selectedAgentId, setSelectedAgentId] =
    useState('')

  const [commentContent, setCommentContent] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [isWorking, setIsWorking] =
    useState(false)

  const [error, setError] =
    useState('')

  const role = session?.role

  const isAdmin =
    role === 'ADMIN'

  const isAgent =
    role === 'AGENT'

  const canChangeStatus =
    isAdmin || isAgent

  const canAssign =
    isAdmin

  const canEdit =
    ticket !== null &&
    (
      isAdmin ||
      isAgent ||
      (
        role === 'CUSTOMER' &&
        ticket.customerId === session?.userId &&
        (
          ticket.status === 'OPEN' ||
          ticket.status === 'IN_PROGRESS'
        )
      )
    )

  useEffect(() => {
    async function loadData() {
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
        const [
          ticketResponse,
          commentResponse,
          historyResponse,
        ] = await Promise.all([
          getTicketById(ticketId),
          getComments(ticketId),
          getTicketHistory(ticketId),
        ])

        setTicket(ticketResponse)
        setComments(commentResponse)
        setHistory(historyResponse)
        setSelectedStatus(
          ticketResponse.status
        )

        if (
          ticketResponse.assignedAgentId
        ) {
          setSelectedAgentId(
            String(
              ticketResponse.assignedAgentId
            )
          )
        }

        if (role === 'ADMIN') {
          const agentResponse =
            await getAgents()

          setAgents(agentResponse)
        }
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

    void loadData()
  }, [id, role])

  async function refreshTicketData(
    ticketId: number
  ) {
    const [
      ticketResponse,
      commentResponse,
      historyResponse,
    ] = await Promise.all([
      getTicketById(ticketId),
      getComments(ticketId),
      getTicketHistory(ticketId),
    ])

    setTicket(ticketResponse)
    setComments(commentResponse)
    setHistory(historyResponse)
    setSelectedStatus(
      ticketResponse.status
    )

    setSelectedAgentId(
      ticketResponse.assignedAgentId
        ? String(
            ticketResponse.assignedAgentId
          )
        : ''
    )
  }

  async function handleStatusChange(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const ticketId = Number(id)

    if (!ticketId) {
      return
    }

    setIsWorking(true)
    setError('')

    try {
      await changeTicketStatus(
        ticketId,
        selectedStatus
      )

      await refreshTicketData(ticketId)
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError(
          'Could not change ticket status'
        )
      }
    } finally {
      setIsWorking(false)
    }
  }

  async function handleAssignment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const ticketId = Number(id)
    const agentId =
      Number(selectedAgentId)

    if (!ticketId || !agentId) {
      setError(
        'Please select an agent'
      )
      return
    }

    setIsWorking(true)
    setError('')

    try {
      await assignTicket(
        ticketId,
        agentId
      )

      await refreshTicketData(ticketId)
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError(
          'Could not assign ticket'
        )
      }
    } finally {
      setIsWorking(false)
    }
  }

  async function handleCommentSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const ticketId = Number(id)

    if (
      !ticketId ||
      commentContent.trim().length < 2
    ) {
      return
    }

    setIsWorking(true)
    setError('')

    try {
      await createComment(
        ticketId,
        {
          content:
            commentContent.trim(),
        }
      )

      setCommentContent('')

      await refreshTicketData(ticketId)
    } catch (exception) {
      if (exception instanceof Error) {
        setError(exception.message)
      } else {
        setError(
          'Could not add comment'
        )
      }
    } finally {
      setIsWorking(false)
    }
  }

  function formatDate(
    value: string
  ) {
    return new Date(value)
      .toLocaleString()
  }

  if (isLoading) {
    return (
      <main className="page-center">
        <p>Loading ticket...</p>
      </main>
    )
  }

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
          {canEdit && ticket && (
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
        {error && (
          <div
            className="page-message page-message--error"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {ticket && (
          <>
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
                  <dd>#{ticket.id}</dd>
                </div>
              </dl>
            </article>

            {(canChangeStatus || canAssign) && (
              <section className="ticket-management-card">
                <h2>Ticket management</h2>

                <div className="ticket-management-grid">
                  {canChangeStatus && (
                    <form
                      className="management-form"
                      onSubmit={handleStatusChange}
                    >
                      <label htmlFor="ticket-status">
                        Change status
                      </label>

                      <select
                        id="ticket-status"
                        value={selectedStatus}
                        onChange={(event) =>
                          setSelectedStatus(
                            event.target.value as TicketStatus
                          )
                        }
                      >
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

                      <button
                        type="submit"
                        disabled={isWorking}
                      >
                        Update status
                      </button>
                    </form>
                  )}

                  {canAssign && (
                    <form
                      className="management-form"
                      onSubmit={handleAssignment}
                    >
                      <label htmlFor="ticket-agent">
                        Assign agent
                      </label>

                      <select
                        id="ticket-agent"
                        value={selectedAgentId}
                        onChange={(event) =>
                          setSelectedAgentId(
                            event.target.value
                          )
                        }
                      >
                        <option value="">
                          Select agent
                        </option>

                        {agents.map(
                          (agent) => (
                            <option
                              key={agent.id}
                              value={agent.id}
                            >
                              {agent.firstName}{' '}
                              {agent.lastName}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        type="submit"
                        disabled={
                          isWorking ||
                          !selectedAgentId
                        }
                      >
                        Assign
                      </button>
                    </form>
                  )}
                </div>
              </section>
            )}

            <section className="ticket-activity-grid">
              <article className="ticket-activity-card">
                <h2>Comments</h2>

                <form
                  className="comment-form"
                  onSubmit={handleCommentSubmit}
                >
                  <textarea
                    rows={4}
                    minLength={2}
                    maxLength={5000}
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={(event) =>
                      setCommentContent(
                        event.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="submit"
                    disabled={isWorking}
                  >
                    Add comment
                  </button>
                </form>

                <div className="activity-list">
                  {comments.length === 0 && (
                    <p className="activity-empty">
                      No comments yet.
                    </p>
                  )}

                  {comments.map(
                    (comment) => (
                      <div
                        className="comment-item"
                        key={comment.id}
                      >
                        <div className="activity-item-header">
                          <strong>
                            {comment.authorName}
                          </strong>

                          <span>
                            {formatDate(
                              comment.createdAt
                            )}
                          </span>
                        </div>

                        <p>
                          {comment.content}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </article>

              <article className="ticket-activity-card">
                <h2>Status history</h2>

                <div className="activity-list">
                  {history.length === 0 && (
                    <p className="activity-empty">
                      No status history yet.
                    </p>
                  )}

                  {history.map(
                    (entry) => (
                      <div
                        className="history-item"
                        key={entry.id}
                      >
                        <div className="activity-item-header">
                          <strong>
                            {entry.oldStatus
                              ? `${entry.oldStatus.replace(
                                  '_',
                                  ' '
                                )} → ${entry.newStatus.replace(
                                  '_',
                                  ' '
                                )}`
                              : `Created as ${entry.newStatus.replace(
                                  '_',
                                  ' '
                                )}`}
                          </strong>

                          <span>
                            {formatDate(
                              entry.changedAt
                            )}
                          </span>
                        </div>

                        {entry.changedByName && (
                          <p>
                            Changed by{' '}
                            {entry.changedByName}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </section>
    </main>
  )
}