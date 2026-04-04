import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard',    icon: '▦', label: 'Dashboard' },
  { to: '/bookings',     icon: '◫', label: 'Bookings' },
  { to: '/guests',       icon: '◉', label: 'Guests' },
  { to: '/rooms',        icon: '⊞', label: 'Rooms' },
  { to: '/billing',      icon: '◈', label: 'Billing' },
  { to: '/iot',          icon: '◎', label: 'IoT Sensors' },
  { to: '/housekeeping', icon: '◧', label: 'Housekeeping' },
  { to: '/staff',        icon: '◑', label: 'Staff' },
]

export default function Sidebar() {
  return (
    <aside style={{ width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '22px 18px 18px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <span style={{ fontSize: 26, color: 'var(--accent)', lineHeight: 1 }}>⬡</span>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, color: 'var(--text)', lineHeight: 1.1 }}>Aurum</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Hotel OS</div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', padding: '10px 18px 5px', fontWeight: 500 }}>Main Menu</div>
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 10px', gap: 1, marginBottom: 6 }}>
        {nav.slice(0, 5).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 8, fontSize: 13, textDecoration: 'none', transition: 'all .17s',
            background: isActive ? '#2e2512' : 'transparent',
            color: isActive ? 'var(--accent2)' : 'var(--muted)',
            fontWeight: isActive ? 500 : 400,
            borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
          })}>
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Ops nav */}
      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', padding: '10px 18px 5px', fontWeight: 500 }}>Operations</div>
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 10px', gap: 1 }}>
        {nav.slice(5).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 8, fontSize: 13, textDecoration: 'none', transition: 'all .17s',
            background: isActive ? '#2e2512' : 'transparent',
            color: isActive ? 'var(--accent2)' : 'var(--muted)',
            fontWeight: isActive ? 500 : 400,
            borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
          })}>
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer user */}
      <div style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: '#1a1200', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Admin</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
