import { useState } from 'react'
import './Staff.css'

type Department = 'Housekeeping' | 'Reception' | 'Security' | 'Maintenance' | 'F&B'
type ShiftType  = 'Morning' | 'Evening' | 'Night'

interface StaffMember {
  id: string
  name: string
  role: string
  department: Department
  shift: ShiftType
  shiftTime: string
  phone: string
  email: string
  status: 'on-duty' | 'off-duty' | 'on-leave'
  joinDate: string
  tasksToday: number
}

const staffList: StaffMember[] = [
  { id: 'ST-001', name: 'Rina Akter',      role: 'Sr. Housekeeper',    department: 'Housekeeping', shift: 'Morning', shiftTime: '06:00–14:00', phone: '+880 171 111 0001', email: 'rina@aurum.com',     status: 'on-duty',  joinDate: '2022-03-15', tasksToday: 3 },
  { id: 'ST-002', name: 'Karim Mia',       role: 'Housekeeper',        department: 'Housekeeping', shift: 'Morning', shiftTime: '06:00–14:00', phone: '+880 171 111 0002', email: 'karim@aurum.com',    status: 'on-duty',  joinDate: '2023-01-10', tasksToday: 2 },
  { id: 'ST-003', name: 'Nasrin Begum',    role: 'Housekeeper',        department: 'Housekeeping', shift: 'Evening', shiftTime: '14:00–22:00', phone: '+880 171 111 0003', email: 'nasrin@aurum.com',   status: 'on-duty',  joinDate: '2023-06-20', tasksToday: 2 },
  { id: 'ST-004', name: 'Sujon Ahmed',     role: 'Room Service',       department: 'F&B',          shift: 'Morning', shiftTime: '07:00–15:00', phone: '+880 171 111 0004', email: 'sujon@aurum.com',    status: 'on-duty',  joinDate: '2024-02-01', tasksToday: 2 },
  { id: 'ST-005', name: 'Babul Hossain',   role: 'Maintenance Tech',   department: 'Maintenance',  shift: 'Morning', shiftTime: '08:00–16:00', phone: '+880 171 111 0005', email: 'babul@aurum.com',    status: 'on-duty',  joinDate: '2021-11-05', tasksToday: 2 },
  { id: 'ST-006', name: 'Ruma Khatun',     role: 'Receptionist',       department: 'Reception',    shift: 'Morning', shiftTime: '08:00–16:00', phone: '+880 171 111 0006', email: 'ruma@aurum.com',     status: 'on-duty',  joinDate: '2023-08-14', tasksToday: 0 },
  { id: 'ST-007', name: 'Farhan Islam',    role: 'Night Receptionist', department: 'Reception',    shift: 'Night',   shiftTime: '22:00–06:00', phone: '+880 171 111 0007', email: 'farhan@aurum.com',   status: 'off-duty', joinDate: '2024-01-20', tasksToday: 0 },
  { id: 'ST-008', name: 'Jahangir Alam',   role: 'Security Guard',     department: 'Security',     shift: 'Night',   shiftTime: '22:00–06:00', phone: '+880 171 111 0008', email: 'jahangir@aurum.com', status: 'off-duty', joinDate: '2022-09-01', tasksToday: 0 },
  { id: 'ST-009', name: 'Poly Rani Das',   role: 'Housekeeper',        department: 'Housekeeping', shift: 'Evening', shiftTime: '14:00–22:00', phone: '+880 171 111 0009', email: 'poly@aurum.com',     status: 'on-leave', joinDate: '2023-04-18', tasksToday: 0 },
  { id: 'ST-010', name: 'Monir Hossain',   role: 'Security Guard',     department: 'Security',     shift: 'Morning', shiftTime: '06:00–14:00', phone: '+880 171 111 0010', email: 'monir@aurum.com',    status: 'on-duty',  joinDate: '2022-07-22', tasksToday: 0 },
]

const deptColors: Record<Department, { color: string; bg: string }> = {
  'Housekeeping': { color: 'var(--info)',    bg: '#1a2a3d' },
  'Reception':    { color: 'var(--accent)',  bg: '#2e2512' },
  'Security':     { color: 'var(--warning)', bg: '#3d2c1a' },
  'Maintenance':  { color: 'var(--danger)',  bg: '#3d1a1a' },
  'F&B':          { color: 'var(--success)', bg: '#1a3d2e' },
}

