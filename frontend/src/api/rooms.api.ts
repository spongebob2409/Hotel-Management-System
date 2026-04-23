import api from './axios'

export const roomsApi = {
  getAll:        (status?: string) => api.get('/rooms', { params: { status } }),
  getOne:        (id: string)      => api.get(`/rooms/${id}`),
  updateStatus:  (id: string, status: string) => api.patch(`/rooms/${id}/status`, { status }),
  seed:          ()                => api.post('/rooms/seed'),
}