import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard', '/bookings': 'Bookings', '/guests': 'Guests',
  '/rooms': 'Rooms', '/billing': 'Billing', '/iot': 'IoT Sensors',
  '/housekeeping': 'Housekeeping', '/staff': 'Staff',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = titles[base] ?? 'Hotel OS'
  const now = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header style={{ height: 56, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 18, color: 'var(--text)' }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{now}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', width: 260 }}>
          <span style={{ fontSize: 16, color: 'var(--muted)' }}>⌕</span>
          <input type="search" placeholder="Search guests, rooms…" style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: 'var(--text)', width: '100%', outline: 'none' }} />
        </div>
        <button style={{ position: 'relative', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer' }}>
          🔔
          <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: 'var(--danger)', borderRadius: '50%', border: '1.5px solid var(--bg2)' }} />
        </button>
      </div>
    </header>
  )
}