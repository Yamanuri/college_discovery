// src/app/api/saved/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.userId },
      include: {
        college: {
          include: { placements: { take: 1, orderBy: { year: 'desc' } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(saved)
  } catch (err) {
    console.error('GET /api/saved error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { collegeId } = await req.json()
    if (!collegeId) return NextResponse.json({ error: 'collegeId required' }, { status: 400 })

    // Check college exists
    const college = await prisma.college.findUnique({ where: { id: collegeId } })
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 })

    const saved = await prisma.savedCollege.upsert({
      where: { userId_collegeId: { userId: user.userId, collegeId } },
      update: {},
      create: { userId: user.userId, collegeId },
    })
    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    console.error('POST /api/saved error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
