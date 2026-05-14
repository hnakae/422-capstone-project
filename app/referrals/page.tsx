'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, useDroppable, useDraggable, type DragEndEvent } from '@dnd-kit/core'
import { useDashboard } from '@/context/dashboard'
import { UrgencyPill } from '@/components/pill'
import { Icons } from '@/components/icons'
import { relTime } from '@/lib/utils'
import type { Referral, Stage } from '@/lib/types'

export default function ReferralsPage() {
  const { referrals, resources, stages, moveReferral, openReferral } = useDashboard()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scope, setScope] = useState<'all' | 'mine'>('all')

  const visible = scope === 'mine' ? referrals.filter(r => r.navigator === 'You') : referrals
  const active  = referrals.find(r => r.id === activeId)

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      moveReferral(String(active.id), String(over.id) as Stage)
    }
    setActiveId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Referral Pipeline</h2>
          <div className="page-sub">
            Drag a card to advance a case · {visible.filter(r => r.stage !== 'closed').length} open
          </div>
        </div>
        <div className="row gap-12">
          <div className="chip-row">
            <button className={`chip ${scope === 'all'  ? 'on' : ''}`} onClick={() => setScope('all')}>
              All team · {referrals.length}
            </button>
            <button className={`chip ${scope === 'mine' ? 'on' : ''}`} onClick={() => setScope('mine')}>
              Mine · {referrals.filter(r => r.navigator === 'You').length}
            </button>
          </div>
          <button className="btn"><Icons.Filter size={14} />Filter</button>
        </div>
      </div>

      <DndContext onDragStart={e => setActiveId(String(e.active.id))} onDragEnd={handleDragEnd}>
        <div className="kanban">
          {stages.map(col => (
            <KanbanColumn key={col.id} stageId={col.id} label={col.label} hint={col.hint}
              items={visible.filter(r => r.stage === col.id)}
              onOpen={openReferral} resources={resources} />
          ))}
        </div>
        <DragOverlay>
          {active ? <KanbanCard referral={active} resources={resources} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <div className="hr" />

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">Pipeline velocity</div>
            <span className="muted" style={{ fontSize: 11.5 }}>This week</span>
          </div>
          <div className="card-body row gap-20" style={{ alignItems: 'center' }}>
            <div className="row gap-20" style={{ flex: 1 }}>
              {stages.map(s => {
                const c = referrals.filter(r => r.stage === s.id).length
                return (
                  <div key={s.id} style={{ textAlign: 'center', flex: 1 }}>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>{c}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Average time-in-stage</div>
            <span className="muted" style={{ fontSize: 11.5 }}>median, last 30d</span>
          </div>
          <div className="card-body">
            {[
              { l: 'Intake → Verified',   v: '1.4 h', w: 18 },
              { l: 'Verified → Matched',  v: '3.6 h', w: 38 },
              { l: 'Matched → Acquired',  v: '11.2 h', w: 72 },
              { l: 'Acquired → Closed',   v: '2.1 d',  w: 96 },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5 }}>{row.l}</span>
                  <span className="mono muted" style={{ fontSize: 12 }}>{row.v}</span>
                </div>
                <div className="inv-bar">
                  <span style={{ width: `${row.w}%`, background: 'oklch(60% 0.08 240)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({ stageId, label, hint, items, onOpen, resources }: {
  stageId: Stage; label: string; hint: string
  items: Referral[]; onOpen: (id: string) => void
  resources: ReturnType<typeof useDashboard>['resources']
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId })
  return (
    <div className="kcol">
      <div className="kcol-head">
        <div>
          <div className="kcol-title">{label}</div>
          <div className="kcol-hint">{hint}</div>
        </div>
        <span className="kcol-count">{items.length}</span>
      </div>
      <div ref={setNodeRef} className={`kcol-body ${isOver ? 'drag-over' : ''}`}>
        {items.map(r => (
          <KanbanCard key={r.id} referral={r} resources={resources} onOpen={onOpen} />
        ))}
        {items.length === 0 && (
          <div style={{
            padding: 20, textAlign: 'center', color: 'var(--mute-2)',
            fontSize: 12, border: '1px dashed var(--line-2)', borderRadius: 8,
          }}>Drop here</div>
        )}
      </div>
    </div>
  )
}

function KanbanCard({ referral: r, resources, onOpen, isOverlay = false }: {
  referral: Referral
  resources: ReturnType<typeof useDashboard>['resources']
  onOpen?: (id: string) => void
  isOverlay?: boolean
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: r.id, disabled: isOverlay })
  return (
    <div ref={setNodeRef} {...(isOverlay ? {} : { ...attributes, ...listeners })}
      className={`kcard ${isDragging ? 'dragging' : ''}`}
      onClick={() => !isDragging && onOpen?.(r.id)}>
      <div className="kcard-head">
        <span className="kcard-id">{r.id}</span>
        <UrgencyPill urgency={r.urgency} />
      </div>
      <div className="kcard-name">{r.student}</div>
      <div className="kcard-need">{r.need}</div>
      <div className="kcard-foot">
        <span className="muted" style={{ fontSize: 11 }}>{relTime(r.opened)}</span>
        <div className="row" style={{ gap: 4 }}>
          {r.resources.slice(0, 2).map(rid => {
            const res = resources.find(x => x.id === rid)
            const low = res && res.stock < res.threshold
            return (
              <span key={rid} className={`pill ${low ? 'crit' : ''}`} style={{ padding: '1px 6px', fontSize: 10.5 }}>
                {res ? res.name.split(' ')[0] : rid}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
