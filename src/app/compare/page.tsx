'use client'
// src/app/compare/page.tsx
import { useEffect, useState } from 'react'
import { College } from '@/types'
import { formatFees } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

function formatPackage(amt: number) {
  return `₹${(amt / 100000).toFixed(1)}L`
}

const COMPARE_FIELDS: Array<{
  label: string
  key: keyof College
  format?: (value: unknown) => string
}> = [
  { label: 'Type', key: 'type' },
  { label: 'Location', key: 'location' },
  { label: 'Established', key: 'established' },
  { label: 'Annual Fees', key: 'totalFees', format: (v) => formatFees(Number(v)) },
  { label: 'NIRF Ranking', key: 'ranking', format: (v) => v ? `#${v}` : 'N/A' },
  { label: 'Rating', key: 'rating', format: (v) => `${Number(v).toFixed(1)} / 5` },
  { label: 'Accreditation', key: 'accreditation', format: (v) => v ? String(v) : 'N/A' },
]

interface SavedComparison {
  id: string
  label: string
  collegeA: College
  collegeB: College
  collegeC: College | null
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [allColleges, setAllColleges] = useState<College[]>([])
  const [selected, setSelected] = useState<(College | null)[]>([null, null, null])
  const [search, setSearch] = useState(['', '', ''])
  const [results, setResults] = useState<College[][]>([[], [], []])
  const [saveLabel, setSaveLabel] = useState('')
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([])
  const [saveMessage, setSaveMessage] = useState('')

  const initialSlug = searchParams.get('colleges')

  useEffect(() => {
    fetch('/api/colleges?limit=100').then(r => r.json()).then(d => {
      setAllColleges(d.data || [])
      if (initialSlug) {
        const found = (d.data || []).find((c: College) => c.slug === initialSlug)
        if (found) {
          setSelected(prev => { const n = [...prev]; n[0] = found; return n })
        }
      }
    })
  }, [initialSlug])

  useEffect(() => {
    if (!user) {
      setSavedComparisons([])
      return
    }
    fetch('/api/comparisons')
      .then(r => (r.ok ? r.json() : []))
      .then(data => setSavedComparisons(Array.isArray(data) ? data : []))
      .catch(() => setSavedComparisons([]))
  }, [user])

