'use client'

import { useState } from 'react'
import { useDashboard } from '@/context/dashboard'
import { Icons } from '@/components/icons'

export function IntakeModal() {
  const { resources, addReferral, addToast, setShowIntake } = useDashboard()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', pronouns: '', program: '', need: '', urgency: 'med' as 'high' | 'med' | 'low',
    resources: [] as string[], notes: '',
  })
  const [err, setErr] = useState<Record<string, string>>({})

  const update = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }))
  const toggleRes = (id: string) => setForm(f => ({
    ...f,
    resources: f.resources.includes(id) ? f.resources.filter(x => x !== id) : [...f.resources, id],
  }))
  const close = () => setShowIntake(false)

  const validate1 = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = 'Name required'
    if (!form.program.trim()) e.program = 'Program required'
    setErr(e); return Object.keys(e).length === 0
  }
  const validate2 = () => {
    const e: Record<string, string> = {}
    if (!form.need.trim()) e.need = 'Describe the need'
    setErr(e); return Object.keys(e).length === 0
  }

  const submit = () => {
    if (form.resources.length === 0) { setErr({ resources: 'Select at least one resource' }); return }
    addReferral({
      student: form.name, pronouns: form.pronouns || '—', program: form.program,
      need: form.need, stage: 'intake', urgency: form.urgency,
      opened: new Date().toISOString(), resources: form.resources,
      navigator: 'You', notes: form.notes,
    })
    addToast(`Intake logged for ${form.name}`)
    close()
  }

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-title">New Intake</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Step {step} of 3 · {['Student', 'Need', 'Resources'][step - 1]}
            </div>
          </div>
          <button className="icon-btn" onClick={close}><Icons.X size={14} /></button>
        </div>

        <div className="modal-body">
          <div className="row gap-8" style={{ marginBottom: 18 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 999,
                background: s <= step ? 'var(--accent)' : 'var(--bg-2)',
                transition: 'background 200ms',
              }} />
            ))}
          </div>

          {step === 1 && (
            <div className="col gap-12">
              <div className="grid-2">
                <div className="field">
                  <label>Student name</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Alex Chen" />
                  {err.name && <span className="err">{err.name}</span>}
                </div>
                <div className="field">
                  <label>Pronouns</label>
                  <input value={form.pronouns} onChange={e => update('pronouns', e.target.value)} placeholder="they/them" />
                </div>
              </div>
              <div className="field">
                <label>Program / college / standing</label>
                <input value={form.program} onChange={e => update('program', e.target.value)} placeholder="e.g. Junior, SOJC" />
                {err.program && <span className="err">{err.program}</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col gap-12">
              <div className="field">
                <label>What is the student asking for?</label>
                <textarea rows={3} value={form.need} onChange={e => update('need', e.target.value)}
                  placeholder="Short description of the immediate need…" />
                {err.need && <span className="err">{err.need}</span>}
              </div>
              <div className="field">
                <label>Urgency</label>
                <div className="chip-row">
                  {[
                    { v: 'high' as const, l: 'High — same-day' },
                    { v: 'med'  as const, l: 'Medium — this week' },
                    { v: 'low'  as const, l: 'Low — flexible' },
                  ].map(o => (
                    <button key={o.v} className={`chip ${form.urgency === o.v ? 'on' : ''}`}
                      onClick={() => update('urgency', o.v)}>{o.l}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Navigator notes (optional)</label>
                <textarea rows={2} value={form.notes} onChange={e => update('notes', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="col gap-12">
              <div className="field">
                <label>Match resources</label>
                <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                  Low-stock items are flagged in red.
                </div>
                <div className="col gap-8">
                  {resources.map(r => {
                    const checked = form.resources.includes(r.id)
                    const low = r.stock < r.threshold
                    return (
                      <label key={r.id} className="row" style={{
                        padding: 10,
                        border: `1px solid ${checked ? 'var(--accent-2)' : 'var(--line)'}`,
                        background: checked ? 'var(--accent-50)' : 'var(--surface)',
                        borderRadius: 8, cursor: 'pointer', gap: 10,
                      }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleRes(r.id)}
                          style={{ accentColor: 'var(--accent)' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                          <div className="muted" style={{ fontSize: 11.5 }}>
                            {r.kind === 'fund' ? '$' : ''}{r.stock.toLocaleString()} {r.kind === 'fund' ? '' : r.unit} · {r.location}
                          </div>
                        </div>
                        {low && <span className="pill crit"><span className="dot" />Low</span>}
                      </label>
                    )
                  })}
                </div>
                {err.resources && <span className="err">{err.resources}</span>}
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step > 1 && <button className="btn" onClick={() => setStep(step - 1)}>Back</button>}
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={close}>Cancel</button>
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => {
              if (step === 1 && !validate1()) return
              if (step === 2 && !validate2()) return
              setStep(step + 1)
            }}>Continue</button>
          ) : (
            <button className="btn btn-primary" onClick={submit}>
              <Icons.Check size={13} />Log intake
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
