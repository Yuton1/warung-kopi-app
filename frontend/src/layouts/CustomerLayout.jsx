import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-grow w-full">
        <div className="mx-auto w-full max-w-[1860px]">
          <Outlet />
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout
