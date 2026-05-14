export function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.round(ms / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

export function sortByUrgency<T extends { urgency: 'high' | 'med' | 'low'; opened: string }>(items: T[]): T[] {
  const rank = { high: 0, med: 1, low: 2 } as const
  return [...items].sort((a, b) => {
    if (rank[a.urgency] !== rank[b.urgency]) return rank[a.urgency] - rank[b.urgency]
    return new Date(b.opened).getTime() - new Date(a.opened).getTime()
  })
}
