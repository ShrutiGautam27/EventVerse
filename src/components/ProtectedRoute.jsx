import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same rule as the original showPage(): dashboard/register need a logged-in user.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}
