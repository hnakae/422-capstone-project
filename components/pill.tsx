'use client'

import type { Stage, Urgency, Severity } from '@/lib/types'
import { STAGES } from '@/lib/seed'

export function Pill({ tone, children }: { tone?: string; children: React.ReactNode }) {
  return <span className={`pill ${tone || ''}`}>{children}</span>
}

export function UrgencyPill({ urgency }: { urgency: Urgency }) {
  if (urgency === 'high') return <span className="pill crit"><span className="dot"/>High</span>
  if (urgency === 'med')  return <span className="pill warn"><span className="dot"/>Med</span>
  return <span className="pill"><span className="dot" style={{ color: 'var(--mute-2)' }}/>Low</span>
}

export function StagePill({ stage }: { stage: Stage }) {
  const idx = STAGES.findIndex(s => s.id === stage)
  const label = STAGES[idx]?.label || stage
  const tone = (['', 'info', 'info', 'ok', 'ok'] as const)[idx] || ''
  return <span className={`pill ${tone}`}>{label}</span>
}

export function SevPill({ sev }: { sev: Severity }) {
  const tone: Record<Severity, string> = { crit: 'crit', warn: 'warn', info: 'info' }
  return <span className={`pill ${tone[sev]}`}>{sev.toUpperCase()}</span>
}
