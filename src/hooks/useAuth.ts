'use client'
// src/hooks/useAuth.ts
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { logout as apiLogout } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUser(data?.user || null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const logout = async () => {
    await apiLogout()
    setUser(null)
    window.location.href = '/'
  }

  return { user, loading, setUser, logout }
}
