import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CreateTicketPage from './pages/CreateTicketPage'
import EditTicketPage from './pages/EditTicketPage'
import LoginPage from './pages/LoginPage'
import TicketDetailsPage from './pages/TicketDetailsPage'
import TicketsPage from './pages/TicketsPage'
import './App.css'
import './ticket-details.css'

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
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailsPage />
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
            path="/"
            element={
              <Navigate
                to="/tickets"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/tickets"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}