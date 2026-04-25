import { Outlet } from 'react-router-dom'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell">
      <CustomerNavbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerLayout

