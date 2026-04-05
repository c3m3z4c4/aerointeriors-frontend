import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface Props { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props): React.ReactElement {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated() || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
