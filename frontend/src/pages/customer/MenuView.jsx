import { useState, useEffect, useRef } from 'react';
import Banner from './MenuViewComponents/Banner';
import PromoMingguan from './MenuViewComponents/PromoMingguan';
import Recommendations from './MenuViewComponents/Recommendations';
import MenuGrid from './MenuViewComponents/MenuGrid';
import PreOrderSection from './MenuViewComponents/PreOrderSection';
import GroupOrderSection from './MenuViewComponents/GroupOrderSection';
import CoffeeSubscription from './MenuViewComponents/CoffeeSubscription';
import AnalyticsDashboard from './MenuViewComponents/AnalyticsDashboard';
import CartFloating from '../../components/CartFloating';

const MenuView = () => {
  // 1. State Management
  const [recommendations, setRecommendations] = useState([]);
  const [displayedMenu, setDisplayedMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState([]);
  const [favoriteIdSet, setFavoriteIdSet] = useState(new Set());
  const [preOrder, setPreOrder] = useState({ date: "", time: "", items: [] });
  const [groupOrder, setGroupOrder] = useState({ members: 4, items: [], status: 'idle' });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const subResponse = await fetch('http://localhost:5000/api/subscriptions');
  const subData = await subResponse.json();
  setSubscriptionPlans(subData);
  
  // Ganti bagian state subscriptionPlans di MenuView.jsx
  const subscriptionPlans = [
    { 
      id: 1, 
      name: "Daily Boost", 
      price: 99000, 
      description: "5 Cup Kopi pilihan per minggu untuk pelanggan yang selalu on the go.",
      accent: "bg-[#D36B1F]", // Warna Oranye sesuai gambar
      quota: "5 Cup / Minggu"
    },
    { 
      id: 2, 
      name: "Office Flow", 
      price: 179000, 
      description: "10 cup campuran kopi dan non-kopi untuk kerja santai atau tim kecil.",
      accent: "bg-[#7C4724]", // Warna Cokelat Medium
      quota: "10 Cup / Bulan"
    },
    { 
      id: 3, 
      name: "Shared Table", 
      price: 329000, 
      description: "Paket langganan bulanan untuk tim, komunitas, atau grup nongkrong.",
      accent: "bg-[#2D1B0F]", // Warna Cokelat Tua
      quota: "25 Cup / Bulan"
    }
  ];
  const monthlySpend = 150000;
  const favoriteCoffee = "Latte";
  const planStatus = "Active";

  const menuSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMenu(true);
        const response = await fetch('http://localhost:5000/api/products'); 
        const data = await response.json();
        setRecommendations(data.slice(0, 2));
        setDisplayedMenu(data);
        setLoadingMenu(false);
      } catch (error) {
        console.error("Gagal ambil data dari database:", error);
        setLoadingMenu(false);
      }
    };
    fetchData();
  }, []);

  // 3. Handler Functions
  const toggleFavorite = (id) => {
    const newFavs = new Set(favoriteIdSet);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavoriteIdSet(newFavs);
  };

  const addToCart = (item) => setCart([...cart, item]);
  const addToGroup = (item) => console.log("Grup add:", item);
  const savePreOrder = (data) => setPreOrder(data);
  const cancelPreOrder = () => setPreOrder(null);
  const updateGroupMembers = (members) => setGroupOrder({...groupOrder, members});
  const addCartToGroup = () => console.log("Sync group cart");
  const confirmGroupPayment = () => alert("Group payment confirmed!");
  const activatePlan = (planId) => setSubscription({ id: planId });

  return (
    <div className="page-shell min-h-screen bg-white">
      <div className="banner-wrapper-floating">
        <Banner />
      </div>
      <div className="w-full bg-white shadow-sm py-2">
        <div className="px-2">
          <PromoMingguan />
        </div>
      </div>

      {/* 3. MAIN CONTENT: Layout Grid Utama */}
      <section className="w-full flex flex-col gap-4">
        <main className="w-full flex flex-col">
          <div className="px-2">
            <Recommendations items={recommendations} />
          </div>
          
          {/* Menu Grid Section */}
          <section className="w-full px-6 lg:px-12">
            <MenuGrid 
              menu={displayedMenu} 
              loading={loadingMenu}
              favoriteIdSet={favoriteIdSet}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
              addToGroup={addToGroup}
              menuRef={menuSectionRef}
            />
          </section>

          {/* FITUR SPESIAL SECTION: Dengan spacing antar card yang lega */}
          <section className="panel px-6 lg:px-12 pb-20" id="tools">
            <h2 className="text-3xl font-bold mb-10 text-[#4A3728] pl-4 border-l-4 border-[#FF6E00]">
              Fitur Spesial
            </h2>
            <div className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2 transition-transform hover:scale-[1.01]">
                <PreOrderSection 
                   hasCart={cart.length > 0} 
                   preOrder={preOrder} 
                   onSave={savePreOrder} 
                   onCancel={cancelPreOrder} 
                />
               </div>
               
               <div className="md:col-span-2 transition-transform hover:scale-[1.01]">
                <GroupOrderSection 
                   groupOrder={groupOrder} 
                   hasCart={cart.length > 0}
                   onUpdateMembers={updateGroupMembers}
                   onAddCart={addCartToGroup}
                   onConfirm={confirmGroupPayment}
                />
               </div>

               <div className="md:col-span-2 transition-transform hover:scale-[1.01]">
                <CoffeeSubscription 
                   plans={subscriptionPlans} 
                   activeId={subscription?.id} 
                   onActivate={activatePlan} 
                />
               </div>

               <div className="md:col-span-2 transition-transform hover:scale-[1.01]">
                <AnalyticsDashboard 
                   monthlySpend={monthlySpend} 
                   favoriteCoffee={favoriteCoffee} 
                   planStatus={planStatus} 
                />
               </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}

export default MenuView;