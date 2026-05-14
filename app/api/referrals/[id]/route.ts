import { NextResponse } from 'next/server'
import { updateReferral } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const update = await request.json()
  await updateReferral(id, update)
  return NextResponse.json({ ok: true })
}
