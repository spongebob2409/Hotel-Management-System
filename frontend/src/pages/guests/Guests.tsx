import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { guestsApi } from '../../api/guests.api'

export default function Guests() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [guests,  setGuests]  = useState<any[]>([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    guestsApi.getAll().then(r => setGuests(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = guests.filter(g => {
    const name  = g.user?.name?.toLowerCase()  ?? ''
    const email = g.user?.email?.toLowerCase() ?? ''
    const phone = g.user?.phone ?? ''
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || phone.includes(search)
  })

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() ?? '?'

  return (
    <div>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Guests</h1>
          <p className="page-subtitle">{guests.length} registered guests</p>
        </div>
      </div>

      <div className="card fade-up-2">
        <div style={{ marginBottom: 16 }}>
          <input type="search" placeholder="Search by name, email or phone…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>Loading…</div>
        ) : (
          <table>
            <thead>
              <tr><th>Guest</th><th>Phone</th><th>Nationality</th><th>Total Stays</th><th>VIP</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/guests/${g.id}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2e2512', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                        {initials(g.user?.name ?? '')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{g.user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{g.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{g.user?.phone ?? '—'}</td>
                  <td style={{ color: 'var(--muted)' }}>{g.nationality ?? '—'}</td>
                  <td><span className="badge badge-muted">{g.bookings?.length ?? 0} stays</span></td>
                  <td>{g.vipStatus ? <span className="badge badge-accent">⬡ VIP</span> : <span className="badge badge-muted">Regular</span>}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => navigate(`/guests/${g.id}`)}>View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No guests found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
