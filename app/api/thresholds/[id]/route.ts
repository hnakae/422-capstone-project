import { NextResponse } from 'next/server'
import { updateThreshold } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { threshold } = await request.json()
  await updateThreshold(id, threshold)
  return NextResponse.json({ ok: true })
}
