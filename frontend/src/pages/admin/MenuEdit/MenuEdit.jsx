import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Camera, Image as ImageIcon, Save, ToggleLeft, ToggleRight } from 'lucide-react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import { getApiBaseUrl } from '../../../utils/apiBaseUrl'
import { formatRupiah } from '../../../utils/formatRupiah'
import { getImageFileError, readImageFileAsDataUrl } from '../../../utils/imageUpload'

const categoryOptions = [
  { value: 'coffee', label: 'Coffee' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'meal', label: 'Makanan' },
  { value: 'snack', label: 'Cemilan' },
]

const emptyForm = {
  name: '',
  initials: '',
  description: '',
  price: '',
  base_points: '',
  category: 'coffee',
  badge: '',
  image_url: '',
  stock: '',
  is_available: true,
}

const buildInitials = (value) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

const MenuEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')
  const [imageName, setImageName] = useState('')

  const API_BASE_URL = getApiBaseUrl()
  const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/products` : '/api/products'

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(`${API_URL}/${id}`)
        const product = response.data || {}

        setForm({
          name: product.name || '',
          initials: product.initials || buildInitials(product.name),
          description: product.description || '',
          price: String(product.price ?? ''),
          base_points: String(product.base_points ?? ''),
          category: product.category || 'coffee',
          badge: product.badge || '',
          image_url: product.image_url || '',
          stock: String(product.stock ?? ''),
          is_available: Boolean(Number(product.is_available ?? 1)),
        })
        setImageName(product.image_url ? 'Gambar tersimpan' : '')
      } catch (fetchError) {
        console.error('Gagal memuat menu:', fetchError)
        setError(fetchError.response?.data?.message || 'Menu tidak ditemukan atau gagal dimuat.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMenu()
    }
  }, [API_URL, id])

  const previewPrice = useMemo(() => Number(form.price) || 0, [form.price])
  const previewPoints = useMemo(() => {
    const basePoints = Number(form.base_points)
    if (Number.isFinite(basePoints)) return basePoints
    return Math.floor(previewPrice / 1000)
  }, [form.base_points, previewPrice])

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    const uploadError = getImageFileError(file)

    if (uploadError) {
      setImageError(uploadError)
      setImageName('')
      setForm((prev) => ({ ...prev, image_url: '' }))
      event.target.value = ''
      return
    }

    if (!file) return

    try {
      setImageError('')
      const dataUrl = await readImageFileAsDataUrl(file)
      setImageName(file.name)
      setForm((prev) => ({ ...prev, image_url: dataUrl }))
    } catch (readError) {
      console.error(readError)
      setImageError('Gagal membaca file gambar.')
      setImageName('')
      setForm((prev) => ({ ...prev, image_url: '' }))
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      initials: form.initials.trim() || buildInitials(form.name),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      base_points: Number.isFinite(Number(form.base_points))
        ? Number(form.base_points)
        : Math.floor((Number(form.price) || 0) / 1000),
      category: form.category,
      badge: form.badge.trim(),
      image_url: form.image_url.trim(),
      stock: Number(form.stock) || 0,
      is_available: form.is_available ? 1 : 0,
    }

    try {
      await axios.put(`${API_URL}/${id}`, payload)
      navigate('/admin/menu', {
        replace: true,
        state: { toast: 'Menu berhasil diperbarui.' },
      })
    } catch (saveError) {
      console.error('Gagal menyimpan menu:', saveError)
      const serverMessage =
        saveError.response?.data?.error ||
        saveError.response?.data?.message ||
        'Gagal memperbarui menu.'
      setError(serverMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8f4ee] lg:flex-row">
        <Sidebar role="admin" />
        <main className="w-full flex-1 p-4 sm:p-6 lg:ml-72 lg:p-8">
          <div className="rounded-[32px] border border-[#e7d7c8] bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-[#4a3728]">Memuat data menu...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error && !form.name) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8f4ee] lg:flex-row">
        <Sidebar role="admin" />
        <main className="w-full flex-1 p-4 sm:p-6 lg:ml-72 lg:p-8">
          <div className="rounded-[32px] border border-[#e7d7c8] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/admin/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
            </div>
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f4ee] lg:flex-row">
      <Sidebar role="admin" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Menu Management
            </Link>
            <h1 className="mt-3 text-3xl font-black text-[#2c1b0e]">Edit Menu</h1>
            <p className="mt-1 text-sm text-[#6f6257]">
              Perbarui data produk sesuai struktur TiDB yang tersimpan di tabel `products`.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8c7661]">Preview Harga</p>
            <strong className="block text-2xl text-[#2c1b0e]">{formatRupiah(previewPrice)}</strong>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-[#e7d7c8] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#8c7661]">Product Data</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#2c1b0e]">Form Edit Menu</h2>
              </div>
              <div className="rounded-2xl bg-[#f8efe4] px-4 py-2 text-sm font-semibold text-[#8b5e34]">
                ID #{id}
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-[#4a3728]">Nama Menu</span>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="Contoh: Iced Americano"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-[#4a3728]">Initials</span>
                  <input
                    required
                    type="text"
                    value={form.initials}
                    onChange={handleChange('initials')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 uppercase outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="IA"
                    maxLength={4}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-[#4a3728]">Kategori</span>
                  <select
                    value={form.category}
                    onChange={handleChange('category')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-[#4a3728]">Harga (Rp)</span>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={handleChange('price')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="23000"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-[#4a3728]">Base Points</span>
                  <input
                    type="number"
                    value={form.base_points}
                    onChange={handleChange('base_points')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="23"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-[#4a3728]">Stok</span>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={handleChange('stock')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="50"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-[#4a3728]">Badge</span>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={handleChange('badge')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="Best Seller"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-[#4a3728]">Deskripsi</span>
                  <textarea
                    rows="4"
                    value={form.description}
                    onChange={handleChange('description')}
                    className="w-full rounded-2xl border border-[#ead9ca] px-4 py-3 outline-none transition focus:border-[#e39b4f] focus:ring-2 focus:ring-[#e39b4f]/20"
                    placeholder="Deskripsi singkat produk"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-[#4a3728]">Gambar Menu</span>
                  <div className="rounded-2xl border border-dashed border-[#ead9ca] bg-[#fffaf5] p-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#e39b4f]/20 bg-white px-4 py-3 text-sm font-bold text-[#8b5e34] transition hover:bg-[#fff8ef]">
                      <Camera className="h-4 w-4" />
                      Upload gambar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    <p className="mt-2 text-xs text-[#8c7661]">Format gambar saja. Maksimal 2 MB.</p>

                    {imageError ? (
                      <p className="mt-2 text-sm font-medium text-red-600">{imageError}</p>
                    ) : null}

                    {form.image_url ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-[#ead9ca] bg-white">
                        <img
                          src={form.image_url}
                          alt={imageName || form.name || 'Preview menu'}
                          className="h-56 w-full object-cover"
                        />
                        <div className="flex items-center justify-between gap-3 border-t border-[#f1e6da] px-4 py-3 text-xs text-[#7b6a5b]">
                          <span className="truncate">{imageName || 'Gambar tersimpan'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, image_url: '' }))
                              setImageName('')
                            }}
                            className="font-bold text-[#e39b4f] hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 grid h-56 place-items-center rounded-2xl border border-dashed border-[#ead9ca] bg-white text-center text-sm text-[#a78c78]">
                        <div>
                          <ImageIcon className="mx-auto mb-2 h-5 w-5" />
                          Belum ada gambar. Upload file untuk preview.
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#faf3eb] px-5 py-4">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, is_available: !prev.is_available }))}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#4a3728]"
                >
                  {form.is_available ? (
                    <ToggleRight className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                  {form.is_available ? 'Menu tersedia' : 'Menu disembunyikan'}
                </button>

                <div className="text-right text-sm text-[#7b6a5b]">
                  <p>
                    Base points preview: <strong className="text-[#4a3728]">{previewPoints}</strong>
                  </p>
                  <p>
                    Status: <strong className="text-[#4a3728]">{form.is_available ? 'Aktif' : 'Nonaktif'}</strong>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e39b4f] px-6 py-4 font-bold text-white shadow-lg shadow-orange-900/15 transition hover:bg-[#c9863e] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </section>

          <section className="rounded-[32px] border border-[#e7d7c8] bg-gradient-to-br from-[#fff8f0] to-[#f6e8da] p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8c7661]">Preview Card</p>
            <div className="mt-4 overflow-hidden rounded-[30px] bg-white shadow-[0_20px_40px_rgba(45,25,15,0.08)]">
              <div className="h-44 bg-gradient-to-br from-[#5d4037] to-[#2b1b17] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/15 p-3 text-center text-2xl font-black text-white">
                    {form.initials || buildInitials(form.name) || 'WK'}
                  </div>
                  <div className="rounded-2xl bg-[#ff8c1a] px-4 py-2 text-right text-white">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/75">Stock</p>
                    <strong className="block text-xl">{form.stock || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c7661]">
                  {form.category}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#2c1b0e]">{form.name || 'Nama menu'}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6f6257]">
                  {form.description || 'Deskripsi menu akan tampil di sini.'}
                </p>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#f8efe4] px-4 py-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Price</p>
                    <strong className="block text-lg text-[#2c1b0e]">{formatRupiah(previewPrice)}</strong>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7661]">Base Points</p>
                    <strong className="block text-lg text-[#2c1b0e]">{previewPoints}</strong>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f8efe4] px-3 py-1 text-xs font-semibold text-[#8b5e34]">
                    {form.badge || 'No badge'}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                    {form.is_available ? 'Available' : 'Hidden'}
                  </span>
                </div>

                {/* Preview gambar sudah ditampilkan di form sebelah kiri */}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default MenuEdit
