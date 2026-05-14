'use client'

import type { Toast } from '@/lib/types'

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span className="swatch" />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
