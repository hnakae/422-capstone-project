'use client'

import type { DemandPoint } from '@/lib/types'

export function BarLineCombo({ data, h = 220, highlightIdx = -1 }: {
  data: DemandPoint[]; h?: number; highlightIdx?: number
}) {
  const w = 720
  const pad = { t: 12, r: 14, b: 26, l: 36 }
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b }
  const max = Math.max(...data.map(d => d.food + d.housing + d.fund + d.hygiene)) * 1.15
  const bw = inner.w / data.length
  const cats = [
    { key: 'food'    as const, color: 'oklch(52% 0.13 155)' },
    { key: 'hygiene' as const, color: 'oklch(60% 0.13 200)' },
    { key: 'fund'    as const, color: 'oklch(65% 0.13 75)'  },
    { key: 'housing' as const, color: 'oklch(58% 0.20 25)'  },
  ]
  const totals = data.map(d => d.food + d.housing + d.fund + d.hygiene)
  const linePoints = totals.map((v, i) => {
    const x = pad.l + i * bw + bw / 2
    const y = pad.t + inner.h - (v / max) * inner.h
    return `${x},${y}`
  }).join(' ')
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
      {yTicks.map((v, i) => {
        const y = pad.t + inner.h - (v / max) * inner.h
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + inner.w} y1={y} y2={y}
              stroke="oklch(92% 0.005 240)" strokeWidth="1" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="10"
              fill="oklch(60% 0.01 240)" fontFamily="var(--font-mono)">{v}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = pad.l + i * bw
        let acc = 0
        return (
          <g key={i}>
            {cats.map(c => {
              const v = d[c.key]
              const segH = (v / max) * inner.h
              const y = pad.t + inner.h - acc - segH
              acc += segH
              return (
                <rect key={c.key} x={x + bw * 0.18} y={y} width={bw * 0.64} height={segH}
                  fill={c.color} opacity={i === highlightIdx ? 1 : 0.86} />
              )
            })}
            <text x={x + bw / 2} y={h - 8} textAnchor="middle" fontSize="10"
              fill="oklch(60% 0.01 240)" fontFamily="var(--font-mono)">{d.day}</text>
          </g>
        )
      })}
      <polyline points={linePoints} fill="none" stroke="oklch(22% 0.02 250)"
        strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3,3" />
      {totals.map((v, i) => {
        const x = pad.l + i * bw + bw / 2
        const y = pad.t + inner.h - (v / max) * inner.h
        return <circle key={i} cx={x} cy={y} r="2.2" fill="oklch(22% 0.02 250)" />
      })}
    </svg>
  )
}

export function MiniBar({ data, h = 140, accent = 'oklch(52% 0.13 155)', warnIdx = -1 }: {
  data: { label: string; value: number }[]
  h?: number; accent?: string; warnIdx?: number
}) {
  const w = 320
  const max = Math.max(...data.map(d => d.value)) * 1.18
  const pad = { t: 8, r: 8, b: 22, l: 8 }
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b }
  const bw = inner.w / data.length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
      {data.map((d, i) => {
        const barH = (d.value / max) * inner.h
        const x = pad.l + i * bw + bw * 0.18
        const y = pad.t + inner.h - barH
        const warn = i === warnIdx
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw * 0.64} height={barH} rx="2"
              fill={warn ? 'var(--danger)' : accent} opacity={warn ? 1 : 0.88} />
            <text x={pad.l + i * bw + bw / 2} y={h - 8} textAnchor="middle" fontSize="9.5"
              fill={warn ? 'var(--danger-ink)' : 'oklch(60% 0.01 240)'}
              fontFamily="var(--font-mono)" fontWeight={warn ? 600 : 400}>{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export function LineTrend({ values, h = 80, color = 'oklch(52% 0.13 155)' }: {
  values: number[]; h?: number; color?: string
}) {
  const w = 300
  const pad = { t: 6, r: 4, b: 6, l: 4 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b }
  const step = inner.w / (values.length - 1)
  const pts = values.map((v, i) => ({
    x: pad.l + i * step,
    y: pad.t + inner.h - ((v - min) / range) * inner.h,
  }))
  const path = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ')
  const area = `${path} L${pts[pts.length - 1].x},${pad.t + inner.h} L${pts[0].x},${pad.t + inner.h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg">
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  )
}

export function Sparkline({ values, w = 80, h = 24, color = 'currentColor' }: {
  values: number[]; w?: number; h?: number; color?: string
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = w / (values.length - 1)
  const pts = values.map((v, i) => {
    const x = i * step
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color}
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Donut({ value, max, size = 64, stroke = 8, color = 'var(--accent-2)' }: {
  value: number; max: number; size?: number; stroke?: number; color?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value / max))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--bg-2)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={`${pct * c} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 360ms cubic-bezier(.2,.7,.3,1)' }} />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize="13" fontWeight="600"
        fill="var(--ink)" fontFamily="var(--font-mono)">{Math.round(pct * 100)}%</text>
    </svg>
  )
}
