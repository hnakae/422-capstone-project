'use client'

import { useDashboard } from '@/context/dashboard'
import { UrgencyPill, StagePill } from '@/components/pill'
import { Icons } from '@/components/icons'
import { relTime } from '@/lib/utils'

export function ReferralDrawer() {
  const { drawerId, closeDrawer, referrals, resources, stages, moveReferral } = useDashboard()
  const referral = referrals.find(r => r.id === drawerId)
  if (!referral) return null

  const r = referral
  const stageIdx = stages.findIndex(s => s.id === r.stage)
  const nextStage = stages[stageIdx + 1]

  return (
    <>
      <div className="drawer-scrim" onClick={closeDrawer} />
      <aside className="drawer">
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono muted">{r.id}</span>
          <UrgencyPill urgency={r.urgency} />
          <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={closeDrawer}>
            <Icons.X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <h3 style={{ margin: 0, fontSize: 20, letterSpacing: '-0.01em' }}>{r.student}</h3>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{r.program} · {r.pronouns}</div>

          <div className="hr" />

          <div className="col gap-12">
            <Detail label="Need"><span>{r.need}</span></Detail>
            <Detail label="Stage"><StagePill stage={r.stage} /></Detail>
            <Detail label="Assigned"><span>{r.navigator}</span></Detail>
            <Detail label="Opened"><span>{relTime(r.opened)}</span></Detail>
          </div>

          <div className="hr" />

          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mute)', marginBottom: 8, fontWeight: 600 }}>
            Matched Resources
          </div>
          <div className="col gap-8">
            {r.resources.map(rid => {
              const res = resources.find(x => x.id === rid)
              if (!res) return null
              const low = res.stock < res.threshold
              return (
                <div key={rid} className="row" style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{res.name}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {res.kind === 'fund' ? '$' : ''}{res.stock.toLocaleString()} {res.kind === 'fund' ? '' : res.unit} available
                    </div>
                  </div>
                  {low && <span className="pill crit"><span className="dot" />Low</span>}
                </div>
              )
            })}
          </div>

          {r.notes && (
            <>
              <div className="hr" />
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mute)', marginBottom: 8, fontWeight: 600 }}>
                Navigator notes
              </div>
              <div style={{ padding: 10, background: 'var(--bg-2)', borderRadius: 8, fontSize: 13 }}>{r.notes}</div>
            </>
          )}
        </div>

        <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, background: 'var(--bg-2)' }}>
          <button className="btn"><Icons.Phone size={13} />Contact</button>
          <button className="btn"><Icons.Doc size={13} />Add note</button>
          <span className="spacer" />
          {nextStage ? (
            <button className="btn btn-primary" onClick={() => { moveReferral(r.id, nextStage.id); closeDrawer() }}>
              Move to {nextStage.label} <Icons.ChevronR size={13} />
            </button>
          ) : (
            <span className="pill ok">Case closed</span>
          )}
        </div>
      </aside>
    </>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div style={{ width: 90, color: 'var(--mute)', fontSize: 12 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13 }}>{children}</div>
    </div>
  )
}
