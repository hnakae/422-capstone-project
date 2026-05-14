export type Kind = 'physical' | 'fund'
export type Urgency = 'high' | 'med' | 'low'
export type Stage = 'intake' | 'verified' | 'matched' | 'acquired' | 'closed'
export type Severity = 'crit' | 'warn' | 'info'
export type Role = 'navigator' | 'manager'

export interface Resource {
  id: string
  name: string
  kind: Kind
  unit: string
  stock: number
  capacity: number
  threshold: number
  location: string
  trendDelta: number
}

export interface StageInfo {
  id: Stage
  label: string
  hint: string
}

export interface Referral {
  id: string
  student: string
  pronouns: string
  program: string
  need: string
  stage: Stage
  urgency: Urgency
  opened: string
  resources: string[]
  navigator: string
  notes: string
}

export interface Alert {
  id: string
  sev: Severity
  resource: string
  msg: string
  t: string
}

export interface ActivityItem {
  id: string
  t: string
  who: string
  what: string
  target: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  initials: string
  online: boolean
}

export interface DemandPoint {
  day: string
  food: number
  housing: number
  fund: number
  hygiene: number
}

export interface Toast {
  id: string
  msg: string
}
