import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi } from '../../api/bookings.api'
import './Bookings.css'

const statusMap: Record<string, string> = {
  CONFIRMED:   'badge-info',
  CHECKED_IN:  'badge-success',
  CHECKED_OUT: 'badge-muted',
  PENDING:     'badge-warning',
  CANCELLED:   'badge-danger',
}

export default function Bookings() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([])
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    bookingsApi.getAll().then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    const name   = b.guest?.user?.name?.toLowerCase() ?? ''
    const ref    = b.bookingRef?.toLowerCase() ?? ''
    const room   = b.room?.roomNumber ?? ''
    const matchS = name.includes(search.toLowerCase()) || ref.includes(search.toLowerCase()) || room.includes(search)
    const matchF = filter === 'All' || b.status === filter.toUpperCase().replace('-', '_')
    return matchS && matchF
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nights = (b: any) => Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000)

  return (
    <div>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">{bookings.length} total bookings</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/bookings/new')}>+ New Booking</button>
      </div>

      <div className="card fade-up-2">
        <div className="bookings-toolbar">
          <div className="filter-tabs">
            {['All', 'Pending', 'Confirmed', 'Checked_in', 'Checked_out', 'Cancelled'].map(f => (
              <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
          <input type="search" placeholder="Search guest, ID or room…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>Loading…</div>
        ) : (
          <table>
            <thead>
              <tr><th>Ref</th><th>Guest</th><th>Room</th><th>Type</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No bookings found</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/bookings/${b.id}`)}>
                  <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{b.bookingRef}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.guest?.user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.guest?.user?.phone}</div>
                  </td>
                  <td><span className="badge badge-muted">{b.room?.roomNumber}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{b.room?.category?.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--muted)' }}>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--muted)' }}>{nights(b)}n</td>
                  <td><span className={`badge ${statusMap[b.status]}`}>{b.status}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => navigate(`/bookings/${b.id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}