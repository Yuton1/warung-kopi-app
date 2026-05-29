import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import { createBlankBanner, readBannerList, saveBannerList } from '../../data/bannerStorage'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Link as LinkIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

const BannerManagement = () => {
  const navigate = useNavigate()
  const auth = readStoredValue(STORAGE_KEYS.auth, null)
  const fileInputRef = useRef(null)

  const [banners, setBanners] = useState(() => readBannerList())
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState(createBlankBanner())
  const [imageFileName, setImageFileName] = useState('')
  const [imageError, setImageError] = useState('')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [auth, navigate])

  useEffect(() => {
    const syncBanners = () => setBanners(readBannerList())

    syncBanners()
    window.addEventListener('warungkopi-state-changed', syncBanners)
    window.addEventListener('storage', syncBanners)

    return () => {
      window.removeEventListener('warungkopi-state-changed', syncBanners)
      window.removeEventListener('storage', syncBanners)
    }
  }, [])

  const filteredBanners = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()

    if (!query) return banners

    return banners.filter((item) =>
      [item.title, item.subtitle, item.description, item.target_url]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [banners, searchTerm])

  const activeBannerCount = banners.length
  const bannerWithCtaCount = banners.filter((item) => Boolean(item.target_url)).length

  const resetForm = (nextBanner = createBlankBanner(), options = {}) => {
    const { clearNotice = true } = options

    setForm(nextBanner)
    setImageFileName(nextBanner.image_url ? 'Gambar tersimpan' : '')
    setImageError('')

    if (clearNotice) {
      setSuccessMessage('')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      image_url: item.image_url,
      target_url: item.target_url,
      button_label: item.button_label || 'Detail',
    })
    setImageFileName(item.image_url ? 'Gambar tersimpan' : '')
    setImageError('')
    setSuccessMessage('')
  }

  const handleDelete = (id) => {
    if (!window.confirm('Hapus banner ini?')) return

    const nextBanners = banners.filter((item) => item.id !== id)
    setBanners(saveBannerList(nextBanners))

    if (form.id === id) {
      resetForm()
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa gambar.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Ukuran gambar maksimal 2MB supaya aman disimpan di browser.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image_url: String(reader.result ?? ''),
      }))
      setImageFileName(file.name)
      setImageError('')
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.subtitle.trim() || !form.description.trim() || !form.image_url.trim() || !form.target_url.trim()) {
      setImageError('Lengkapi judul, subjudul, deskripsi, gambar, dan link tombol.')
      return
    }

    setSaving(true)

    try {
      const bannerPayload = {
        id: form.id || `banner-${Date.now()}`,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim(),
        target_url: form.target_url.trim(),
        button_label: form.button_label.trim() || 'Detail',
      }

      const nextBanners = form.id
        ? banners.map((item) => (item.id === form.id ? bannerPayload : item))
        : [bannerPayload, ...banners]

      const savedBanners = saveBannerList(nextBanners)
      setBanners(savedBanners)
      resetForm()
      setSuccessMessage(form.id ? 'Banner berhasil diperbarui.' : 'Banner baru berhasil ditambahkan.')
    } finally {
      setSaving(false)
    }
  }

  const previewBanner = {
    ...createBlankBanner(),
    ...form,
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] overflow-hidden lg:flex-row">
      <Sidebar role="admin" />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2c1b0e]">Banner Management</h1>
            <p className="text-gray-500">
              Kelola banner utama untuk customer: upload gambar, judul, subjudul, deskripsi, dan tombol menuju halaman detail.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => resetForm()}
              className="flex items-center gap-2 bg-white text-[#2c1b0e] border border-gray-200 px-5 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition"
            >
              <Plus size={18} />
              Banner Baru
            </button>
            <button
              type="button"
              onClick={() => {
                const seed = saveBannerList(readBannerList())
                setBanners(seed)
                setSuccessMessage('Data banner disegarkan dari penyimpanan saat ini.')
              }}
              className="flex items-center gap-2 bg-[#e39b4f] text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition"
            >
              <ArrowRight size={18} />
              Refresh Data
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Banner" value={String(activeBannerCount)} note="Semua banner tersimpan" />
          <StatCard title="Punya Tombol" value={String(bannerWithCtaCount)} note="Banner dengan link aktif" />
          <StatCard title="Mode Edit" value={form.id ? 'Aktif' : 'Baru'} note={form.id ? 'Sedang mengubah banner' : 'Siap menambah banner'} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 mb-8">
          <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#2c1b0e]">
                  {form.id ? 'Edit Banner' : 'Tambah Banner Baru'}
                </h2>
                <p className="text-sm text-gray-500">
                  File gambar akan disimpan sebagai data URL di browser supaya bisa langsung dipakai oleh banner customer.
                </p>
              </div>

              {form.id ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#e39b4f]">
                  <CheckCircle2 size={14} />
                  Sedang Diedit
                </span>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Upload Gambar</span>
                <div className="mt-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-24 w-full sm:w-40 rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                      {form.image_url ? (
                        <img src={form.image_url} alt="Preview banner" className="h-full w-full object-cover" />
                      ) : (
                        <ImagePlus size={28} className="text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1b0e]">Pilih file gambar banner</p>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG, atau WebP maksimal 2MB. Rekomendasi rasio landscape agar tampil penuh di carousel.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="banner-image-upload"
                        />
                        <label
                          htmlFor="banner-image-upload"
                          className="inline-flex cursor-pointer items-center gap-2 bg-[#2c1b0e] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#3d2b1d] transition"
                        >
                          <ImagePlus size={18} />
                          Upload Gambar
                        </label>
                        <span className="text-sm text-gray-500">{imageFileName || 'Belum ada file dipilih'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Judul"
                  value={form.title}
                  onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
                  placeholder="Promo Mingguan"
                />
                <Field
                  label="Subjudul"
                  value={form.subtitle}
                  onChange={(value) => setForm((prev) => ({ ...prev, subtitle: value }))}
                  placeholder="Jangan sampai kelewatan"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Deskripsi</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Tuliskan deskripsi singkat yang menjelaskan promo atau isi banner."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Link Tombol"
                  value={form.target_url}
                  onChange={(value) => setForm((prev) => ({ ...prev, target_url: value }))}
                  placeholder="/promo"
                />
                <Field
                  label="Teks Tombol"
                  value={form.button_label}
                  onChange={(value) => setForm((prev) => ({ ...prev, button_label: value }))}
                  placeholder="Lihat Detail"
                />
              </div>

              {imageError ? (
                <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
                  {imageError}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3">
                  {successMessage}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#e39b4f] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c9863e] transition disabled:opacity-60"
                >
                  <CheckCircle2 size={18} />
                  {saving ? 'Menyimpan...' : form.id ? 'Simpan Perubahan' : 'Simpan Banner'}
                </button>

                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="inline-flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  <X size={18} />
                  Reset Form
                </button>

                {form.id ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(form.id)}
                    className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                    Hapus Banner Ini
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <aside className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-[#2c1b0e]">Live Preview</h2>
                <p className="text-sm text-gray-500">Tampilan ini mengikuti isi form secara real-time.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#e39b4f]">
                <LinkIcon size={14} />
                Preview
              </span>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 shadow-sm bg-[#f5f5f5]">
              <div className="relative aspect-[720/300]">
                {previewBanner.image_url ? (
                  <img
                    src={previewBanner.image_url}
                    alt={previewBanner.title || 'Banner preview'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#2c1b0e] via-[#4a3728] to-[#e39b4f] flex items-center justify-center text-white/80">
                    <div className="text-center px-6">
                      <ImagePlus size={36} className="mx-auto mb-3" />
                      <p className="font-semibold">Upload gambar untuk melihat preview banner</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent p-6 flex flex-col justify-between text-white">
                  <div>
                    <p className="text-xs md:text-sm opacity-85 tracking-[0.2em] uppercase">
                      {previewBanner.subtitle || 'Subjudul banner'}
                    </p>
                    <h3 className="text-2xl md:text-4xl font-black mt-2 leading-tight">
                      {previewBanner.title || 'Judul banner'}
                    </h3>
                    <p className="mt-4 max-w-md text-sm md:text-base text-white/90 leading-relaxed">
                      {previewBanner.description || 'Deskripsi singkat akan tampil di sini.'}
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2 bg-[#FF6E00] text-white px-5 py-2.5 rounded-full font-semibold shadow-lg">
                      {previewBanner.button_label || 'Detail'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <InfoRow label="Target link" value={previewBanner.target_url || '/'} />
              <InfoRow label="Judul" value={previewBanner.title || '-'} />
              <InfoRow label="Deskripsi" value={previewBanner.description || '-'} />
            </div>
          </aside>
        </div>

        <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#2c1b0e]">Daftar Banner</h2>
              <p className="text-sm text-gray-500">
                Edit, hapus, atau jadikan banner lain sebagai materi promosi utama.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari judul, subjudul, atau link..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Banner</th>
                  <th className="px-6 py-4">Konten</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBanners.length > 0 ? (
                  filteredBanners.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#2c1b0e]">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xl">
                        <p
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#e39b4f] text-xs font-semibold">
                            <LinkIcon size={12} />
                            {item.target_url}
                          </span>
                          <p className="text-xs text-gray-500">
                            Tombol: {item.button_label || 'Detail'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            aria-label={`Hapus ${item.title}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-400">
                      Belum ada banner yang cocok dengan pencarian ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

const Field = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e39b4f]"
    />
  </div>
)

const StatCard = ({ title, value, note }) => (
  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
    <h3 className="text-3xl font-black text-[#2c1b0e] mt-2">{value}</h3>
    <p className="text-xs font-semibold text-[#e39b4f] mt-2">{note}</p>
  </div>
)

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
    <span className="text-sm text-gray-700 text-right break-all">{value}</span>
  </div>
)

export default BannerManagement
