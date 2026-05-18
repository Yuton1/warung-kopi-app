import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell flex flex-col min-h-screen bg-[#F8F9FA]">
      {/* Navbar di atas */}
      <CustomerNavbar />
      
      {/* Konten Utama Web */}
      <main className="flex-grow w-full">
        <div className="mx-auto w-full max-w-[1860px] px-4 sm:px-6 lg:px-12 py-6 md:py-10 transition-all duration-300">
          <Outlet />
        </div>
      </main>
      
      {/* Footer di bawah */}
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout