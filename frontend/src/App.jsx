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
import MemberPage from './pages/customer/MemberPage'
import ProfilePage from './pages/customer/ProfilePage'
import PromoPage from './pages/customer/PromoPage'
import PesananPage from './pages/customer/Pesanan/PesananPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import MenuManagement from './pages/admin/MenuManagement'
import MenuEdit from './pages/admin/MenuEdit/MenuEdit'
import UserManagement from './pages/admin/UserManagement';
import LoyaltyRewards from './pages/admin/LoyaltyRewards';
import SalesReports from './pages/admin/SalesReports';
import BannerManagement from './pages/admin/BannerManagement';
import OrderQueue from './pages/barista/OrderQueue';
import Inventory from './pages/barista/Inventory';
import BaristaDailyReport from './pages/barista/report';
import CartPage from './pages/customer/CartPage';
import MenuDetail from './pages/customer/MenuDetail';
import ConfirmPesanan from './pages/customer/confirmpesanan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* ADMIN ROUTES - Management System */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/menu" element={<MenuManagement />} />
        <Route path="admin/menu/edit/:id" element={<MenuEdit />} />
        <Route path="admin/banner" element={<BannerManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/rewards" element={<LoyaltyRewards />} />
        <Route path="/admin/reports" element={<SalesReports />} />
        
        {/* BARISTA ROUTES - Operational System */}
        <Route path="/barista" element={<Navigate to="/barista/order-queue" replace />} />
        <Route path="/barista/order-queue" element={<OrderQueue />} />
        <Route path="/barista/inventory" element={<Inventory />} />
        <Route path="/barista/report" element={<BaristaDailyReport />} />

        {/* CUSTOMER ROUTES - Mobile/User View */}
        <Route element={<CustomerLayout />}>
          <Route index element={<MenuView />} />
          <Route path="menu" element={<Navigate to="/menu/minuman" replace />} />
          <Route path="menu/minuman" element={<MinumanPage />} />
          <Route path="menu/makanan" element={<MakananPage />} />
          <Route path="menu/cemilan" element={<CemilanPage />} />
          <Route path="member" element={<MemberPage />} />
          <Route path="akun" element={<ProfilePage />} />
          <Route path="pesanan" element={<PesananPage />} />
          <Route path="confirm-pesanan" element={<ConfirmPesanan />} />
          <Route path="confirmpesanan" element={<ConfirmPesanan />} />
          <Route path="promo" element={<PromoPage />} />
          <Route path="lokasi" element={<LocationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="menu/minuman" element={<MinumanPage />} />
          <Route path="menu/:id" element={<MenuDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
