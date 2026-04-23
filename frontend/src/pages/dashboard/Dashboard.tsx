import { useEffect, useState } from 'react'
import { roomsApi }    from '../../api/rooms.api'
import { bookingsApi } from '../../api/bookings.api'
import { billingApi }  from '../../api/billing.api'
import { useAuthStore } from '../../store/auth.store'
import './Dashboard.css'

const statusMap: Record<string, string> = {
  CONFIRMED:   'badge-info',
  CHECKED_IN:  'badge-success',
  CHECKED_OUT: 'badge-muted',
  PENDING:     'badge-warning',
  CANCELLED:   'badge-danger',
}

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useAuthStore(s => s.user)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rooms,    setRooms]    = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summary,  setSummary]  = useState<any>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      roomsApi.getAll(),
      bookingsApi.getAll(),
      billingApi.getSummary(),
    ]).then(([r, b, s]) => {
      setRooms(r.data)
      setBookings(b.data)
      setSummary(s.data)
    }).finally(() => setLoading(false))
  }, [])

  const occupied    = rooms.filter(r => r.status === 'OCCUPIED').length
  const available   = rooms.filter(r => r.status === 'AVAILABLE').length
  const checkIns    = bookings.filter(b => b.status === 'CONFIRMED').length
  const checkedIn   = bookings.filter(b => b.status === 'CHECKED_IN').length

  const floors = [1, 2, 3, 4].map(floor => {
    const fr   = rooms.filter(r => r.floor === floor)
    const occ  = fr.filter(r => r.status === 'OCCUPIED').length
    const pct  = fr.length ? Math.round((occ / fr.length) * 100) : 0
    return { floor, total: fr.length, occupied: occ, available: fr.filter(r => r.status === 'AVAILABLE').length, pct }
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--muted)' }}>
      Loading dashboard…
    </div>
  )

  return (
    <div>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Good morning ☀︎</h1>
          <p className="page-subtitle">Here's what's happening at Aurum Hotel today.</p>
        </div>
      </div>

      <div className="stats-grid fade-up-2">
        {[
          { label: 'Occupied Rooms',    value: occupied,                                  sub: `${available} available`,         icon: '⊞', color: 'accent'  },
          { label: 'Check-ins Today',   value: checkIns,                                  sub: 'Confirmed bookings',             icon: '◫', color: 'info'    },
          { label: 'Guests In-House',   value: checkedIn,                                 sub: 'Currently checked in',           icon: '◉', color: 'warning' },
          { label: 'Total Revenue',     value: `৳${(summary?.totalRevenue ?? 0).toLocaleString()}`, sub: `৳${(summary?.totalPending ?? 0).toLocaleString()} pending`, icon: '◈', color: 'success' },
        ].map(s => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid fade-up-3">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Bookings</span>
            <a href="/bookings" className="card-link">View all →</a>
          </div>
          <table>
            <thead>
              <tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.slice(0, 6).map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{b.bookingRef}</td>
                  <td>{b.guest?.user?.name ?? '—'}</td>
                  <td><span className="badge badge-muted">{b.room?.roomNumber}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td><span className={`badge ${statusMap[b.status]}`}>{b.status}</span></td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Room Occupancy</span>
            <a href="/rooms" className="card-link">View rooms →</a>
          </div>
          <div className="floor-list">
            {floors.filter(f => f.total > 0).map(f => (
              <div key={f.floor} className="floor-row">
                <div className="floor-info">
                  <span className="floor-name">Floor {f.floor}</span>
                  <span className="floor-pct">{f.pct}%</span>
                </div>
                <div className="floor-bar">
                  <div className="floor-bar-fill" style={{ width: `${f.pct}%` }} />
                </div>
                <div className="floor-chips">
                  <span className="badge badge-success">{f.occupied} occupied</span>
                  <span className="badge badge-muted">{f.available} free</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
