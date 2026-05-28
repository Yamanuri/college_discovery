// src/app/api/colleges/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const state = searchParams.get('state') || ''
    const type = searchParams.get('type') || ''
    const sortBy = searchParams.get('sortBy') || 'ranking'
    const maxFees = searchParams.get('maxFees')
    const minRating = searchParams.get('minRating')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '9')))
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.CollegeWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (state) where.state = { contains: state, mode: 'insensitive' }
    if (type) where.type = { contains: type, mode: 'insensitive' }
    if (maxFees) where.totalFees = { lte: parseInt(maxFees) }
    if (minRating) where.rating = { gte: parseFloat(minRating) }

    // Build orderBy
    let orderBy: Prisma.CollegeOrderByWithRelationInput = {}
    switch (sortBy) {
      case 'rating': orderBy = { rating: 'desc' }; break
      case 'fees_asc': orderBy = { totalFees: 'asc' }; break
      case 'fees_desc': orderBy = { totalFees: 'desc' }; break
      case 'name': orderBy = { name: 'asc' }; break
      default: orderBy = { ranking: 'asc' }
    }

    const [data, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          placements: { take: 1, orderBy: { year: 'desc' } },
        },
      }),
      prisma.college.count({ where }),
    ])

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('GET /api/colleges error:', err)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}
