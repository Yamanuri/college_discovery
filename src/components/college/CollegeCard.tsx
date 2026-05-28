// src/components/college/CollegeCard.tsx
import Link from 'next/link'
import { College } from '@/types'
import { formatFees } from '@/lib/utils'

interface Props {
  college: College & { placements?: Array<{ avgPackage: number; placementRate: number }> }
  showSaveButton?: boolean
  isSaved?: boolean
  onSaveToggle?: (id: string) => void
}

export function CollegeCard({ college, showSaveButton, isSaved, onSaveToggle }: Props) {
  const placement = college.placements?.[0]

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎓</div>
        )}
        {/* Ranking badge */}
        {college.ranking && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            #{college.ranking} India
          </div>
        )}
        {/* Save button */}
        {showSaveButton && onSaveToggle && (
          <button
            onClick={() => onSaveToggle(college.id)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isSaved ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50'
            }`}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        )}
        {/* Type badge */}
        <div className={`absolute bottom-3 left-3 badge text-xs font-semibold ${
          college.type === 'Government'
            ? 'bg-green-100 text-green-700'
            : college.type === 'Deemed'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {college.type}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
          {college.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
          <span>📍</span> {college.location}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="font-semibold text-gray-900 text-sm">{college.rating.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">({college.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-0.5">Annual Fees</div>
            <div className="font-bold text-primary-600 text-sm">{formatFees(college.totalFees)}</div>
          </div>
          {placement && (
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500 mb-0.5">Avg Package</div>
              <div className="font-bold text-green-600 text-sm">
                ₹{(placement.avgPackage / 100000).toFixed(1)}L
              </div>
            </div>
          )}
        </div>

        <Link
          href={`/colleges/${college.slug}`}
          className="block w-full text-center btn-primary text-sm py-2.5"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
