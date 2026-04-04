import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import Bookings from './pages/bookings/Bookings'
import NewBooking from './pages/bookings/NewBooking'
import BookingDetail from './pages/bookings/BookingDetail'
import Guests from './pages/guests/Guests'
import GuestDetail from './pages/guests/GuestDetail'
import Rooms from './pages/rooms/Rooms'
import Billing from './pages/billing/Billing'
import Login from './pages/auth/Login' 
import IoT from './pages/iot/IoT' 
import Housekeeping from './pages/housekeeping/Housekeeping'
import Staff from './pages/staff/Staff'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="iot" element={<IoT />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/new" element={<NewBooking />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="guests" element={<Guests />} />
          <Route path="guests/:id" element={<GuestDetail />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="billing" element={<Billing />} />
          <Route path="housekeeping" element={<Housekeeping />} />
          <Route path="staff" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}