import { NextResponse } from 'next/server'
import { getResources } from '@/lib/db'

export async function GET() {
  const resources = await getResources()
  return NextResponse.json(resources)
}
