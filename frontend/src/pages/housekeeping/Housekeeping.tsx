import { useState } from 'react'
import './Housekeeping.css'

type TaskStatus = 'pending' | 'in-progress' | 'done'
type Priority = 'high' | 'medium' | 'low'

interface Task {
  id: string
  room: string
  floor: number
  type: string
  assignedTo: string
  priority: Priority
  status: TaskStatus
  note?: string
  createdAt: string
}

const initialTasks: Task[] = [
  { id: 'HK-001', room: '103', floor: 1, type: 'Full Clean',      assignedTo: 'Rina Akter',    priority: 'high',   status: 'pending',     note: 'Guest checked out, prepare for new arrival at 2PM', createdAt: '09:00 AM' },
  { id: 'HK-002', room: '205', floor: 2, type: 'Full Clean',      assignedTo: 'Karim Mia',     priority: 'high',   status: 'in-progress', note: 'Post checkout deep clean',                          createdAt: '09:10 AM' },
  { id: 'HK-003', room: '403', floor: 4, type: 'Full Clean',      assignedTo: 'Nasrin Begum',  priority: 'medium', status: 'pending',     createdAt: '09:15 AM' },
  { id: 'HK-004', room: '312', floor: 3, type: 'Towel Change',    assignedTo: 'Rina Akter',    priority: 'low',    status: 'done',        createdAt: '08:30 AM' },
  { id: 'HK-005', room: '204', floor: 2, type: 'Minibar Restock', assignedTo: 'Sujon Ahmed',   priority: 'medium', status: 'done',        createdAt: '08:45 AM' },
  { id: 'HK-006', room: '106', floor: 1, type: 'Maintenance',     assignedTo: 'Babul Hossain', priority: 'high',   status: 'in-progress', note: 'AC unit not cooling properly',                      createdAt: '08:00 AM' },
  { id: 'HK-007', room: '401', floor: 4, type: 'Towel Change',    assignedTo: 'Nasrin Begum',  priority: 'low',    status: 'pending',     createdAt: '09:20 AM' },
  { id: 'HK-008', room: '315', floor: 3, type: 'Maintenance',     assignedTo: 'Babul Hossain', priority: 'high',   status: 'pending',     note: 'Broken wardrobe door hinge',                        createdAt: '07:50 AM' },
  { id: 'HK-009', room: '202', floor: 2, type: 'Minibar Restock', assignedTo: 'Sujon Ahmed',   priority: 'low',    status: 'done',        createdAt: '08:20 AM' },
  { id: 'HK-010', room: '302', floor: 3, type: 'Full Clean',      assignedTo: 'Karim Mia',     priority: 'medium', status: 'pending',     createdAt: '09:30 AM' },
]

const staffOptions = ['Rina Akter', 'Karim Mia', 'Nasrin Begum', 'Sujon Ahmed', 'Babul Hossain']

const priorityColors: Record<Priority, string> = {
  high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)',
}
const priorityBg: Record<Priority, string> = {
  high: '#3d1a1a', medium: '#3d2c1a', low: '#1a3d2e',
}
const statusCols: Record<TaskStatus, { label: string; color: string }> = {
  'pending':     { label: 'Pending',     color: 'var(--muted)' },
  'in-progress': { label: 'In Progress', color: 'var(--info)' },
  'done':        { label: 'Done',        color: 'var(--success)' },
}

