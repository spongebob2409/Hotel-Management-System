import api from './axios'

export const bookingsApi = {
  getAll:   (status?: string) => api.get('/bookings', { params: { status } }),
  getOne:   (id: string)      => api.get(`/bookings/${id}`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create:   (data: any)       => api.post('/bookings', data),
  checkIn:  (id: string)      => api.patch(`/bookings/${id}/checkin`),
  checkOut: (id: string)      => api.patch(`/bookings/${id}/checkout`),
  cancel:   (id: string)      => api.patch(`/bookings/${id}/cancel`),
}