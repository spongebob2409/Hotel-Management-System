import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'

export default function Login() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore(s => s.setAuth)
  const [email,    setEmail]    = useState('admin@aurum.com')
  const [password, setPassword] = useState('admin123')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(email, password)
      setAuth(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, color: 'var(--accent)' }}>⬡</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26 }}>Aurum Hotel OS</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Sign in to continue</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          {error && <div style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</div>}
          <button className="btn btn-primary"
            style={{ justifyContent: 'center', marginTop: 4, opacity: loading ? .7 : 1 }}
            onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}