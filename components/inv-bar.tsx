'use client'

interface InvBarProps {
  stock: number
  capacity: number
  threshold: number
}

export function InvBar({ stock, capacity, threshold }: InvBarProps) {
  const pct = (stock / capacity) * 100
  const ratio = stock / threshold
  const cls = stock < threshold ? 'crit' : ratio < 1.3 ? 'warn' : ''
  return (
    <div className={`inv-bar ${cls}`}>
      <span style={{ width: `${pct}%` }} />
      <span className="tick" style={{ left: `${(threshold / capacity) * 100}%` }} />
    </div>
  )
}
