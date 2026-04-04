import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, color: 'var(--accent)' }}>⬡</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26 }}>Aurum Hotel OS</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Sign in to your account</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email address" defaultValue="admin@aurum.com" />
          <input type="password" placeholder="Password" defaultValue="••••••••" />
          <button className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}
            onClick={() => navigate('/dashboard')}>Sign In</button>
        </div>
      </div>
    </div>
  )
}