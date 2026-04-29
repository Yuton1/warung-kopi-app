import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import CemilanPage from './pages/customer/CemilanPage'
import MakananPage from './pages/customer/MakananPage'
import LocationPage from './pages/customer/LocationPage'
import MenuView from './pages/customer/MenuView'
import MinumanPage from './pages/customer/MinumanPage'
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
          <Route path="menu" element={<Navigate to="/menu/minuman" replace />} />
          <Route path="menu/minuman" element={<MinumanPage />} />
          <Route path="menu/makanan" element={<MakananPage />} />
          <Route path="menu/cemilan" element={<CemilanPage />} />
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
