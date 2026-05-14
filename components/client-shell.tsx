'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardProvider, useDashboard } from '@/context/dashboard'
import { Icons } from '@/components/icons'
import { ReferralDrawer } from '@/components/referral-drawer'
import { IntakeModal } from '@/components/intake-modal'
import { DonationModal } from '@/components/donation-modal'
import { ToastStack } from '@/components/toast-stack'

function Shell({ children }: { children: React.ReactNode }) {
  const {
    role, setRole, alerts, referrals, resources,
    openReferral, showIntake, setShowIntake, showDonation,
    toasts, drawerId,
  } = useDashboard()
  const pathname = usePathname()

  const openReferrals = referrals.filter(r => r.stage !== 'closed')
  const lowStock = resources.filter(r => r.stock < r.threshold).length
  const alertCount = alerts.length

  const navItems = [
    { href: '/',           label: 'Triage',     icon: Icons.Triage,    badge: openReferrals.filter(r => r.navigator === 'You').length || undefined },
    { href: '/referrals',  label: 'Referrals',  icon: Icons.Pipeline,  badge: openReferrals.length || undefined },
    { href: '/inventory',  label: 'Inventory',  icon: Icons.Inventory, badge: lowStock || undefined, badgeKind: lowStock > 0 ? 'crit' : '' },
    { href: '/alerts',     label: 'Alerts',     icon: Icons.Bell,      badge: alertCount || undefined, badgeKind: 'crit' },
  ]

  const adminItems = [
    { href: '/analytics', label: 'Analytics', icon: Icons.Analytics },
    { href: '/settings',  label: 'Settings',  icon: Icons.Settings },
  ]

  const breadcrumbs: Record<string, { crumb: string; title: string }> = {
    '/':           { crumb: 'Workspace', title: 'Triage Queue' },
    '/referrals':  { crumb: 'Workspace', title: 'Referral Pipeline' },
    '/inventory':  { crumb: 'Workspace', title: 'Resource Inventory' },
    '/analytics':  { crumb: 'Workspace', title: 'Demand Analytics' },
    '/alerts':     { crumb: 'Workspace', title: 'Alerts' },
    '/settings':   { crumb: 'Admin',     title: 'Settings & Thresholds' },
  }
  const bc = breadcrumbs[pathname] || breadcrumbs['/']

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 18c0-5 3-9 8-9s8 4 8 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="8" r="1.6" fill="white" />
            </svg>
          </div>
          <div className="brand-name">
            DuckSupport
            <small>Triage · v1.0</small>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-group-label">Workspace</div>
          {navItems.map(it => (
            <Link key={it.href} href={it.href}
              className={`nav-item ${pathname === it.href ? 'active' : ''}`}>
              <span className="nav-icon"><it.icon size={16} /></span>
              <span>{it.label}</span>
              {it.badge != null && it.badge > 0 && (
                <span className={`nav-badge ${it.badgeKind || ''}`}>{it.badge}</span>
              )}
            </Link>
          ))}

          {role === 'manager' && (
            <>
              <div className="nav-group-label">Admin</div>
              {adminItems.map(it => (
                <Link key={it.href} href={it.href}
                  className={`nav-item ${pathname === it.href ? 'active' : ''}`}>
                  <span className="nav-icon"><it.icon size={16} /></span>
                  <span>{it.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{role === 'manager' ? 'KW' : 'NP'}</div>
          <div style={{ minWidth: 0, lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              {role === 'manager' ? 'Dr. K. Whitlow' : 'N. Park'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--mute)' }}>
              {role === 'manager' ? 'Care Team Manager' : 'Basic Needs Navigator'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <h1>
            <span className="crumb">{bc.crumb}</span>
            <span style={{ margin: '0 6px', color: 'var(--mute-2)' }}>›</span>
            {bc.title}
          </h1>

          <div className="search">
            <Icons.Search size={14} />
            <input placeholder="Search students, resources, IDs…" readOnly />
            <kbd>⌘K</kbd>
          </div>

          <div className="topbar-right">
            <div className="role-toggle">
              <button className={role === 'navigator' ? 'on' : ''} onClick={() => setRole('navigator')}>Navigator</button>
              <button className={role === 'manager'   ? 'on' : ''} onClick={() => setRole('manager')}>Manager</button>
            </div>
            <Link href="/alerts" className="icon-btn" title="Alerts">
              <Icons.Bell size={16} />
              {alertCount > 0 && <span className="pulse" />}
            </Link>
            <button className="btn btn-primary" onClick={() => setShowIntake(true)}>
              <Icons.Plus size={14} />New intake
            </button>
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0 }}>
          {children}
        </div>
      </div>

      {/* Overlays */}
      {drawerId && <ReferralDrawer />}
      {showIntake && <IntakeModal />}
      {showDonation && <DonationModal />}
      <ToastStack toasts={toasts} />
    </div>
  )
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <Shell>{children}</Shell>
    </DashboardProvider>
  )
}
