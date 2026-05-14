'use client'

import Link from 'next/link'
import { useDashboard } from '@/context/dashboard'
import { Icons } from '@/components/icons'
import { relTime } from '@/lib/utils'
import type { Severity } from '@/lib/types'

const sevIcon: Record<Severity, React.ReactNode> = {
  crit: <Icons.Warn size={14} />,
  warn: <Icons.Warn size={14} />,
  info: <Icons.Info size={14} />,
}

export default function AlertsPage() {
  const { alerts, resources, dismissAlert } = useDashboard()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Alerts</h2>
          <div className="page-sub">{alerts.length} active · threshold + system events</div>
        </div>
        <div className="row gap-12">
          <Link href="/settings" className="btn">
            <Icons.Settings size={14} />Edit thresholds
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Severity</th>
                <th>Message</th>
                <th>Resource</th>
                <th style={{ width: 120 }}>When</th>
                <th style={{ width: 180 }}></th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--mute)' }}>
                    No active alerts. Everything is in range.
                  </td>
                </tr>
              )}
              {alerts.map(a => {
                const res = resources.find(r => r.id === a.resource)
                return (
                  <tr key={a.id}>
                    <td>
                      <span className={`pill ${a.sev}`}>
                        {sevIcon[a.sev]}{a.sev.toUpperCase()}
                      </span>
                    </td>
                    <td>{a.msg}</td>
                    <td className="muted">{res?.name || '—'}</td>
                    <td className="muted">{relTime(a.t)}</td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <button className="btn btn-sm" onClick={() => dismissAlert(a.id)}>Acknowledge</button>
                        <button className="btn btn-sm btn-ghost">Snooze 1h</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hr" />

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Alert routing</div>
            <div className="card-sub">Where notifications get sent</div>
          </div>
        </div>
        <div className="card-body grid-3">
          {[
            { name: 'In-app banner',  on: true,  sub: 'All severities' },
            { name: 'Email digest',   on: true,  sub: 'Every 30 min · managers only' },
            { name: 'SMS (Twilio)',   on: false, sub: 'Critical only · on-call rotation' },
          ].map((r, i) => (
            <div key={i} className="row" style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 8, gap: 10 }}>
              <div style={{
                width: 28, height: 16, background: r.on ? 'var(--accent)' : 'var(--bg-2)',
                borderRadius: 999, position: 'relative', border: '1px solid var(--line)', flexShrink: 0,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 1, left: r.on ? 13 : 1,
                  transition: 'left 160ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
