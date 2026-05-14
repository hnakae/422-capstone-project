import { NextResponse } from 'next/server'
import { getReferrals, addReferral } from '@/lib/db'
import type { Referral } from '@/lib/types'

export async function GET() {
  const referrals = await getReferrals()
  return NextResponse.json(referrals)
}

export async function POST(request: Request) {
  const referral: Referral = await request.json()
  await addReferral(referral)
  return NextResponse.json(referral, { status: 201 })
}
