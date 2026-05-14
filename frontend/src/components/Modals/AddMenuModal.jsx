import { useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import { getImageFileError, readImageFileAsDataUrl } from '../../utils/imageUpload';

const AddMenuModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'coffee',
    stock: '',
    image_url: '',
  });
  const [imageName, setImageName] = useState('');
  const [imageError, setImageError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    const error = getImageFileError(file)

    if (error) {
      setImageError(error)
      setImageName('')
      setFormData((prev) => ({ ...prev, image_url: '' }))
      event.target.value = ''
      return
    }

    if (!file) return

    try {
      setImageError('')
      const dataUrl = await readImageFileAsDataUrl(file)
      setImageName(file.name)
      setFormData((prev) => ({ ...prev, image_url: dataUrl }))
    } catch (readError) {
      console.error(readError)
      setImageError('Gagal membaca file gambar.')
      setImageName('')
      setFormData((prev) => ({ ...prev, image_url: '' }))
      event.target.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      ...formData,
      id: Date.now(),
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
    })
    setFormData({ name: '', price: '', category: 'coffee', stock: '', image_url: '' })
    setImageName('')
    setImageError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="animate-in fade-in zoom-in duration-200 w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-extrabold text-[#2c1b0e]">Tambah Menu Baru</h2>
          <button onClick={onClose} className="rounded-full p-2 transition hover:bg-gray-100">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">Nama Menu</label>
            <input
              required
              type="text"
              placeholder="Contoh: Es Kopi Gula Aren"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#e39b4f]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">Harga (Rp)</label>
              <input
                required
                type="number"
                placeholder="15000"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#e39b4f]"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">Stok Awal</label>
              <input
                required
                type="number"
                placeholder="50"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#e39b4f]"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#e39b4f]"
            >
              <option value="coffee">Coffee</option>
              <option value="non-coffee">Non-Coffee</option>
              <option value="meal">Makanan</option>
              <option value="snack">Cemilan</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">Gambar Menu</label>
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e39b4f]/20 bg-white px-4 py-3 text-sm font-bold text-[#8b5e34] transition hover:bg-[#fff8ef]">
                <Camera size={18} />
                Upload gambar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <p className="mt-2 text-xs text-gray-500">Format gambar saja. Maksimal 2 MB.</p>

              {imageError ? (
                <p className="mt-2 text-sm font-medium text-red-600">{imageError}</p>
              ) : null}

              {formData.image_url ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img
                    src={formData.image_url}
                    alt={imageName || 'Preview menu'}
                    className="h-44 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
                    <span className="truncate">{imageName || 'Gambar terpilih'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image_url: '' }))
                        setImageName('')
                      }}
                      className="font-bold text-[#e39b4f] hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e39b4f] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#c9863e]"
          >
            <Save size={20} />
            Simpan Menu
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMenuModal;
