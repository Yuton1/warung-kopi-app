import { useEffect, useState } from 'react'
import { getProducts } from './services/api'

function App() {
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [tableNumber, setTableNumber] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts()
      setMenu(data)
    }
    fetchData()
  }, [])

  // Fungsi Tambah ke Keranjang
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Hitung Total Harga
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-orange-50 p-6 pb-32"> {/* pb-32 agar tidak tertutup keranjang bawah */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-coffee-dark mb-2">Warung Kopi Kami ☕</h1>
        
        {/* Input Nomor Meja */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <label className="font-bold text-coffee-medium">Nomor Meja:</label>
          <input 
            type="number" 
            placeholder="0"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-16 p-2 rounded-lg border-2 border-coffee-light focus:outline-none focus:border-coffee-dark text-center font-bold"
          />
        </div>
      </header>

      {/* Daftar Menu */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {menu.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-3xl shadow-lg border border-orange-100">
            <div className="h-40 bg-coffee-light rounded-2xl mb-4 flex items-center justify-center text-white text-4xl">
              ☕
            </div>
            <h3 className="text-xl font-bold text-coffee-dark uppercase">{item.name}</h3>
            <p className="text-gray-500 text-sm my-2">{item.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-black text-coffee-medium">
                Rp {Number(item.price).toLocaleString('id-ID')}
              </span>
              <button 
                onClick={() => addToCart(item)}
                className="bg-coffee-dark text-white px-6 py-2 rounded-full font-semibold hover:bg-black transition"
              >
                + Tambah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart (Keranjang Melayang) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-6 rounded-t-3xl max-w-4xl mx-auto border border-orange-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Meja: <span className="font-bold text-coffee-dark">{tableNumber || '-'}</span></p>
              <p className="text-xl font-bold text-coffee-dark">
                Total: Rp {totalPrice.toLocaleString('id-ID')} ({cart.length} Item)
              </p>
            </div>
            <button 
              disabled={!tableNumber}
              className={`px-10 py-3 rounded-2xl font-bold text-white transition ${tableNumber ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {tableNumber ? 'Pesan Sekarang' : 'Isi No. Meja dulu'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App