import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    <div className="app-shell flex flex-col min-h-screen bg-[#F8F9FA] text-white antialiased selection:bg-orange-500 selection:text-white">
      <CustomerNavbar />

      <main className="flex-grow w-full flex flex-col">
        {/* max-w-[1860px] diturunkan sedikit ke 1600px agar layout di layar ultra-wide tidak terlalu renggang */}
        <div className="mx-auto w-full max-w-[1860px] flex-grow flex flex-col px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-10 transition-all duration-300">
          <Outlet />
        </div>
      </main>
      
      {/* Footer di bawah */}
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout