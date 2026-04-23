import api from './axios'

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),

  getMe: () => api.get('/auth/me'),
}