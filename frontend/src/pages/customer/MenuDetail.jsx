import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, BadgeInfo, Clock3, ShoppingCart, Star } from 'lucide-react'
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
      <main className="min-h-screen bg-[#F3E9DD]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-[28px] border border-[#e2ccbb] bg-white px-6 py-5 text-[#4A3728] shadow-lg">
            Memuat detail menu...
          </div>
        </div>
      </main>
    )
  }

  if (error || !displayProduct) {
    return (
      <main className="min-h-screen bg-[#F3E9DD]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-[32px] border border-[#e2ccbb] bg-white p-8 shadow-lg">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
            <p className="mt-4 text-lg font-bold text-red-600">{error || 'Menu tidak ditemukan.'}</p>
          </div>
        </div>
      </main>
    )
  }

  const imageUrl = displayProduct.image_url || displayProduct.image || '/Gambar_Login.jpg'

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await addCartItem(displayProduct, 1)
      navigate('/cart')
    } catch (cartError) {
      console.error('Gagal menambahkan ke keranjang:', cartError)
      alert(cartError?.response?.data?.error || cartError.message || 'Gagal menambahkan menu ke keranjang.')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F3E9DD]">
      <ImageSection product={{ ...displayProduct, image: imageUrl }} />

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[32px] border border-[#e2ccbb] bg-white p-6 shadow-[0_20px_50px_rgba(74,55,40,0.08)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF6E00]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6E00]">
              <BadgeInfo className="h-3.5 w-3.5" />
              Detail Menu
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#4A3728]">
              {displayProduct.name}
            </h1>
            <p className="mt-3 text-base leading-8 text-[#6f6257]">
              {displayProduct.description || 'Deskripsi menu belum tersedia.'}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoChip label="Kategori" value={displayProduct.category || '-'} />
              <InfoChip label="Badge" value={displayProduct.badge || '-'} />
              <InfoChip label="Harga" value={formatRupiah(displayProduct.price)} />
              <InfoChip label="Stok" value={`${displayProduct.stock ?? 0} item`} />
            </div>
          </article>

          <aside className="rounded-[32px] border border-[#e2ccbb] bg-[#fff7ee] p-6 shadow-[0_20px_50px_rgba(74,55,40,0.06)]">
            <div className="rounded-[28px] bg-[#4A3728] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">Harga Menu</p>
              <strong className="mt-2 block text-4xl">{formatRupiah(displayProduct.price)}</strong>
              <p className="mt-2 text-sm text-white/75">Langsung pilih menu ini untuk melanjutkan pemesanan.</p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm">
                <Star className="h-5 w-5 text-[#FF6E00]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8c7661]">Poin</p>
                  <strong className="text-[#4A3728]">{displayProduct.points || 0} poin</strong>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm">
                <Clock3 className="h-5 w-5 text-[#FF6E00]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8c7661]">Ketersediaan</p>
                  <strong className="text-[#4A3728]">
                    {Number(displayProduct.is_available ?? 1) ? 'Tersedia' : 'Tidak tersedia'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || !Number(displayProduct.is_available ?? 1)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF6E00] px-5 py-4 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart
                  ? 'Menambahkan...'
                  : Number(displayProduct.is_available ?? 1)
                    ? 'Tambah ke Keranjang'
                    : 'Menu Tidak Tersedia'}
              </button>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#FFC444] px-5 py-4 font-bold text-[#4A3728] shadow-lg shadow-yellow-600/10 transition hover:brightness-105"
              >
                <ShoppingCart className="h-5 w-5" />
                Kembali ke Menu
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

const InfoChip = ({ label, value }) => (
  <div className="rounded-[22px] border border-[#eddccf] bg-[#fbf3ea] px-4 py-3">
    <p className="text-[11px] uppercase tracking-[0.22em] text-[#8c7661]">{label}</p>
    <strong className="mt-1 block text-base text-[#4A3728]">{value}</strong>
  </div>
)

export default MenuDetail
