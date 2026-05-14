'use client'

interface IconProps {
  size?: number
  style?: React.CSSProperties
}

function Icon({ d, size = 16, sw = 1.7, fill, style }: {
  d: React.ReactNode; size?: number; sw?: number; fill?: string; style?: React.CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'}
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {d}
    </svg>
  )
}

export const Icons = {
  Triage:    (p: IconProps) => <Icon {...p} d={<><path d="M12 2v4"/><path d="M5 6l3 3"/><path d="M19 6l-3 3"/><circle cx="12" cy="14" r="7"/><path d="M9 14l2 2 4-4"/></>} />,
  Inventory: (p: IconProps) => <Icon {...p} d={<><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>} />,
  Pipeline:  (p: IconProps) => <Icon {...p} d={<><rect x="3" y="5" width="6" height="14" rx="1.5"/><rect x="10.5" y="5" width="6" height="14" rx="1.5"/><rect x="18" y="5" width="3" height="14" rx="1"/></>} />,
  Analytics: (p: IconProps) => <Icon {...p} d={<><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></>} />,
  Bell:      (p: IconProps) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  Settings:  (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 19.4 9c.1.6.5 1 1 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>} />,
  Search:    (p: IconProps) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />,
  Plus:      (p: IconProps) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  ArrowDown: (p: IconProps) => <Icon {...p} d={<><path d="M12 5v14M19 12l-7 7-7-7"/></>} />,
  ArrowUp:   (p: IconProps) => <Icon {...p} d={<><path d="M12 19V5M5 12l7-7 7 7"/></>} />,
  Check:     (p: IconProps) => <Icon {...p} d={<><path d="M5 12l4 4L19 7"/></>} />,
  X:         (p: IconProps) => <Icon {...p} d={<><path d="M6 6l12 12M6 18L18 6"/></>} />,
  ChevronR:  (p: IconProps) => <Icon {...p} d={<><path d="M9 6l6 6-6 6"/></>} />,
  Filter:    (p: IconProps) => <Icon {...p} d={<><path d="M4 5h16l-6 8v6l-4-2v-4z"/></>} />,
  Donate:    (p: IconProps) => <Icon {...p} d={<><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></>} />,
  Minus:     (p: IconProps) => <Icon {...p} d={<><path d="M5 12h14"/></>} />,
  Doc:       (p: IconProps) => <Icon {...p} d={<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>} />,
  Phone:     (p: IconProps) => <Icon {...p} d={<><path d="M22 17v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 17z"/></>} />,
  Building:  (p: IconProps) => <Icon {...p} d={<><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/></>} />,
  Warn:      (p: IconProps) => <Icon {...p} d={<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h0"/></>} />,
  Info:      (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h0"/></>} />,
  Sparkles:  (p: IconProps) => <Icon {...p} d={<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>} />,
}
