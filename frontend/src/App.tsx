import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import CreateTicketPage from './pages/CreateTicketPage'
import DashboardPage from './pages/DashboardPage'
import EditTicketPage from './pages/EditTicketPage'
import LoginPage from './pages/LoginPage'
import TicketDetailsPage from './pages/TicketDetailsPage'
import TicketsPage from './pages/TicketsPage'
import './App.css'
import './ticket-details.css'
import './dashboard.css'

function HomeRedirect() {
  const {
    session,
    isLoading,
  } = useAuth()

  if (isLoading) {
    return (
      <main className="page-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (
    session?.role === 'AGENT' ||
    session?.role === 'ADMIN'
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return (
    <Navigate
      to="/tickets"
      replace
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <CreateTicketPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id/edit"
            element={
              <ProtectedRoute>
                <EditTicketPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<HomeRedirect />}
          />

          <Route
            path="*"
            element={<HomeRedirect />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}