const statusStyles = {
  'on-duty':  { color: 'var(--success)', bg: '#1a3d2e',    label: 'On Duty'  },
  'off-duty': { color: 'var(--muted)',   bg: 'var(--bg3)', label: 'Off Duty' },
  'on-leave': { color: 'var(--warning)', bg: '#3d2c1a',    label: 'On Leave' },
}

const shiftColors: Record<ShiftType, string> = {
  Morning: 'var(--warning)', Evening: 'var(--info)', Night: 'var(--accent)',
}

const depts: Array<Department | 'All'> = ['All', 'Housekeeping', 'Reception', 'Security', 'Maintenance', 'F&B']

export default function Staff() {
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All')
  const [selected, setSelected]     = useState<StaffMember | null>(null)
  const [search, setSearch]         = useState('')

  const filtered = staffList.filter(s => {
    const matchDept   = deptFilter === 'All' || s.department === deptFilter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.role.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="page-header fade-up">
          <div>
            <h1 className="page-title">Staff</h1>
            <p className="page-subtitle">
              {staffList.filter(s => s.status === 'on-duty').length} on duty · {staffList.length} total
            </p>
          </div>
          <button className="btn btn-primary">+ Add Staff</button>
        </div>

        {/* Summary */}
        <div className="staff-summary fade-up-2">
          {(['on-duty', 'off-duty', 'on-leave'] as const).map(s => (
            <div key={s} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: statusStyles[s].color, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500 }}>
                {statusStyles[s].label}
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 28 }}>
                {staffList.filter(m => m.status === s).length}
              </div>
            </div>
          ))}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500 }}>
              Departments
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 28 }}>5</div>
          </div>
        </div>

        {/* Filters */}
        <div className="staff-filters fade-up-3">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {depts.map(d => (
              <button key={d}
                className={`staff-chip${deptFilter === d ? ' staff-chip-active' : ''}`}
                style={deptFilter === d && d !== 'All'
                  ? { borderColor: deptColors[d as Department].color, color: deptColors[d as Department].color, background: deptColors[d as Department].bg }
                  : {}}
                onClick={() => setDeptFilter(d as Department | 'All')}>
                {d}
              </button>
            ))}
          </div>
          <input type="search" placeholder="Search staff…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
        </div>

        {/* Staff grid */}
        <div className="staff-grid fade-up-3">
          {filtered.map(member => (
            <div key={member.id} className="staff-card"
              style={{ borderColor: selected?.id === member.id ? 'var(--accent)' : 'var(--border)' }}
              onClick={() => setSelected(s => s?.id === member.id ? null : member)}>
              <div className="staff-card-top">
                <div className="staff-big-avatar">{initials(member.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{member.role}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 10, background: statusStyles[member.status].bg, color: statusStyles[member.status].color, flexShrink: 0 }}>
                  {statusStyles[member.status].label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 10, background: deptColors[member.department].bg, color: deptColors[member.department].color }}>
                  {member.department}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--bg3)', color: shiftColors[member.shift] }}>
                  {member.shift} · {member.shiftTime}
                </span>
              </div>
              {member.tasksToday > 0 && (
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  {member.tasksToday} task{member.tasksToday > 1 ? 's' : ''} today
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="staff-detail fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 18 }}>Staff Profile</span>
            <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 12 }} onClick={() => setSelected(null)}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent)', color: '#1a1200', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials(selected.name)}
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>{selected.role}</div>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 12px', borderRadius: 10, background: statusStyles[selected.status].bg, color: statusStyles[selected.status].color }}>
              {statusStyles[selected.status].label}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {([
              ['ID',          selected.id],
              ['Department',  selected.department],
              ['Shift',       `${selected.shift} · ${selected.shiftTime}`],
              ['Phone',       selected.phone],
              ['Email',       selected.email],
              ['Joined',      selected.joinDate],
              ['Tasks Today', String(selected.tasksToday)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 500, maxWidth: 150, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>Edit Profile</button>
            <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>View Tasks</button>
            <button className="btn btn-danger" style={{ justifyContent: 'center' }}>Mark Leave</button>
          </div>
        </div>
      )}
    </div>
  )
}