  const handleSearch = (i: number, q: string) => {
    const s = [...search]; s[i] = q; setSearch(s)
    const filtered = allColleges.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) && !selected.find(sel => sel?.id === c.id)
    ).slice(0, 5)
    const r = [...results]; r[i] = filtered; setResults(r)
  }

  const selectCollege = (i: number, college: College) => {
    const s = [...selected]; s[i] = college; setSelected(s)
    const sq = [...search]; sq[i] = ''; setSearch(sq)
    const r = [...results]; r[i] = []; setResults(r)
  }

  const removeCollege = (i: number) => {
    const s = [...selected]; s[i] = null; setSelected(s)
  }

  const hasAny = selected.some(Boolean)
  const selectedCount = selected.filter(Boolean).length

  const saveCurrentComparison = async () => {
    if (!user) {
      setSaveMessage('Please login to save comparisons.')
      return
    }

    const [a, b, c] = selected
    if (!a || !b) {
      setSaveMessage('Select at least 2 colleges to save a comparison.')
      return
    }

    const label = saveLabel.trim() || `${a.name} vs ${b.name}${c ? ` vs ${c.name}` : ''}`
    const payload = {
      label,
      collegeAId: a.id,
      collegeBId: b.id,
      ...(c ? { collegeCId: c.id } : {}),
    }

    const res = await fetch('/api/comparisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setSaveMessage(data?.error || 'Could not save comparison.')
      return
    }

    setSaveMessage('Comparison saved.')
    setSaveLabel('')
    const listRes = await fetch('/api/comparisons')
    if (listRes.ok) {
      const listData = await listRes.json()
      setSavedComparisons(Array.isArray(listData) ? listData : [])
    }
  }

  const loadComparison = (item: SavedComparison) => {
    const picks = [item.collegeA, item.collegeB, item.collegeC || null]
    setSelected(picks)
    setSearch(['', '', ''])
    setResults([[], [], []])
    setSaveMessage(`Loaded "${item.label}"`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
        <p className="text-gray-500 mt-1">Select up to 3 colleges to compare side by side</p>
      </div>

      {user && savedComparisons.length > 0 && (
        <div className="card p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Saved comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {savedComparisons.map((item) => (
              <button
                key={item.id}
                onClick={() => loadComparison(item)}
                className="btn-outline text-xs py-1.5"
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* College selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[0, 1, 2].map(i => (
          <div key={i} className="relative">
            {selected[i] ? (
              <div className="card p-4 border-2 border-primary-200">
                {selected[i]!.imageUrl && (
                  <img src={selected[i]!.imageUrl!} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <h3 className="font-bold text-gray-900 text-sm">{selected[i]!.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{selected[i]!.location}</p>
                <button
                  onClick={() => removeCollege(i)}
                  className="mt-3 text-xs text-red-500 hover:text-red-700"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="card p-4 border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-400 mb-3">
                  <div className="text-3xl">＋</div>
                  <div className="text-sm">Add College {i + 1}</div>
                </div>
                <input
                  type="text"
                  placeholder="Search college..."
                  value={search[i]}
                  onChange={e => handleSearch(i, e.target.value)}
                  className="input text-sm"
                />
                {results[i].length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 w-full overflow-hidden">
                    {results[i].map(c => (
                      <li
                        key={c.id}
                        onClick={() => selectCollege(i, c)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0"
                      >
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.location}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      {hasAny && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-gray-500 font-medium text-sm w-1/4">Feature</th>
                {selected.map((col, i) => (
                  <th key={i} className="p-4 text-center">
                    {col ? (
                      <Link href={`/colleges/${col.slug}`} className="font-semibold text-gray-900 text-sm hover:text-primary-600">
                        {col.name}
                      </Link>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_FIELDS.map(field => (
                <tr key={field.key} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-600">{field.label}</td>
                  {selected.map((col, i) => {
                    const val = col ? col[field.key] : null
                    return (
                      <td key={i} className="p-4 text-center text-sm text-gray-800">
                        {col ? (field.format ? field.format(val) : String(val ?? 'N/A')) : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Placements row */}
              <tr className="border-b border-gray-50 bg-green-50">
                <td className="p-4 text-sm font-medium text-gray-600">Avg Package</td>
                {selected.map((col, i) => {
                  const p = col?.placements?.[0]
                  return (
                    <td key={i} className="p-4 text-center text-sm font-semibold text-green-600">
                      {p ? formatPackage(p.avgPackage) : '—'}
                    </td>
                  )
                })}
              </tr>
              <tr className="border-b border-gray-50 bg-blue-50">
                <td className="p-4 text-sm font-medium text-gray-600">Placement %</td>
                {selected.map((col, i) => {
                  const p = col?.placements?.[0]
                  return (
                    <td key={i} className="p-4 text-center text-sm font-semibold text-blue-600">
                      {p ? `${p.placementRate}%` : '—'}
                    </td>
                  )
                })}
              </tr>

              {/* CTA row */}
              <tr>
                <td className="p-4" />
                {selected.map((col, i) => (
                  <td key={i} className="p-4 text-center">
                    {col && (
                      <Link href={`/colleges/${col.slug}`} className="btn-primary text-sm py-2 px-4 inline-block">
                        View Details
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="border-t border-gray-100 p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1 flex flex-col md:flex-row gap-3 md:items-center">
              <input
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder="Optional label (e.g. IITs shortlist)"
                className="input md:max-w-sm text-sm"
                disabled={selectedCount < 2}
              />
              <button
                onClick={saveCurrentComparison}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                disabled={selectedCount < 2}
              >
                Save this comparison
              </button>
            </div>
            {saveMessage && (
              <p className="text-xs text-gray-500">{saveMessage}</p>
            )}
          </div>
        </div>
      )}

      {!hasAny && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">⚖️</div>
          <p className="text-lg">Select colleges above to start comparing</p>
        </div>
      )}
    </div>
  )
}