export default function Housekeeping() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [staffFilter, setStaffFilter] = useState('All Staff')
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({
    room: '', type: 'Full Clean',
    assignedTo: staffOptions[0],
    priority: 'medium' as Priority,
    note: '',
  })

  const allStaff = ['All Staff', ...staffOptions]
  const filtered = staffFilter === 'All Staff' ? tasks : tasks.filter(t => t.assignedTo === staffFilter)
  const cols: TaskStatus[] = ['pending', 'in-progress', 'done']

  const moveTask = (id: string, status: TaskStatus) =>
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t))

  const addTask = () => {
    if (!newTask.room) return
    const task: Task = {
      id: `HK-${String(tasks.length + 1).padStart(3, '0')}`,
      floor: Math.floor(parseInt(newTask.room) / 100),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setTasks(ts => [task, ...ts])
    setShowModal(false)
    setNewTask({ room: '', type: 'Full Clean', assignedTo: staffOptions[0], priority: 'medium', note: '' })
  }

  return (
    <div>
      <div className="page-header fade-up">
        <div>
          <h1 className="page-title">Housekeeping</h1>
          <p className="page-subtitle">{tasks.filter(t => t.status !== 'done').length} active tasks</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={staffFilter} onChange={e => setStaffFilter(e.target.value)} style={{ width: 160 }}>
            {allStaff.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
        </div>
      </div>

      {/* Summary row */}
      <div className="hk-summary fade-up-2">
        {cols.map(col => (
          <div key={col} className="card hk-stat">
            <div style={{ fontSize: 11, color: statusCols[col].color, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500, marginBottom: 4 }}>
              {statusCols[col].label}
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 28 }}>
              {filtered.filter(t => t.status === col).length}
            </div>
          </div>
        ))}
        <div className="card hk-stat">
          <div style={{ fontSize: 11, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500, marginBottom: 4 }}>
            High Priority
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 28 }}>
            {filtered.filter(t => t.priority === 'high' && t.status !== 'done').length}
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="kanban fade-up-3">
        {cols.map(col => (
          <div key={col} className="kanban-col">
            <div className="kanban-col-header">
              <span style={{ color: statusCols[col].color }}>{statusCols[col].label}</span>
              <span className="badge badge-muted">{filtered.filter(t => t.status === col).length}</span>
            </div>
            <div className="kanban-cards">
              {filtered.filter(t => t.status === col).map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-top">
                    <span className="task-id">{task.id}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
                      background: priorityBg[task.priority], color: priorityColors[task.priority],
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="task-title">
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Room {task.room}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 6 }}>Floor {task.floor}</span>
                  </div>
                  <div className="task-type">{task.type}</div>
                  {task.note && <div className="task-note">{task.note}</div>}
                  <div className="task-footer">
                    <div className="task-avatar">
                      {task.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{task.assignedTo}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>{task.createdAt}</span>
                  </div>
                  <div className="task-actions">
                    {col !== 'pending'     && <button className="task-move-btn" onClick={() => moveTask(task.id, 'pending')}>← Pending</button>}
                    {col !== 'in-progress' && <button className="task-move-btn" onClick={() => moveTask(task.id, 'in-progress')}>In Progress</button>}
                    {col !== 'done'        && <button className="task-move-btn task-done-btn" onClick={() => moveTask(task.id, 'done')}>✓ Done</button>}
                  </div>
                </div>
              ))}
              {filtered.filter(t => t.status === col).length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', padding: '24px 0', border: '1px dashed var(--border)', borderRadius: 8 }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New task modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 20 }}>New Task</span>
              <button className="btn btn-ghost" style={{ padding: '3px 10px' }} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Room Number *</label>
                <input type="text" placeholder="e.g. 204"
                  value={newTask.room} onChange={e => setNewTask(n => ({ ...n, room: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Task Type</label>
                <select value={newTask.type} onChange={e => setNewTask(n => ({ ...n, type: e.target.value }))}>
                  {['Full Clean', 'Towel Change', 'Minibar Restock', 'Maintenance', 'Inspection'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Assign To</label>
                <select value={newTask.assignedTo} onChange={e => setNewTask(n => ({ ...n, assignedTo: e.target.value }))}>
                  {staffOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Priority</label>
                <select value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value as Priority }))}>
                  {(['high', 'medium', 'low'] as Priority[]).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Note (optional)</label>
                <textarea rows={2} value={newTask.note}
                  onChange={e => setNewTask(n => ({ ...n, note: e.target.value }))}
                  placeholder="Additional instructions…"
                  style={{ resize: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none', fontFamily: 'var(--font-body)' }} />
              </div>
              <button className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }} onClick={addTask}>
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}