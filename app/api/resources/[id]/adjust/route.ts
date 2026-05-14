import { NextResponse } from 'next/server'
import { adjustStock } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { delta } = await request.json()
  const result = await adjustStock(id, delta)
  return NextResponse.json(result)
}
