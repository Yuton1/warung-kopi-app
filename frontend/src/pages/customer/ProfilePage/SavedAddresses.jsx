import { useState } from 'react'
import { Building2, Home, MapPin, MoreVertical, Phone, Plus, X, Check, Loader2 } from 'lucide-react'

const iconMap = {
  home: Home,
  office: Building2,
  other: MapPin,
}

const AddressItem = ({ address, onSetDefault, onDelete }) => {
  const Icon = iconMap[address.type] || MapPin
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div 
      className={`relative rounded-2xl border p-5 transition-all duration-300 hover:shadow-sm bg-white/80 group ${
        address.is_default 
          ? 'border-[#6b4a34] bg-[#f8f1e8]/30 shadow-sm' 
          : 'border-gray-100 hover:border-[#6b4a34]/30'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
            address.is_default ? 'bg-[#6b4a34] text-white' : 'bg-[#f3e7d9] text-[#6b4a34]'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4b3729]">{address.label}</p>
            {address.is_default && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#6b4a34]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#6b4a34]">
                <Check className="h-2.5 w-2.5" /> Default Address
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Menu Aksi */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-2 text-[#7f6b58] transition-colors hover:bg-[#f3e7d9]/50 active:scale-95"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-1 w-44 z-20 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                {!address.is_default && (
                  <button
                    onClick={() => { onSetDefault(address.id); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-[#4b3729] hover:bg-[#f8f1e8] rounded-lg transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => { onDelete(address.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Address
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[#5f4a3a] pl-0.5 mb-4">{address.address}</p>

      <div className="flex items-center gap-2 text-xs font-medium text-[#8c7661] bg-[#f8f1e8]/40 w-fit px-3 py-1.5 rounded-xl border border-[#f3e7d9]/30">
        <Phone className="h-3.5 w-3.5 text-[#6b4a34]" />
        {address.phone}
      </div>
    </div>
  )
}

const SavedAddresses = ({ addresses = [], onAddAddress, onSetDefault, onDelete, loading = false }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', type: 'home', address: '', phone: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!onAddAddress) return
    try {
      setSubmitting(true)
      await onAddAddress(newAddress)
      setIsOpenModal(false)
      setNewAddress({ label: '', type: 'home', address: '', phone: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="w-full bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header Bagian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6b4a34]/10 text-[#6b4a34]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2c1b0e]">Saved Addresses</h3>
            <p className="text-xs text-gray-400">Manage your coffee delivery locations</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={() => setIsOpenModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6b4a34] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#6b4a34]/10 transition-all duration-300 hover:bg-[#543926] hover:shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Address
        </button>
      </div>

      {/* Konten Utama */}
      {loading ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
          <Loader2 className="h-7 w-7 animate-spin text-[#6b4a34]" />
          <span className="text-xs font-medium">Loading addresses from TiDB...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl border border-dashed border-gray-200 bg-[#f8f1e8]/10">
          <MapPin className="h-10 w-10 text-gray-300 mb-2.5" />
          <p className="text-sm font-bold text-[#4b3729]">No addresses saved yet</p>
          <p className="text-xs text-gray-400 mt-0.5 max-w-[240px]">Add your home or office address to make delivery faster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressItem 
              key={address.id} 
              address={address} 
              onSetDefault={onSetDefault}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Add Address */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h4 className="text-base font-bold text-[#2c1b0e]">Add Delivery Location</h4>
              <button onClick={() => setIsOpenModal(false)} className="rounded-full p-1.5 hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">Address Label</label>
                <input 
                  type="text" 
                  placeholder="e.g., My House, Office 2nd floor"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-2.5 text-sm font-medium text-[#4b3729] focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">Location Type</label>
                <div className="grid grid-cols-3 gap-2.5 mt-1">
                  {['home', 'office', 'other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddress({...newAddress, type: t})}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                        newAddress.type === t 
                          ? 'border-[#6b4a34] bg-[#6b4a34] text-white shadow-sm' 
                          : 'border-gray-200 text-[#5f4a3a] hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">Recipient Phone</label>
                <input 
                  type="text" 
                  placeholder="08xxxxxxxxxx"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-2.5 text-sm font-medium text-[#4b3729] focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8c7661]">Full Delivery Address</label>
                <textarea 
                  rows="3"
                  placeholder="Street name, building number, block, unit..."
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f8f1e8]/20 px-4 py-2.5 text-sm font-medium text-[#4b3729] focus:border-[#6b4a34] focus:outline-none focus:ring-2 focus:ring-[#6b4a34]/10 transition-all resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-50 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-[#6b4a34] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#543926] disabled:opacity-50 transition-all"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  )
}

export default SavedAddresses