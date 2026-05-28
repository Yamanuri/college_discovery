'use client'
// src/app/colleges/page.tsx
import { useEffect, useState, useCallback } from 'react'
import { CollegeCard } from '@/components/college/CollegeCard'
import { College } from '@/types'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { saveCollege, unsaveCollege } from '@/lib/api'

const STATES = ['All States', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Rajasthan', 'Karnataka', 'West Bengal', 'Telangana']
const TYPES = ['All Types', 'Government', 'Private', 'Deemed']
const SORTS = [
  { value: 'ranking', label: 'Best Ranked' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'fees_asc', label: 'Fees: Low to High' },
  { value: 'fees_desc', label: 'Fees: High to Low' },
]

export default function CollegesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const [colleges, setColleges] = useState<College[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [state, setState] = useState('All States')
  const [type, setType] = useState('All Types')
  const [sortBy, setSortBy] = useState('ranking')
  const [maxFees, setMaxFees] = useState('')

  const limit = 9

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state !== 'All States') params.set('state', state)
    if (type !== 'All Types') params.set('type', type)
    if (sortBy) params.set('sortBy', sortBy)
    if (maxFees) params.set('maxFees', maxFees)
    params.set('page', String(page))
    params.set('limit', String(limit))

    try {
      const res = await fetch(`/api/colleges?${params}`)
      const data = await res.json()
      setColleges(data.data || [])
      setTotal(data.total || 0)
    } finally {
      setLoading(false)
    }
  }, [search, state, type, sortBy, maxFees, page])

  useEffect(() => { fetchColleges() }, [fetchColleges])

  // Load saved colleges
  useEffect(() => {
    if (!user) return
    fetch('/api/saved').then(r => r.json()).then(data => {
      setSavedIds(new Set(data.map((s: { collegeId: string }) => s.collegeId)))
    })
  }, [user])

  const handleSaveToggle = async (collegeId: string) => {
    if (!user) { router.push('/auth'); return }
    if (savedIds.has(collegeId)) {
      await unsaveCollege(collegeId)
      setSavedIds(prev => { const s = new Set(prev); s.delete(collegeId); return s })
    } else {
      await saveCollege(collegeId)
      setSavedIds(prev => {
        const next = new Set(prev)
        next.add(collegeId)
        return next
      })
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Colleges</h1>
        <p className="text-gray-500 mt-1">{total} colleges found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-4">
              <label className="label">Search</label>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="College name..."
                className="input text-sm"
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="label">State</label>
              <select value={state} onChange={e => { setState(e.target.value); setPage(1) }} className="input text-sm">
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="label">Type</label>
              <select value={type} onChange={e => { setType(e.target.value); setPage(1) }} className="input text-sm">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Max Fees */}
            <div className="mb-4">
              <label className="label">Max Annual Fees</label>
              <select value={maxFees} onChange={e => { setMaxFees(e.target.value); setPage(1) }} className="input text-sm">
                <option value="">Any</option>
                <option value="100000">Under ₹1L</option>
                <option value="300000">Under ₹3L</option>
                <option value="500000">Under ₹5L</option>
                <option value="1000000">Under ₹10L</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="label">Sort By</label>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }} className="input text-sm">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-44 skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No colleges found</h3>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map(college => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    showSaveButton
                    isSaved={savedIds.has(college.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-outline px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
