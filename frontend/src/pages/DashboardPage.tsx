import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Link,
  Navigate,
} from 'react-router-dom'
import { getDashboardSummary } from '../api/dashboardApi'
import { getTickets } from '../api/ticketApi'
import { useAuth } from '../auth/useAuth'
import type { TicketMetrics } from '../types/dashboard'
import type { Ticket } from '../types/ticket'

export default function DashboardPage() {
  const {
    session,
    logout,
  } = useAuth()

  const [metrics, setMetrics] =
    useState<TicketMetrics | null>(null)

  const [tickets, setTickets] =
    useState<Ticket[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const isStaff =
    session?.role === 'AGENT' ||
    session?.role === 'ADMIN'

  useEffect(() => {
    if (!isStaff) {
      return
    }

    async function loadDashboard() {
      setIsLoading(true)
      setError('')

      try {
        const [
          metricsResponse,
          ticketsResponse,
        ] = await Promise.all([
          getDashboardSummary(),
          getTickets(),
        ])

        setMetrics(metricsResponse)
        setTickets(ticketsResponse)
      } catch (exception) {
        if (exception instanceof Error) {
          setError(exception.message)
        } else {
          setError(
            'Could not load dashboard'
          )
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadDashboard()
  }, [isStaff])

  const recentTickets = useMemo(
    () =>
      [...tickets]
        .sort(
          (first, second) =>
            second.id - first.id
        )
        .slice(0, 5),
    [tickets]
  )

  if (!isStaff) {
    return (
      <Navigate
        to="/tickets"
        replace
      />
    )
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Helpdesk Ticketing Platform
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Monitor ticket activity and support workload.
          </p>
        </div>

        <div className="dashboard-account">
          <div>
            <strong>
              {session?.email}
            </strong>

            <span>
              {session?.role}
            </span>
          </div>

          <Link
            className="dashboard-secondary-button"
            to="/tickets"
          >
            View tickets
          </Link>

          <button
            type="button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        {isLoading && (
          <div className="dashboard-message">
            Loading dashboard...
          </div>
        )}

        {!isLoading && error && (
          <div className="dashboard-message dashboard-message--error">
            <strong>
              Could not load dashboard
            </strong>

            <span>{error}</span>
          </div>
        )}

        {!isLoading &&
          !error &&
          metrics && (
            <>
              <section className="dashboard-hero">
                <div>
                  <p className="dashboard-hero__label">
                    Support overview
                  </p>

                  <h2>
                    {metrics.totalTickets} total tickets
                  </h2>

                  <p>
                    Track current workload, priorities,
                    assignments and recent ticket activity.
                  </p>
                </div>

                <Link
                  className="dashboard-primary-button"
                  to="/tickets"
                >
                  Manage tickets
                </Link>
              </section>

              <section className="dashboard-kpis">
                <article className="dashboard-kpi">
                  <span>Total tickets</span>
                  <strong>
                    {metrics.totalTickets}
                  </strong>
                  <small>
                    All support requests
                  </small>
                </article>

                <article className="dashboard-kpi dashboard-kpi--open">
                  <span>Open</span>
                  <strong>
                    {metrics.openTickets}
                  </strong>
                  <small>
                    Awaiting action
                  </small>
                </article>

                <article className="dashboard-kpi dashboard-kpi--progress">
                  <span>In progress</span>
                  <strong>
                    {metrics.inProgressTickets}
                  </strong>
                  <small>
                    Currently being handled
                  </small>
                </article>

                <article className="dashboard-kpi dashboard-kpi--resolved">
                  <span>Resolved</span>
                  <strong>
                    {metrics.resolvedTickets}
                  </strong>
                  <small>
                    Solution provided
                  </small>
                </article>

                <article className="dashboard-kpi dashboard-kpi--closed">
                  <span>Closed</span>
                  <strong>
                    {metrics.closedTickets}
                  </strong>
                  <small>
                    Completed tickets
                  </small>
                </article>

                <article className="dashboard-kpi dashboard-kpi--critical">
                  <span>Critical</span>
                  <strong>
                    {metrics.criticalPriorityTickets}
                  </strong>
                  <small>
                    Highest priority
                  </small>
                </article>
              </section>

              <section className="dashboard-grid">
                <article className="dashboard-panel">
                  <div className="dashboard-panel__header">
                    <div>
                      <h2>Tickets by status</h2>
                      <p>
                        Current ticket lifecycle distribution.
                      </p>
                    </div>
                  </div>

                  <MetricBar
                    label="Open"
                    value={metrics.openTickets}
                    total={metrics.totalTickets}
                    variant="blue"
                  />

                  <MetricBar
                    label="In progress"
                    value={metrics.inProgressTickets}
                    total={metrics.totalTickets}
                    variant="amber"
                  />

                  <MetricBar
                    label="Resolved"
                    value={metrics.resolvedTickets}
                    total={metrics.totalTickets}
                    variant="green"
                  />

                  <MetricBar
                    label="Closed"
                    value={metrics.closedTickets}
                    total={metrics.totalTickets}
                    variant="slate"
                  />
                </article>

                <article className="dashboard-panel">
                  <div className="dashboard-panel__header">
                    <div>
                      <h2>Tickets by priority</h2>
                      <p>
                        Current severity distribution.
                      </p>
                    </div>
                  </div>

                  <MetricBar
                    label="Low"
                    value={metrics.lowPriorityTickets}
                    total={metrics.totalTickets}
                    variant="green"
                  />

                  <MetricBar
                    label="Medium"
                    value={metrics.mediumPriorityTickets}
                    total={metrics.totalTickets}
                    variant="blue"
                  />

                  <MetricBar
                    label="High"
                    value={metrics.highPriorityTickets}
                    total={metrics.totalTickets}
                    variant="orange"
                  />

                  <MetricBar
                    label="Critical"
                    value={metrics.criticalPriorityTickets}
                    total={metrics.totalTickets}
                    variant="red"
                  />
                </article>

                <article className="dashboard-panel dashboard-panel--assignment">
                  <div className="dashboard-panel__header">
                    <div>
                      <h2>Assignment workload</h2>
                      <p>
                        Ticket allocation across the support team.
                      </p>
                    </div>
                  </div>

                  <div className="assignment-summary">
                    <div>
                      <span>Assigned</span>
                      <strong>
                        {metrics.assignedTickets}
                      </strong>
                    </div>

                    <div>
                      <span>Unassigned</span>
                      <strong>
                        {metrics.unassignedTickets}
                      </strong>
                    </div>
                  </div>

                  <MetricBar
                    label="Assigned"
                    value={metrics.assignedTickets}
                    total={metrics.totalTickets}
                    variant="blue"
                  />

                  <MetricBar
                    label="Unassigned"
                    value={metrics.unassignedTickets}
                    total={metrics.totalTickets}
                    variant="red"
                  />
                </article>

                <article className="dashboard-panel dashboard-panel--recent">
                  <div className="dashboard-panel__header">
                    <div>
                      <h2>Recent tickets</h2>
                      <p>
                        Latest support requests in the system.
                      </p>
                    </div>

                    <Link to="/tickets">
                      View all
                    </Link>
                  </div>

                  <div className="dashboard-recent-list">
                    {recentTickets.length === 0 && (
                      <p className="dashboard-empty">
                        No tickets available.
                      </p>
                    )}

                    {recentTickets.map(
                      (ticket) => (
                        <Link
                          className="dashboard-recent-ticket"
                          key={ticket.id}
                          to={`/tickets/${ticket.id}`}
                        >
                          <div>
                            <strong>
                              #{ticket.id}{' '}
                              {ticket.title}
                            </strong>

                            <span>
                              {ticket.categoryName}
                            </span>
                          </div>

                          <div className="dashboard-recent-ticket__meta">
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
                        </Link>
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

interface MetricBarProps {
  label: string
  value: number
  total: number
  variant:
    | 'blue'
    | 'amber'
    | 'green'
    | 'slate'
    | 'orange'
    | 'red'
}

function MetricBar({
  label,
  value,
  total,
  variant,
}: MetricBarProps) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0

  return (
    <div className="metric-row">
      <div className="metric-row__header">
        <span>{label}</span>

        <strong>
          {value}
          <small>
            {percentage}%
          </small>
        </strong>
      </div>

      <div className="metric-track">
        <div
          className={`metric-fill metric-fill--${variant}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}