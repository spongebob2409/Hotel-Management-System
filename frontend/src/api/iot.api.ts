import api from './axios'

export const iotApi = {
  getEvents:       (limit?: number) => api.get('/iot/events', { params: { limit } }),
  getSensors:      ()               => api.get('/iot/sensors'),
  getParking:      ()               => api.get('/iot/parking'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendEvent:       (data: any)      => api.post('/iot/event', data),
  resolveEvent:    (id: string)     => api.patch(`/iot/events/${id}/resolve`),
}