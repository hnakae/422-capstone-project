import { NextResponse } from 'next/server'
import { dismissAlert } from '@/lib/db'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await dismissAlert(id)
  return NextResponse.json({ ok: true })
}
