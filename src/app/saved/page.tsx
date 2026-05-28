'use client'
// src/app/saved/page.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { CollegeCard } from '@/components/college/CollegeCard'
import { College } from '@/types'
import { unsaveCollege } from '@/lib/api'

export default function SavedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saved, setSaved] = useState<Array<{ id: string; collegeId: string; college: College }>>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/auth')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/saved')
      .then(r => r.json())
      .then(data => { setSaved(data); setFetching(false) })
      .catch(() => setFetching(false))
  }, [user])

  const handleUnsave = async (collegeId: string) => {
    await unsaveCollege(collegeId)
    setSaved(prev => prev.filter(s => s.collegeId !== collegeId))
  }

  if (loading || fetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="card animate-pulse"><div className="h-44 skeleton" /><div className="p-5 space-y-3"><div className="skeleton h-4 rounded" /><div className="skeleton h-4 w-2/3 rounded" /></div></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Colleges</h1>
        <p className="text-gray-500 mt-1">{saved.length} college{saved.length !== 1 ? 's' : ''} saved</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📌</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved colleges yet</h3>
          <p className="text-gray-500 mb-6">Browse colleges and save your favourites here</p>
          <a href="/colleges" className="btn-primary inline-block">Browse Colleges</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(({ college, collegeId }) => (
            <CollegeCard
              key={collegeId}
              college={college}
              showSaveButton
              isSaved
              onSaveToggle={() => handleUnsave(collegeId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
