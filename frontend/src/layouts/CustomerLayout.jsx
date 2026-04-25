import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell">
      <CustomerNavbar />
      <main className="app-main">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout
