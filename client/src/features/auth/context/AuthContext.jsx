import { useEffect, useMemo, useState } from 'react'
import { authService } from '../../../services/authService'
import AuthContext from './contextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    authService.me().then((data) => { if (active) setUser(data.user) }).catch(() => { if (active) setUser(null) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    login: async (credentials) => { const data = await authService.login(credentials); setUser(data.user); return data.user },
    register: async (credentials) => { const data = await authService.register(credentials); setUser(data.user); return data.user },
    logout: async () => { await authService.logout(); setUser(null) },
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

