'use client'

import { useState } from 'react'
import { useDashboard } from '@/context/dashboard'
import { Icons } from '@/components/icons'

export function DonationModal() {
  const { resources, adjustResource, addToast, setShowDonation } = useDashboard()
  const [resId, setResId] = useState(resources.find(r => r.kind === 'physical')?.id || resources[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState('')
  const close = () => setShowDonation(false)

  const r = resources.find(x => x.id === resId)

  const submit = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0 || !r) return
    adjustResource(resId, n)
    addToast(`Logged donation: +${r.kind === 'fund' ? '$' : ''}${n.toLocaleString()} to ${r.name}`)
    close()
  }

  if (!r) return null

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal" style={{ width: 480 }}>
        <div className="modal-head">
          <div className="modal-title">Log Donation</div>
          <button className="icon-btn" onClick={close}><Icons.X size={14} /></button>
        </div>
        <div className="modal-body col gap-12">
          <div className="field">
            <label>Resource</label>
            <select value={resId} onChange={e => setResId(e.target.value)}>
              {resources.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Amount ({r.kind === 'fund' ? 'USD' : r.unit})</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder={r.kind === 'fund' ? '1000' : '45'} />
          </div>
          <div className="field">
            <label>Source (optional)</label>
            <input value={source} onChange={e => setSource(e.target.value)}
              placeholder="e.g. Eugene Rotary Club, Trader Joe's" />
          </div>
          <div style={{ padding: 10, background: 'var(--bg-2)', borderRadius: 8, fontSize: 12, color: 'var(--mute)' }}>
            New balance will be{' '}
            <b className="mono" style={{ color: 'var(--ink)' }}>
              {r.kind === 'fund' ? '$' : ''}{(r.stock + (parseFloat(amount) || 0)).toLocaleString()}
            </b>{' '}
            of {r.kind === 'fund' ? '$' : ''}{r.capacity.toLocaleString()}{r.kind === 'fund' ? '' : ' ' + r.unit}.
          </div>
        </div>
        <div className="modal-foot">
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>
            <Icons.Check size={13} />Log donation
          </button>
        </div>
      </div>
    </div>
  )
}
