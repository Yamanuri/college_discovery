// src/app/api/colleges/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: params.slug },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }

    return NextResponse.json(college)
  } catch (err) {
    console.error('GET /api/colleges/[slug] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
