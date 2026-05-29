import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, BadgeInfo, Clock3, ShoppingCart, Star, CheckCircle2, Coffee } from 'lucide-react'
import ImageSection from './MenuDetail/ImageSection'
import { coffeeSeed } from '../../data/menuSeed'
import { getApiBaseUrl } from '../../utils/apiBaseUrl'
import { formatRupiah } from '../../utils/formatRupiah'
import { addCartItem } from '../../services/cartService'

const MenuDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(!location.state?.product)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const API_BASE_URL = getApiBaseUrl()
  const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/products` : '/api/products'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(`${API_URL}/${id}`)
        setProduct(response.data || null)
      } catch (fetchError) {
        console.error('Gagal memuat detail menu:', fetchError)
        const fallback =
          coffeeSeed.find((item) => String(item.id) === String(id)) ||
          location.state?.product ||
          null

        if (fallback) {
          setProduct(fallback)
        } else {
          setError('Menu tidak ditemukan atau gagal dimuat.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (!product && id) {
      fetchProduct()
    } else {
      setLoading(false)
    }
  }, [API_URL, id, location.state?.product, product])

  const displayProduct = useMemo(() => {
    return product || location.state?.product || coffeeSeed.find((item) => String(item.id) === String(id)) || null
  }, [id, location.state?.product, product])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3E9DD] flex items-center justify-center">
        <div className="animate-bounce rounded-[28px] border border-[#e2ccbb] bg-white px-8 py-6 text-[#4A3728] font-bold shadow-xl flex items-center gap-3">
          <Coffee className="animate-spin text-[#FF6E00]" />
          Sedang menyeduh detail menu...
        </div>
      </main>
    )
  }

  if (error || !displayProduct) {
    return (
      <main className="min-h-screen bg-[#f3dddd] px-4 py-12">
        <div className="mx-auto w-full max-w-xl rounded-[32px] border border-[#e2ccbb] bg-white p-8 shadow-lg text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:text-[#FF6E00] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
          </Link>
          <p className="mt-6 text-lg font-bold text-red-600">{error || 'Menu tidak ditemukan.'}</p>
        </div>
      </main>
    )
  }

  const imageUrl = displayProduct.image_url || displayProduct.image || '/Gambar_Login.jpg'

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await addCartItem(displayProduct, 1)
      
      setShowFeedback(true)
      setTimeout(() => {
        setShowFeedback(false)
        navigate('/cart')
      }, 1600)
    } catch (cartError) {
      console.error('Gagal menambahkan ke keranjang:', cartError)
      alert(cartError?.response?.data?.error || cartError.message || 'Gagal menambahkan menu ke keranjang.')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <main className="w-full relative flex flex-col pb-12">
      
      {/* ANIMASI FEEDBACK POP-UP */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-[32px] border-2 border-[#e2ccbb] bg-white p-8 text-center shadow-2xl max-w-xs mx-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-xl font-black text-[#4A3728]">Berhasil Masuk!</h3>
            <p className="mt-2 text-sm text-[#7c6a5c]">{displayProduct.name} telah ditambahkan ke keranjang belanjamu.</p>
          </div>
        </div>
      )}

      {/* BANNER KARTU: Wadah utama gambar */}
      <div className="w-full overflow-hidden rounded-2xl shadow-sm bg-[#4A3728]">
        {/* ✨ PERBAIKAN DI SINI:
          Tinggi banner dinaikkan dari h-80 ke h-[420px] (pada layar desktop md:) 
          agar porsi gambar minuman tampil jauh lebih luas, proporsional, dan tidak terlihat sempit terpotong.
        */}
        <section className="w-full h-64 md:h-[420px] relative">
          {/* Tombol Back Melayang */}
          <div className="absolute top-4 left-4 z-30">
            <Link 
              to="/" 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#4A3728] shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <ImageSection product={{ ...displayProduct, image: imageUrl }} />
        </section>
      </div>

      {/* GRID KONTEN SEJAJAR BANNER */}
      <section className="w-full mt-6 relative z-20">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          
          {/* SISI KIRI: Detail Informasi Kopi */}
          <article className="rounded-[32px] border border-[#e2ccbb] bg-white p-6 md:p-8 shadow-[0_20px_50px_rgba(74,55,40,0.06)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6E00]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6E00]">
              <BadgeInfo className="h-3.5 w-3.5" />
              Detail Menu Premium
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight text-[#4A3728]">
              {displayProduct.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#6f6257] text-justify">
              {displayProduct.description || 'Seduhan barista terbaik kami menggunakan biji kopi pilihan beraroma khas yang siap menemani aktivitas produktif harianmu.'}
            </p>

            <div className="mt-8 grid gap-4 grid-cols-2">
              <InfoChip label="Kategori" value={displayProduct.category || 'Coffee'} />
              <InfoChip label="Badge" value={displayProduct.badge || '-'} />
              <InfoChip label="Harga" value={formatRupiah(displayProduct.price)} primary />
              <InfoChip label="Sisa Stok" value={`${displayProduct.stock ?? 15} Porsi`} />
            </div>
          </article>

          {/* SISI KANAN: Panel Pembayaran */}
          <aside className="space-y-4 self-start lg:sticky lg:top-6">
            <div className="rounded-[32px] border border-[#e2ccbb] bg-[#fffbf7] p-6 shadow-[0_20px_50px_rgba(74,55,40,0.04)]">
              <div className="rounded-[24px] bg-[#4A3728] p-5 text-white shadow-inner relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white pointer-events-none">
                  <Coffee size={120} />
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Total Pembayaran</p>
                <strong className="mt-1 block text-3xl md:text-4xl font-black text-[#FFC444]">{formatRupiah(displayProduct.price)}</strong>
                <p className="mt-2 text-xs text-white/70">Langsung pilih menu ini untuk melanjutkan pemesanan.</p>
              </div>

              {/* Status & Point Indicators */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-[#f0e2d5] shadow-sm">
                  <div className="p-2 rounded-xl bg-orange-50"><Star className="h-4 w-4 text-[#FF6E00]" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#a08c7c]">Poin Member</p>
                    <strong className="text-sm text-[#4A3728]">+{displayProduct.points || 0} Poin</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-[#f0e2d5] shadow-sm">
                  <div className="p-2 rounded-xl bg-orange-50"><Clock3 className="h-4 w-4 text-[#FF6E00]" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#a08c7c]">Ketersediaan</p>
                    <strong className="text-sm text-[#4A3728]">
                      {Number(displayProduct.is_available ?? 1) ? 'Tersedia' : 'Habis'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !Number(displayProduct.is_available ?? 1)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#FF6E00] px-5 py-4 font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:bg-[#e56300] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart ? 'Menambahkan...' : Number(displayProduct.is_available ?? 1) ? 'Tambah ke Keranjang' : 'Menu Tidak Tersedia'}
                </button>
                
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#FFC444] px-5 py-4 font-bold text-[#4A3728] shadow-md transition-all duration-200 hover:brightness-105"
                >
                  Kembali Pilih Menu
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

const InfoChip = ({ label, value, primary = false }) => (
  <div className={`rounded-[20px] border px-4 py-3.5 ${primary ? 'border-[#FF6E00]/30 bg-orange-50/50' : 'border-[#eddccf] bg-[#fbf3ea]'}`}>
    <p className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#8c7661]">{label}</p>
    <strong className={`mt-1 block text-base ${primary ? 'text-[#FF6E00] font-black' : 'text-[#4A3728]'}`}>{value}</strong>
  </div>
)

export default MenuDetail