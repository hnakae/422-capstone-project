'use client'

import { useDashboard } from '@/context/dashboard'
import { UrgencyPill, StagePill } from '@/components/pill'
import { InvBar } from '@/components/inv-bar'
import { Sparkline } from '@/components/charts'
import { Icons } from '@/components/icons'
import { relTime, sortByUrgency } from '@/lib/utils'
import { useState } from 'react'

export default function TiagePage() {
  const { referrals, resources, alerts, activity, stages, demandSeries, role, openReferral, setShowIntake } = useDashboard()
  const [filter, setFilter] = useState<'all' | 'mine' | 'high'>('all')

  const open    = referrals.filter(r => r.stage !== 'closed')
  const mine    = open.filter(r => r.navigator === 'You')
  const flagged = open.filter(r => r.urgency === 'high')
  const view    = filter === 'mine' ? mine : filter === 'high' ? flagged : open

  const resourcesById = Object.fromEntries(resources.map(r => [r.id, r]))
  const totalsDay     = demandSeries.map(d => d.food + d.housing + d.fund + d.hygiene)
  const housingTrend  = demandSeries.map(d => d.housing)
  const belowThreshold = resources.filter(r => r.stock < r.threshold).length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Good morning, {role === 'manager' ? 'Dr. Whitlow' : 'Noel'}.
          </h2>
          <div className="page-sub">
            {open.length} open referrals, {flagged.length} flagged as high urgency.
          </div>
        </div>
        <div className="row gap-12">
          <button className="btn"><Icons.Filter size={14} />Filter</button>
          <button className="btn"><Icons.Doc size={14} />Export shift report</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="Open Referrals" value={open.length} delta="+4 today" up
          spark={<Sparkline values={totalsDay} color="oklch(52% 0.13 155)" />} />
        <KPI label="In My Queue" value={mine.length}
          delta={`${mine.filter(r => r.urgency === 'high').length} high urgency`} />
        <KPI label="Resources Below Threshold" value={belowThreshold} delta="Action needed" down
          spark={<Sparkline values={[5, 6, 4, 5, 7, 8, 6]} color="var(--danger)" />} />
        <KPI label="Housing Fund Burn (7d)" value="$4,800" delta="−$1,800 since Mon" down
          spark={<Sparkline values={housingTrend.slice(-7)} color="oklch(58% 0.20 25)" />} />
      </div>

      <div className="grid-12-8">
        {/* Triage queue */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Live triage queue</div>
              <div className="card-sub">Sorted by urgency, then time opened</div>
            </div>
            <div className="chip-row">
              {(['all', 'mine', 'high'] as const).map(f => (
                <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? `All · ${open.length}` : f === 'mine' ? `Mine · ${mine.length}` : `High · ${flagged.length}`}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body flush">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>ID</th>
                  <th>Student</th>
                  <th>Need</th>
                  <th>Resources</th>
                  <th>Stage</th>
                  <th>Opened</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortByUrgency(view).map(r => (
                  <tr key={r.id} className="clickable" onClick={() => openReferral(r.id)}>
                    <td className="mono">{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.student}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>{r.program} · {r.pronouns}</div>
                    </td>
                    <td>{r.need}</td>
                    <td>
                      <div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>
                        {r.resources.slice(0, 2).map(rid => {
                          const res = resourcesById[rid]
                          if (!res) return null
                          const low = res.stock < res.threshold
                          return (
                            <span key={rid} className={`pill ${low ? 'crit' : ''}`} title={res.name}>
                              {low && <span className="dot" />}
                              {res.name.replace('Food Pantry — ', '').replace('Emergency ', '').replace(' Fund', '').slice(0, 18)}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                    <td><StagePill stage={r.stage} /></td>
                    <td className="muted">{relTime(r.opened)}</td>
                    <td><UrgencyPill urgency={r.urgency} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right rail */}
        <div className="col gap-16">
          <div className="card">
            <div className="card-head">
              <div className="card-title">Activity</div>
              <span className="muted" style={{ fontSize: 11.5 }}>Live</span>
            </div>
            <div className="card-body col gap-12">
              {activity.slice(0, 6).map(a => (
                <div key={a.id} className="row" style={{ alignItems: 'flex-start' }}>
                  <div className="avatar" style={{
                    background: a.who === 'System' ? 'oklch(95% 0.02 75)' : 'oklch(91% 0.03 155)',
                    color: a.who === 'System' ? 'var(--warn-ink)' : 'var(--accent-ink)',
                    width: 24, height: 24, fontSize: 10,
                  }}>
                    {a.who === 'System'
                      ? <Icons.Sparkles size={11} />
                      : a.who.split(' ').map(x => x[0]).join('').slice(0, 2)
                    }
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12.5 }}>
                      <b>{a.who}</b> <span className="muted">{a.what}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{a.target}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{relTime(a.t)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Resource pulse</div>
              <span className="muted" style={{ fontSize: 11.5 }}>Top of mind</span>
            </div>
            <div className="card-body col gap-10">
              {resources.slice(0, 4).map(r => (
                <div key={r.id}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5 }}>{r.name}</span>
                    <span className="mono" style={{ fontSize: 11.5 }}>
                      {r.kind === 'fund' ? '$' : ''}{r.stock.toLocaleString()} / {r.kind === 'fund' ? '$' : ''}{r.capacity.toLocaleString()}
                    </span>
                  </div>
                  <InvBar stock={r.stock} capacity={r.capacity} threshold={r.threshold} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPI({ label, value, delta, up, down, spark }: {
  label: string; value: string | number; delta: string
  up?: boolean; down?: boolean; spark?: React.ReactNode
}) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-delta ${up ? 'up' : ''} ${down ? 'down' : ''}`}>
        {up   && <Icons.ArrowUp size={11} />}
        {down && <Icons.ArrowDown size={11} />}
        {delta}
      </div>
      {spark && <div className="kpi-spark">{spark}</div>}
    </div>
  )
}
