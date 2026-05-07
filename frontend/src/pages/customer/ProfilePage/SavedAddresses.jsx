import { Building2, Home, MapPin, MoreVertical, Phone, Plus } from 'lucide-react'

const iconMap = {
  home: Home,
  office: Building2,
  other: MapPin,
}

const AddressItem = ({ address }) => {
  const Icon = iconMap[address.type] || MapPin

  return (
    <div className={`rounded-[18px] border bg-white/70 p-4 ${address.default ? 'border-[#e8cdb4]' : 'border-transparent'}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e4d3] text-[#6b4a34]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#4b3729]">{address.label}</p>
            {address.default ? (
              <span className="mt-1 inline-flex rounded-full bg-[#c9a96e] px-2 py-0.5 text-[10px] font-bold text-[#3a2a1e]">
                Default
              </span>
            ) : null}
          </div>
        </div>
        <button type="button" className="rounded-full p-2 text-[#7f6b58] transition-colors hover:bg-[#f8f1e8]">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm leading-6 text-[#5f4a3a]">{address.address}</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-[#8c7661]">
        <Phone className="h-4 w-4" />
        {address.phone}
      </div>
    </div>
  )
}

const SavedAddresses = ({ addresses = [] }) => {
  return (
    <article className="surface-card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon gold">
            <MapPin className="h-[22px] w-[22px]" />
          </div>
          <div>
            <h3>Saved Addresses</h3>
            <p>Manage your delivery locations</p>
          </div>
        </div>
        <button type="button" className="card-action">
          <Plus className="h-[14px] w-[14px]" />
          Add New
        </button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <AddressItem key={address.id} address={address} />
        ))}
      </div>
    </article>
  )
}

export default SavedAddresses
