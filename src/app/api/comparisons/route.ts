// src/app/api/comparisons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  label: z.string().min(1).max(100),
  collegeAId: z.string().cuid(),
  collegeBId: z.string().cuid(),
  collegeCId: z.string().cuid().optional(),
})

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: user.userId },
      include: {
        collegeA: true,
        collegeB: true,
        collegeC: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(comparisons)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const comparison = await prisma.savedComparison.create({
      data: { ...parsed.data, userId: user.userId },
    })
    return NextResponse.json(comparison, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
