// src/app/api/predictor/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cutoff logic per exam type
// Returns { high, medium, low } rank thresholds for each college type
function getCutoffs(exam: string, collegeType: string) {
  const cutoffs: Record<string, Record<string, { high: number; medium: number; low: number }>> = {
    'JEE Advanced': {
      Government: { high: 1000, medium: 3000, low: 8000 },
      Deemed: { high: 5000, medium: 15000, low: 30000 },
      Private: { high: 10000, medium: 30000, low: 60000 },
    },
    'JEE Mains': {
      Government: { high: 5000, medium: 20000, low: 50000 },
      Deemed: { high: 20000, medium: 60000, low: 120000 },
      Private: { high: 30000, medium: 80000, low: 150000 },
    },
    BITSAT: {
      Deemed: { high: 370, medium: 330, low: 290 },
      Government: { high: 380, medium: 350, low: 310 },
      Private: { high: 320, medium: 280, low: 250 },
    },
    VITEEE: {
      Deemed: { high: 1000, medium: 5000, low: 20000 },
      Private: { high: 5000, medium: 15000, low: 50000 },
      Government: { high: 500, medium: 2000, low: 10000 },
    },
    MET: {
      Deemed: { high: 1000, medium: 5000, low: 15000 },
      Private: { high: 3000, medium: 10000, low: 25000 },
      Government: { high: 500, medium: 2000, low: 8000 },
    },
  }
  return cutoffs[exam]?.[collegeType] || { high: 1000, medium: 5000, low: 15000 }
}

function rankIsBetterThan(rank: number, threshold: number, exam: string): boolean {
  // For score-based exams (BITSAT), higher is better
  const scoreExams = ['BITSAT']
  if (scoreExams.includes(exam)) return rank >= threshold
  return rank <= threshold
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const exam = searchParams.get('exam') || 'JEE Mains'
    const rankStr = searchParams.get('rank') || ''
    const rank = parseInt(rankStr)

    if (!rank || isNaN(rank) || rank <= 0) {
      return NextResponse.json({ error: 'Invalid rank/score' }, { status: 400 })
    }

    const colleges = await prisma.college.findMany({
      include: {
        courses: true,
        placements: { take: 1, orderBy: { year: 'desc' } },
      },
      orderBy: { ranking: 'asc' },
    })

    const results = []

    for (const college of colleges) {
      const cutoffs = getCutoffs(exam, college.type)

      let probability: 'High' | 'Medium' | 'Low' | null = null
      if (rankIsBetterThan(rank, cutoffs.high, exam)) {
        probability = 'High'
      } else if (rankIsBetterThan(rank, cutoffs.medium, exam)) {
        probability = 'Medium'
      } else if (rankIsBetterThan(rank, cutoffs.low, exam)) {
        probability = 'Low'
      }

      if (!probability) continue

      // Pick best matching course
      const course = college.courses[0]
      if (!course) continue

      results.push({ college, course, probability })
    }

    // Sort: High > Medium > Low, then by ranking
    const order = { High: 0, Medium: 1, Low: 2 }
    results.sort((a, b) => order[a.probability] - order[b.probability])

    return NextResponse.json(results.slice(0, 15))
  } catch (err) {
    console.error('GET /api/predictor error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
