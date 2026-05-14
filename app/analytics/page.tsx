'use client'

import { useDashboard } from '@/context/dashboard'
import { BarLineCombo, MiniBar, LineTrend, Sparkline, Donut } from '@/components/charts'
import { InvBar } from '@/components/inv-bar'
import { Icons } from '@/components/icons'

export default function AnalyticsPage() {
  const { resources, demandSeries, role } = useDashboard()

  if (role !== 'manager') {
    return (
      <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center', color: 'var(--mute)' }}>
          <Icons.Analytics size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>Manager access only</div>
          <div style={{ fontSize: 13 }}>Switch to Manager role to view analytics.</div>
        </div>
      </div>
    )
  }

  const series  = demandSeries
  const ranked  = [...resources].sort((a, b) => (a.stock / a.threshold) - (b.stock / b.threshold)).slice(0, 6)
  const total   = series.reduce((s, d) => s + d.food + d.housing + d.fund + d.hygiene, 0)
  const totalsDay = series.map(d => d.food + d.housing + d.fund + d.hygiene)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Demand Analytics</h2>
          <div className="page-sub">Last 14 days · {total} total interactions</div>
        </div>
        <div className="row gap-12">
          <select className="btn" style={{ paddingRight: 24 }} defaultValue="14d">
            <option value="7d">Last 7 days</option>
            <option value="14d">Last 14 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button className="btn"><Icons.Doc size={14} />Export report</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="Avg time to match"     value="3.6h"  delta="−0.8h vs. last wk" up   spark={<Sparkline values={[5.2,5.0,4.6,4.2,4.0,3.9,3.6]} color="oklch(52% 0.13 155)"/>} />
        <KPI label="Cases closed (wk)"     value={42}    delta="+12% wk/wk" up           spark={<Sparkline values={[28,30,34,36,38,40,42]} color="oklch(52% 0.13 155)"/>} />
        <KPI label="Repeat-visit rate"     value="18%"   delta="−2pp vs. last mo" up />
        <KPI label="Resource fulfillment"  value="91%"   delta="2 categories below target" down spark={<Sparkline values={[95,94,93,92,93,92,91]} color="oklch(58% 0.20 25)"/>} />
      </div>

      <div className="grid-12-8" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Referrals by category — daily</div>
              <div className="card-sub">Stacked bars · dashed line = total</div>
            </div>
            <div className="legend">
              <span><span className="sw" style={{ background: 'oklch(52% 0.13 155)' }} />Food</span>
              <span><span className="sw" style={{ background: 'oklch(60% 0.13 200)' }} />Hygiene</span>
              <span><span className="sw" style={{ background: 'oklch(65% 0.13 75)' }}  />Fund</span>
              <span><span className="sw" style={{ background: 'oklch(58% 0.20 25)' }}  />Housing</span>
            </div>
          </div>
          <div className="card-body">
            <BarLineCombo data={series} h={260} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Resource depletion ranking</div>
            <span className="muted" style={{ fontSize: 11.5 }}>Stock vs threshold</span>
          </div>
          <div className="card-body col gap-12">
            {ranked.map(r => {
              const ratio = r.stock / r.threshold
              const cls = r.stock < r.threshold ? 'crit' : ratio < 1.3 ? 'warn' : ''
              return (
                <div key={r.id}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5 }}>{r.name}</span>
                    <span className="mono" style={{ fontSize: 11.5, color: cls === 'crit' ? 'var(--danger-ink)' : 'var(--mute)' }}>
                      {ratio.toFixed(2)}×
                    </span>
                  </div>
                  <InvBar stock={r.stock} capacity={r.capacity} threshold={r.threshold} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-head"><div className="card-title">Housing fund — burn vs replenish</div></div>
          <div className="card-body">
            <LineTrend values={[12000,11000,10200,9000,7800,6400,5200,4200]} h={120} color="oklch(58% 0.20 25)" />
            <div className="row gap-12" style={{ marginTop: 10 }}>
              <span className="pill crit"><span className="dot" />Below threshold 5/13</span>
              <span className="muted" style={{ fontSize: 11.5 }}>Projected: depleted by 5/22</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Top needs (this week)</div></div>
          <div className="card-body">
            <MiniBar h={140} data={[
              { label: 'Food',   value: 84 },
              { label: 'Fund',   value: 47 },
              { label: 'Hygie',  value: 39 },
              { label: 'Housng', value: 28 },
              { label: 'Books',  value: 14 },
              { label: 'Bus',    value: 12 },
            ]} />
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="card-title">Outreach origin</div></div>
          <div className="card-body row gap-20" style={{ alignItems: 'center', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <Donut value={56} max={100} size={72} color="oklch(52% 0.13 155)" />
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>EMU Walk-in</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Donut value={28} max={100} size={72} color="oklch(60% 0.13 200)" />
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Faculty referral</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Donut value={16} max={100} size={72} color="oklch(65% 0.13 75)" />
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>Online form</div>
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
