import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import LocationPage from './pages/customer/LocationPage'
import MenuView from './pages/customer/MenuView'
import OrdersPage from './pages/customer/OrdersPage'
import ProfilePage from './pages/customer/ProfilePage'
import PromoPage from './pages/customer/PromoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route index element={<MenuView />} />
          <Route path="akun" element={<ProfilePage />} />
          <Route path="pesanan" element={<OrdersPage />} />
          <Route path="promo" element={<PromoPage />} />
          <Route path="lokasi" element={<LocationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
