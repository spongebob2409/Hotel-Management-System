import api from './axios'

export const guestsApi = {
  getAll:    (search?: string) => api.get('/guests', { params: { search } }),
  getOne:    (id: string)      => api.get(`/guests/${id}`),
  updateVip: (id: string, vipStatus: boolean) => api.patch(`/guests/${id}/vip`, { vipStatus }),
}