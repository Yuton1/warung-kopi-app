// C:\laragon\www\WarungKopi\frontend\src\pages\customer\MenuDetail.jsx

import ImageSection from "./MenuDetail/ImageSection"

const MenuDetail = () => {
  // sementara dummy data dulu
  const product = {
    id: 1,
    name: "Espresso Coffee",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1600&auto=format&fit=crop",
  }

  return (
    <main className="min-h-screen bg-[#F3E9DD]">
      {/* Hero Section */}
      <ImageSection product={product} />

      {/* Next Section nanti */}
      {/* <InfoSection product={product} /> */}
      {/* <ActionSection product={product} /> */}
      {/* <Recommendation /> */}
    </main>
  )
}

export default MenuDetail