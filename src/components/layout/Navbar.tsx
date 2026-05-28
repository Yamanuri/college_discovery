'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary-600">🎓</span>
          <span className="text-gray-900">College<span className="text-primary-600">Discover</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/colleges" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
            Colleges
          </Link>
          <Link href="/compare" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
            Compare
          </Link>
          <Link href="/predictor" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
            Predictor
          </Link>
          {user ? (
            <>
              <Link href="/saved" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                Saved
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="btn-outline text-sm py-2">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth" className="text-gray-600 hover:text-primary-600 font-medium">
                Login
              </Link>
              <Link href="/auth?tab=register" className="btn-primary text-sm py-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 animate-slide-up">
          <Link href="/colleges" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Colleges</Link>
          <Link href="/compare" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Compare</Link>
          <Link href="/predictor" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Predictor</Link>
          {user ? (
            <>
              <Link href="/saved" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Saved</Link>
              <button onClick={logout} className="block w-full text-left py-2 text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <Link href="/auth" className="block py-2 text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  )
}
