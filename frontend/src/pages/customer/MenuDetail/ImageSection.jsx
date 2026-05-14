import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

const ImageSection = ({ product }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1600&auto=format&fit=crop"
  const imageSrc = product?.image_url || product?.image || defaultImage

  return (
    <section className="relative w-full h-[280px] md:h-[420px] overflow-hidden">
      {/* Product Image */}
      <img
        src={imageSrc}
        alt={product?.name || "Coffee Menu"}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Badge */}
      <div className="absolute top-5 left-5">
        <span className="bg-[#FF6E00] text-white text-sm md:text-base font-semibold px-4 py-2 rounded-2xl shadow-lg">
          {product?.badge || 'Best Seller'}
        </span>
      </div>

      {/* Favorite */}
      <div className="absolute top-5 right-5 flex flex-col items-center text-white">
        <button
          type="button"
          className="bg-transparent border-none outline-none cursor-pointer"
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="text-red-500 text-2xl drop-shadow-md"
          />
        </button>

        <span className="text-xs mt-1 font-medium">
          Favorit
        </span>
      </div>
    </section>
  )
}

export default ImageSection
