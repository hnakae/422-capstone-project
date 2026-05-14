'use client'

import { useDashboard } from '@/context/dashboard'

export default function SettingsPage() {
  const { resources, updateThreshold, team } = useDashboard()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings & Thresholds</h2>
          <div className="page-sub">Set the floor at which the Triage Engine fires an alert</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Resource thresholds</div>
          <span className="muted" style={{ fontSize: 11.5 }}>Auto-saves</span>
        </div>
        <div className="card-body flush">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Current stock</th>
                <th style={{ width: 300 }}>Threshold</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{r.location}</div>
                  </td>
                  <td className="mono">{r.kind === 'fund' ? '$' : ''}{r.stock.toLocaleString()}</td>
                  <td>
                    <div className="row gap-12">
                      <input type="range" min={0} max={r.capacity}
                        step={r.kind === 'fund' ? 100 : 5}
                        value={r.threshold}
                        onChange={e => updateThreshold(r.id, parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: 'var(--accent)' }} />
                      <span className="mono" style={{ width: 80, textAlign: 'right', fontSize: 12 }}>
                        {r.kind === 'fund' ? '$' : ''}{r.threshold.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="mono muted">
                    {r.kind === 'fund' ? '$' : ''}{r.capacity.toLocaleString()} {r.kind === 'fund' ? '' : r.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hr" />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Team</div>
            <button className="btn btn-sm">Invite</button>
          </div>
          <div className="card-body col gap-12">
            {team.map(u => (
              <div key={u.id} className="row">
                <div className="avatar">{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{u.role}</div>
                </div>
                <span className={`pill ${u.online ? 'ok' : ''}`}>
                  <span className="dot" style={{ background: u.online ? 'var(--accent-2)' : 'var(--mute-2)' }} />
                  {u.online ? 'Online' : 'Away'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Integrations</div></div>
          <div className="card-body col gap-12">
            {[
              { n: 'Supabase',         s: 'Connected · ds-production',  ok: true  },
              { n: 'Next.js API',      s: 'Healthy · Route Handlers',   ok: true  },
              { n: 'UO Single Sign-On',s: 'Pending verification',       ok: false },
              { n: 'Twilio (SMS)',     s: 'Disabled',                   ok: false },
            ].map((it, i) => (
              <div key={i} className="row" style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 8 }}>
                <span className="pill" style={{
                  background: it.ok ? 'var(--accent-50)' : 'var(--bg-2)',
                  color: it.ok ? 'var(--accent-ink)' : 'var(--mute)',
                  borderColor: it.ok ? 'var(--accent-100)' : 'var(--line)',
                }}>
                  <span className="dot" style={{ background: it.ok ? 'var(--accent-2)' : 'var(--mute-2)' }} />
                  {it.ok ? 'Live' : 'Off'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{it.n}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{it.s}</div>
                </div>
                <button className="btn btn-sm">Manage</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
