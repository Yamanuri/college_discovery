// src/app/api/saved/[collegeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { collegeId: string } }
) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: { userId: user.userId, collegeId: params.collegeId },
      },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    // If record doesn't exist, that's fine
    return NextResponse.json({ success: true })
  }
}
