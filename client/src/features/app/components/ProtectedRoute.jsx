import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="app-route-loading">Restoring your workspace…</div>
  if (user) return <Outlet />
  const destination = `${location.pathname}${location.search}`
  return <Navigate to={`/signin?redirect=${encodeURIComponent(destination)}`} replace />
}
