// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AuthProvider } from '@/components/layout/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CollegeDiscover — Find Your Perfect College',
  description: 'Discover, compare, and choose the best colleges in India. Get placement data, fees, ratings and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm">© 2024 CollegeDiscover. Built by Yamanuri for the AI Software Engineer Internship Demo Task.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
