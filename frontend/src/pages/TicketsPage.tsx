import { useAuth } from '../auth/useAuth'

export default function TicketsPage() {
  const {
    session,
    logout,
  } = useAuth()

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
            <strong>{session?.email}</strong>
            <span>{session?.role}</span>
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
        <div className="empty-state">
          <h2>Frontend connection established</h2>

          <p>
            You are authenticated with the Spring Boot
            backend. The ticket list will be added next.
          </p>
        </div>
      </section>
    </main>
  )
}