'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Resource, Referral, Alert, ActivityItem, Role, Stage, Toast } from '@/lib/types'
import { STAGES, DEMAND_SERIES, TEAM, ACTIVITY as SEED_ACTIVITY } from '@/lib/seed'

interface DashboardCtx {
  resources: Resource[]
  referrals: Referral[]
  alerts: Alert[]
  activity: ActivityItem[]
  loading: boolean

  role: Role
  setRole: (r: Role) => void
  drawerId: string | null
  openReferral: (id: string) => void
  closeDrawer: () => void
  showIntake: boolean
  setShowIntake: (v: boolean) => void
  showDonation: boolean
  setShowDonation: (v: boolean) => void
  toasts: Toast[]
  addToast: (msg: string) => void

  adjustResource: (id: string, delta: number) => Promise<void>
  updateThreshold: (id: string, threshold: number) => Promise<void>
  addReferral: (data: Omit<Referral, 'id'>) => Promise<void>
  moveReferral: (id: string, stage: Stage) => Promise<void>
  dismissAlert: (id: string) => Promise<void>

  stages: typeof STAGES
  demandSeries: typeof DEMAND_SERIES
  team: typeof TEAM
}

const Ctx = createContext<DashboardCtx | null>(null)

export function useDashboard() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activity] = useState<ActivityItem[]>(SEED_ACTIVITY)
  const [loading, setLoading] = useState(true)
  const [role, setRoleState] = useState<Role>('navigator')
  const [drawerId, setDrawerId] = useState<string | null>(null)
  const [showIntake, setShowIntake] = useState(false)
  const [showDonation, setShowDonation] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('ds-role') as Role | null
    if (saved === 'navigator' || saved === 'manager') setRoleState(saved)
  }, [])

  const setRole = useCallback((r: Role) => {
    setRoleState(r)
    localStorage.setItem('ds-role', r)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/resources').then(r => r.json()),
      fetch('/api/referrals').then(r => r.json()),
      fetch('/api/alerts').then(r => r.json()),
    ]).then(([res, ref, al]) => {
      setResources(res)
      setReferrals(ref)
      setAlerts(al)
    }).finally(() => setLoading(false))
  }, [])

  const addToast = useCallback((msg: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  const openReferral = useCallback((id: string) => setDrawerId(id), [])
  const closeDrawer  = useCallback(() => setDrawerId(null), [])

  const adjustResource = useCallback(async (id: string, delta: number) => {
    const res = await fetch(`/api/resources/${id}/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    })
    const { resource, newAlerts } = await res.json()
    setResources(prev => prev.map(r => r.id === id ? resource : r))
    if (newAlerts?.length) setAlerts(prev => [...newAlerts, ...prev])
  }, [])

  const updateThreshold = useCallback(async (id: string, threshold: number) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, threshold } : r))
    await fetch(`/api/thresholds/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threshold }),
    })
  }, [])

  const addReferral = useCallback(async (data: Omit<Referral, 'id'>) => {
    const id = `DS-${2842 + Math.floor(Math.random() * 30)}`
    const referral: Referral = { ...data, id }
    setReferrals(prev => [referral, ...prev])
    await fetch('/api/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(referral),
    })
  }, [])

  const moveReferral = useCallback(async (id: string, stage: Stage) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, stage } : r))
    await fetch(`/api/referrals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }, [])

  const dismissAlert = useCallback(async (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
    await fetch(`/api/alerts/${id}/dismiss`, { method: 'POST' })
  }, [])

  return (
    <Ctx.Provider value={{
      resources, referrals, alerts, activity, loading,
      role, setRole, drawerId, openReferral, closeDrawer,
      showIntake, setShowIntake, showDonation, setShowDonation,
      toasts, addToast,
      adjustResource, updateThreshold, addReferral, moveReferral, dismissAlert,
      stages: STAGES, demandSeries: DEMAND_SERIES, team: TEAM,
    }}>
      {children}
    </Ctx.Provider>
  )
}
