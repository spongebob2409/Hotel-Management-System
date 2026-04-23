import { useEffect, useState } from 'react'
import { roomsApi } from '../../api/rooms.api'
import './Rooms.css'

type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE'

const statusColors: Record<RoomStatus, string> = {
  AVAILABLE:   'var(--success)',
  OCCUPIED:    'var(--accent)',
  CLEANING:    'var(--info)',
  MAINTENANCE: 'var(--danger)',
}
const statusBg: Record<RoomStatus, string> = {
  AVAILABLE:   '#1a3d2e',
  OCCUPIED:    '#2e2512',
  CLEANING:    '#1a2a3d',
  MAINTENANCE: '#3d1a1a',
}

export default function Rooms() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rooms,    setRooms]    = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>(null)
  const [filter,   setFilter]   = useState<RoomStatus | 'ALL'>('ALL')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    roomsApi.getAll().then(r => setRooms(r.data)).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await roomsApi.updateStatus(id, status)
    setRooms(rs => rs.map(r => r.id === id ? { ...r, status } : r))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelected((s: any) => s?.id === id ? { ...s, status } : s)
  }

  const filtered = filter === 'ALL' ? rooms : rooms.filter(r => r.status === filter)
  const counts   = {
    AVAILABLE:   rooms.filter(r => r.status === 'AVAILABLE').length,
    OCCUPIED:    rooms.filter(r => r.status === 'OCCUPIED').length,
    CLEANING:    rooms.filter(r => r.status === 'CLEANING').length,
    MAINTENANCE: rooms.filter(r => r.status === 'MAINTENANCE').length,
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Loading rooms…</div>

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="page-header fade-up">
          <div>
            <h1 className="page-title">Rooms</h1>
            <p className="page-subtitle">{rooms.length} total rooms · click to manage</p>
          </div>
        </div>

        <div className="rooms-summary fade-up-2">
          {(['ALL', 'AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'] as const).map(f => (
            <button key={f} className={`room-filter-chip${filter === f ? ' rfc-active' : ''}`}
              style={filter === f && f !== 'ALL' ? { borderColor: statusColors[f], color: statusColors[f], background: statusBg[f] } : {}}
              onClick={() => setFilter(f)}>
              {f !== 'ALL' && <span className="status-dot" style={{ background: statusColors[f] }} />}
              {f === 'ALL' ? `All · ${rooms.length}` : `${f.charAt(0) + f.slice(1).toLowerCase()} · ${counts[f]}`}
            </button>
          ))}
        </div>

        {[1, 2, 3, 4].map(floor => {
          const fr = filtered.filter(r => r.floor === floor)
          if (!fr.length) return null
          return (
            <div key={floor} className="floor-section fade-up-3">
              <div className="floor-label">Floor {floor}</div>
              <div className="rooms-grid">
                {fr.map(room => (
                  <div key={room.id} className="room-card"
                    style={{ borderColor: selected?.id === room.id ? statusColors[room.status as RoomStatus] : 'var(--border)', cursor: 'pointer' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setSelected((s: any) => s?.id === room.id ? null : room)}>
                    <div className="room-top">
                      <span className="room-number">{room.roomNumber}</span>
                      <span className="room-type-badge">{room.category?.name?.slice(0,3).toUpperCase()}</span>
                    </div>
                    <div className="room-status-pill" style={{ background: statusBg[room.status as RoomStatus], color: statusColors[room.status as RoomStatus] }}>
                      <span className="status-dot" style={{ background: statusColors[room.status as RoomStatus] }} />
                      {room.status.toLowerCase()}
                    </div>
                    <div className="room-price">৳{room.category?.basePrice?.toLocaleString()}/n</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="room-detail-panel fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 22 }}>Room {selected.roomNumber}</span>
            <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => setSelected(null)}>✕</button>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: 20, background: statusBg[selected.status as RoomStatus], color: statusColors[selected.status as RoomStatus] }}>
            <span className="status-dot" style={{ background: statusColors[selected.status as RoomStatus] }} />
            {selected.status}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {[
              ['Type',  selected.category?.name],
              ['Floor', `Floor ${selected.floor}`],
              ['Rate',  `৳${selected.category?.basePrice?.toLocaleString()}/night`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selected.status === 'AVAILABLE'    && <button className="btn btn-primary" style={{ justifyContent: 'center' }}>+ New Booking</button>}
            {selected.status === 'CLEANING'     && <button className="btn btn-ghost" style={{ justifyContent: 'center', color: 'var(--success)' }} onClick={() => updateStatus(selected.id, 'AVAILABLE')}>✓ Mark as Clean</button>}
            {selected.status === 'OCCUPIED'     && <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>Check Out Guest</button>}
            <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={() => updateStatus(selected.id, 'MAINTENANCE')}>Mark Maintenance</button>
            {selected.status === 'MAINTENANCE'  && <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={() => updateStatus(selected.id, 'AVAILABLE')}>Mark Available</button>}
          </div>
        </div>
      )}
    </div>
  )
}
