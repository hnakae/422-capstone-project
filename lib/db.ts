import type { Resource, Referral, Alert, ActivityItem } from './types'
import { RESOURCES, REFERRALS, ALERTS, ACTIVITY } from './seed'

// --- In-memory store (persists across HMR reloads via globalThis) ---
const g = globalThis as typeof globalThis & {
  dsStore?: {
    resources: Resource[]
    referrals: Referral[]
    alerts: Alert[]
    activity: ActivityItem[]
  }
}
if (!g.dsStore) {
  g.dsStore = {
    resources: JSON.parse(JSON.stringify(RESOURCES)),
    referrals: JSON.parse(JSON.stringify(REFERRALS)),
    alerts: JSON.parse(JSON.stringify(ALERTS)),
    activity: JSON.parse(JSON.stringify(ACTIVITY)),
  }
}
const mem = g.dsStore

// --- Postgres (optional, used when DATABASE_URL is set) ---
const g2 = globalThis as typeof globalThis & { dsSql?: unknown }

async function getSql() {
  if (!process.env.DATABASE_URL) return null
  if (!g2.dsSql) {
    const { default: postgres } = await import('postgres')
    g2.dsSql = postgres(process.env.DATABASE_URL, { max: 5, idle_timeout: 20 })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return g2.dsSql as any
}

// --- Resources ---

export async function getResources(): Promise<Resource[]> {
  const sql = await getSql()
  if (sql) {
    const rows = await sql`
      SELECT id, name, kind, unit, stock, capacity, threshold, location, trend_delta AS "trendDelta"
      FROM resources ORDER BY kind, name
    `
    return rows as Resource[]
  }
  return mem.resources
}

export async function adjustStock(id: string, delta: number): Promise<{ resource: Resource; newAlerts: Alert[] }> {
  const sql = await getSql()
  if (sql) {
    const [r] = await sql`
      UPDATE resources SET stock = GREATEST(0, stock + ${delta}) WHERE id = ${id}
      RETURNING id, name, kind, unit, stock, capacity, threshold, location, trend_delta AS "trendDelta"
    `
    const newAlerts: Alert[] = []
    if (r && r.stock < r.threshold) {
      const alertId = `al-${Date.now()}`
      const [a] = await sql`
        INSERT INTO alerts (id, severity, resource_id, message, created_at)
        VALUES (${alertId}, 'crit', ${id}, ${`${r.name} below threshold (${r.stock} / ${r.threshold} ${r.unit}).`}, NOW())
        RETURNING id, severity AS sev, resource_id AS resource, message AS msg, created_at AS t
      `
      newAlerts.push(a as Alert)
    }
    return { resource: r as Resource, newAlerts }
  }

  const r = mem.resources.find(x => x.id === id)
  if (!r) throw new Error('Resource not found')
  r.stock = Math.max(0, r.stock + delta)
  const newAlerts: Alert[] = []
  if (r.stock < r.threshold) {
    const alert: Alert = {
      id: `al-${Date.now()}`,
      sev: 'crit',
      resource: id,
      msg: `${r.name} below threshold (${r.stock} / ${r.threshold} ${r.unit}).`,
      t: new Date().toISOString(),
    }
    mem.alerts.unshift(alert)
    newAlerts.push(alert)
  }
  return { resource: r, newAlerts }
}

export async function updateThreshold(id: string, threshold: number): Promise<void> {
  const sql = await getSql()
  if (sql) {
    await sql`UPDATE resources SET threshold = ${threshold} WHERE id = ${id}`
    return
  }
  const r = mem.resources.find(x => x.id === id)
  if (r) r.threshold = threshold
}

// --- Referrals ---

export async function getReferrals(): Promise<Referral[]> {
  const sql = await getSql()
  if (sql) {
    const rows = await sql`
      SELECT r.id, r.student_name AS student, r.pronouns, r.program, r.need,
             r.stage, r.urgency, r.opened_at AS opened, r.notes,
             COALESCE(u.name, 'Unknown') AS navigator,
             ARRAY_AGG(rr.resource_id ORDER BY rr.resource_id) FILTER (WHERE rr.resource_id IS NOT NULL) AS resources
      FROM referrals r
      LEFT JOIN users u ON r.navigator_id = u.id
      LEFT JOIN referral_resources rr ON rr.referral_id = r.id
      GROUP BY r.id, u.name
      ORDER BY r.opened_at DESC
    `
    return rows as Referral[]
  }
  return mem.referrals
}

export async function addReferral(referral: Referral): Promise<void> {
  const sql = await getSql()
  if (sql) {
    await sql`
      INSERT INTO referrals (id, student_name, pronouns, program, need, stage, urgency, opened_at, notes)
      VALUES (${referral.id}, ${referral.student}, ${referral.pronouns}, ${referral.program},
              ${referral.need}, ${referral.stage}, ${referral.urgency}, NOW(), ${referral.notes})
    `
    for (const rid of referral.resources) {
      await sql`INSERT INTO referral_resources (referral_id, resource_id) VALUES (${referral.id}, ${rid})`
    }
    return
  }
  mem.referrals.unshift(referral)
}

export async function updateReferral(id: string, update: Partial<Referral>): Promise<void> {
  const sql = await getSql()
  if (sql) {
    if (update.stage) await sql`UPDATE referrals SET stage = ${update.stage} WHERE id = ${id}`
    if (update.notes !== undefined) await sql`UPDATE referrals SET notes = ${update.notes} WHERE id = ${id}`
    return
  }
  const idx = mem.referrals.findIndex(r => r.id === id)
  if (idx >= 0) mem.referrals[idx] = { ...mem.referrals[idx], ...update }
}

// --- Alerts ---

export async function getAlerts(): Promise<Alert[]> {
  const sql = await getSql()
  if (sql) {
    const rows = await sql`
      SELECT id, severity AS sev, resource_id AS resource, message AS msg, created_at AS t
      FROM alerts WHERE dismissed_at IS NULL ORDER BY created_at DESC
    `
    return rows as Alert[]
  }
  return mem.alerts
}

export async function dismissAlert(id: string): Promise<void> {
  const sql = await getSql()
  if (sql) {
    await sql`UPDATE alerts SET dismissed_at = NOW() WHERE id = ${id}`
    return
  }
  const idx = mem.alerts.findIndex(a => a.id === id)
  if (idx >= 0) mem.alerts.splice(idx, 1)
}
