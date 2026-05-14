'use client'

import { useDashboard } from '@/context/dashboard'
import { InvBar } from '@/components/inv-bar'
import { MiniBar } from '@/components/charts'
import { Icons } from '@/components/icons'
import type { Resource } from '@/lib/types'

export default function InventoryPage() {
  const { resources, adjustResource, setShowDonation } = useDashboard()

  const physical = resources.filter(r => r.kind === 'physical')
  const funds    = resources.filter(r => r.kind === 'fund')

  const barData  = physical.map(r => ({
    label: r.name.replace('Food Pantry — ', '').replace(' ', ' ').slice(0, 9),
    value: (r.stock / r.capacity) * 100,
    crit:  r.stock < r.threshold,
  }))
  const warnIdx = barData.findIndex(b => b.crit)

  const byLoc = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    ;(acc[r.location] = acc[r.location] || []).push(r)
    return acc
  }, {})

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Resource Inventory</h2>
          <div className="page-sub">Live across all dashboards</div>
        </div>
        <div className="row gap-12">
          <button className="btn"><Icons.Doc size={14} />Export CSV</button>
          <button className="btn btn-primary" onClick={() => setShowDonation(true)}>
            <Icons.Donate size={14} />Log donation
          </button>
        </div>
      </div>

      <div className="grid-12-8">
        <div className="col gap-16">
          {/* Physical */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Physical inventory</div>
                <div className="card-sub">{physical.length} categories · adjust counts inline</div>
              </div>
              <span className="pill ok"><span className="dot" />Synced</span>
            </div>
            <div className="card-body flush">
              <table className="table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th style={{ width: 240 }}>Stock</th>
                    <th style={{ width: 110 }}>Threshold</th>
                    <th style={{ width: 110 }}>7-day</th>
                    <th style={{ width: 160 }}>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {physical.map(r => <ResourceRow key={r.id} r={r} adjust={adjustResource} />)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Funds */}
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Emergency funds</div>
                <div className="card-sub">Care Team ledger · USD</div>
              </div>
            </div>
            <div className="card-body flush">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th style={{ width: 280 }}>Balance</th>
                    <th style={{ width: 110 }}>Threshold</th>
                    <th style={{ width: 110 }}>Burn (7d)</th>
                    <th style={{ width: 160 }}>Allocate</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map(r => <FundRow key={r.id} r={r} adjust={adjustResource} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col gap-16">
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Stock levels (% of capacity)</div>
                <div className="card-sub">Live · refreshes on every adjust</div>
              </div>
            </div>
            <div className="card-body">
              <MiniBar data={barData} h={180} warnIdx={warnIdx} />
              <div className="legend" style={{ marginTop: 10 }}>
                <span><span className="sw" style={{ background: 'var(--accent-2)' }} />Healthy</span>
                <span><span className="sw" style={{ background: 'var(--danger)' }} />Below threshold</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Locations</div>
              <span className="muted" style={{ fontSize: 11.5 }}>{Object.keys(byLoc).length} sites</span>
            </div>
            <div className="card-body col gap-12">
              {Object.entries(byLoc).map(([loc, items]) => (
                <div key={loc} className="row" style={{ alignItems: 'flex-start' }}>
                  <div className="avatar" style={{ background: 'var(--bg-2)', color: 'var(--mute)', width: 28, height: 28 }}>
                    <Icons.Building size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{loc}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{items.length} categor{items.length === 1 ? 'y' : 'ies'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceRow({ r, adjust }: { r: Resource; adjust: (id: string, delta: number) => void }) {
  const pct = (r.stock / r.capacity) * 100
  const low = r.stock < r.threshold
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{r.name}</div>
        <div className="muted" style={{ fontSize: 11.5 }}>{r.location}</div>
      </td>
      <td>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="mono">{r.stock.toLocaleString()} {r.unit}</span>
          <span className="muted mono" style={{ fontSize: 11 }}>{Math.round(pct)}%</span>
        </div>
        <InvBar stock={r.stock} capacity={r.capacity} threshold={r.threshold} />
      </td>
      <td className="mono muted">{r.threshold} {r.unit}</td>
      <td>
        {low
          ? <span className="pill crit">Below</span>
          : <span className={`pill ${r.trendDelta < 0 ? 'warn' : 'ok'}`}>{r.trendDelta > 0 ? '+' : ''}{r.trendDelta}</span>
        }
      </td>
      <td>
        <div className="row" style={{ gap: 4 }}>
          <button className="btn btn-sm" onClick={() => adjust(r.id, -1)}><Icons.Minus size={12} /></button>
          <button className="btn btn-sm" onClick={() => adjust(r.id, +1)}><Icons.Plus size={12} /></button>
          <button className="btn btn-sm" onClick={() => adjust(r.id, +25)}>+25</button>
        </div>
      </td>
    </tr>
  )
}

function FundRow({ r, adjust }: { r: Resource; adjust: (id: string, delta: number) => void }) {
  const pct = (r.stock / r.capacity) * 100
  const low = r.stock < r.threshold
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{r.name}</div>
        <div className="muted" style={{ fontSize: 11.5 }}>{r.location}</div>
      </td>
      <td>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="mono">${r.stock.toLocaleString()}</span>
          <span className="muted mono" style={{ fontSize: 11 }}>{Math.round(pct)}% of ${r.capacity.toLocaleString()}</span>
        </div>
        <InvBar stock={r.stock} capacity={r.capacity} threshold={r.threshold} />
      </td>
      <td className="mono muted">${r.threshold.toLocaleString()}</td>
      <td>
        <span className={`pill ${low ? 'crit' : 'warn'}`}>
          <Icons.ArrowDown size={10} />${Math.abs(r.trendDelta).toLocaleString()}
        </span>
      </td>
      <td>
        <div className="row" style={{ gap: 4 }}>
          <button className="btn btn-sm" onClick={() => adjust(r.id, -100)}>−$100</button>
          <button className="btn btn-sm" onClick={() => adjust(r.id, +500)}>+$500</button>
        </div>
      </td>
    </tr>
  )
}
