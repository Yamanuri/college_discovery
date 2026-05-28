'use client'
// src/app/auth/page.tsx
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, register } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser, user } = useAuth()

  useEffect(() => {
    if (user) router.push('/')
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let result
      if (tab === 'login') {
        result = await login(email, password)
      } else {
        if (name.trim().length < 2) { setError('Name must be at least 2 characters'); setLoading(false); return }
        result = await register(name, email, password)
      }
      if (result.ok) {
        setUser(result.data.user)
        router.push('/')
      } else {
        setError(result.data.error || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mt-1">
            {tab === 'login' ? 'Sign in to access saved colleges' : 'Start discovering colleges today'}
          </p>
        </div>

        <div className="card p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  className="input"
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? '⏳ Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {tab === 'login' && (
              <div className="text-center text-sm text-gray-400 mt-2">
                Demo: <span className="font-mono">demo@example.com</span> / <span className="font-mono">demo1234</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
