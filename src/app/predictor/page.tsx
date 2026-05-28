'use client'
// src/app/predictor/page.tsx
import { useState } from 'react'
import { College } from '@/types'
import Link from 'next/link'
import { formatFees } from '@/lib/utils'

const EXAMS = ['JEE Advanced', 'JEE Mains', 'BITSAT', 'VITEEE', 'MET']

interface PredictResult {
  college: College
  course: { name: string; eligibility: string; fees: number }
  probability: 'High' | 'Medium' | 'Low'
}

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Advanced')
  const [rank, setRank] = useState('')
  const [results, setResults] = useState<PredictResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const predict = async () => {
    if (!rank) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/predictor?exam=${exam}&rank=${rank}`)
      const data = await res.json()
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  const probColors = {
    High: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 page-enter">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">College Predictor</h1>
        <p className="text-gray-500">Enter your exam and rank to see which colleges you can get into</p>
      </div>

      {/* Input card */}
      <div className="card p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="label">Entrance Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)} className="input">
              {EXAMS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Your Rank / Score</label>
            <input
              type="number"
              placeholder={exam === 'VITEEE' ? 'e.g. 1500 (score)' : 'e.g. 5000 (rank)'}
              value={rank}
              onChange={e => setRank(e.target.value)}
              className="input"
              min="1"
            />
          </div>
          <button
            onClick={predict}
            disabled={!rank || loading}
            className="btn-primary h-[46px] disabled:opacity-50"
          >
            {loading ? '⏳ Predicting...' : '🔍 Predict Colleges'}
          </button>
        </div>

        <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-600">
          ℹ️ Predictions are based on historical cutoff data. Actual cutoffs may vary by category, year, and seat availability.
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="skeleton w-20 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
                <div className="skeleton h-8 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
          <p className="text-gray-500">Try a different rank or exam. Consider exploring all colleges.</p>
          <Link href="/colleges" className="btn-primary inline-block mt-4">Browse All Colleges</Link>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{results.length} College Matches</h2>
            <div className="flex gap-2 text-xs">
              <span className="badge bg-green-100 text-green-700">High chance</span>
              <span className="badge bg-yellow-100 text-yellow-700">Medium chance</span>
              <span className="badge bg-red-100 text-red-700">Low chance</span>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, i) => (
              <div key={i} className="card p-5 flex flex-col md:flex-row gap-4">
                {result.college.imageUrl && (
                  <img
                    src={result.college.imageUrl}
                    alt=""
                    className="w-full md:w-24 h-32 md:h-24 object-cover rounded-xl flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{result.college.name}</h3>
                      <p className="text-sm text-gray-500">📍 {result.college.location}</p>
                    </div>
                    <span className={`badge border text-xs font-semibold ${probColors[result.probability]}`}>
                      {result.probability} Chance
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-50 rounded-xl p-3">
                    <p className="text-sm font-medium text-gray-800">{result.course.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{result.course.eligibility}</p>
                    <p className="text-xs text-primary-600 font-semibold mt-1">{formatFees(result.course.fees)}/yr</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 md:justify-center">
                  <Link href={`/colleges/${result.college.slug}`} className="btn-primary text-sm text-center py-2 px-4">
                    View Details
                  </Link>
                  <Link href={`/compare?colleges=${result.college.slug}`} className="btn-outline text-sm text-center py-2 px-4">
                    Compare
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
