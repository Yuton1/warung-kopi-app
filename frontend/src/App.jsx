import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import LocationPage from './pages/customer/LocationPage'
import MenuView from './pages/customer/MenuView'
import OrdersPage from './pages/customer/OrdersPage'
import ProfilePage from './pages/customer/ProfilePage'
import PromoPage from './pages/customer/PromoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
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
