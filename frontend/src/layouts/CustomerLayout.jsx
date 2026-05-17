import { Outlet } from 'react-router-dom'
import CustomerFooter from '../components/CustomerFooter'
import CustomerNavbar from '../components/CustomerNavbar'

const CustomerLayout = () => {
  return (
    // Jika warna krem latar belakang ingin diganti abu-abu terang bersih, ubah bg-[#F5EBE0] menjadi bg-[#F8F9FA]
    <div className="app-shell flex flex-col min-h-screen bg-[#F8F9FA]">
      <CustomerNavbar />
      <main className="flex-grow w-full">
        {/* KUNCI: Menghilangkan px-4 sm:px-6 lg:px-8 py-8 agar halaman bisa nempel mentok ke ujung layar */}
        <div className="mx-auto w-full max-w-[1860px]">
          <Outlet />
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout