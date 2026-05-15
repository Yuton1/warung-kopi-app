import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell flex flex-col min-h-screen bg-[#F5EBE0]">
      <CustomerNavbar />
      <main className="flex-grow w-full">
        <div className="mx-auto w-full max-w-[1860px] px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout
