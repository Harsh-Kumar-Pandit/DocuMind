import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth'

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="app-route-loading">Restoring your session…</div>
  return user ? <Navigate to="/app/chat" replace /> : <Outlet />
}
