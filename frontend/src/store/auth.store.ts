import { create } from 'zustand'

interface AuthState {
  token: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user:  any | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAuth: (token: string, user: any) => void
  logout:  () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user:  null,

  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
}))