import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout