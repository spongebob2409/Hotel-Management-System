import api from './axios'

export const billingApi = {
  getAll:     (status?: string) => api.get('/billing', { params: { status } }),
  getOne:     (id: string)      => api.get(`/billing/${id}`),
  getSummary: ()                => api.get('/billing/summary'),
  markPaid:   (id: string, paymentMethod?: string) =>
    api.patch(`/billing/${id}/pay`, { paymentMethod }),
}