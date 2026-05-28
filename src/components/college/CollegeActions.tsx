'use client'
// src/components/college/CollegeActions.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveCollege, unsaveCollege } from '@/lib/api'

interface Props {
  collegeId: string
  collegeSlug: string
  isLoggedIn: boolean
  isSaved: boolean
}

export function CollegeActions({ collegeId, collegeSlug, isLoggedIn, isSaved: initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const router = useRouter()

  const handleSave = async () => {
    if (!isLoggedIn) { router.push('/auth'); return }
    if (saved) {
      await unsaveCollege(collegeId)
      setSaved(false)
    } else {
      await saveCollege(collegeId)
      setSaved(true)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
          saved
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
        }`}
      >
        {saved ? '♥ Saved' : '♡ Save'}
      </button>
    </div>
  )
}
