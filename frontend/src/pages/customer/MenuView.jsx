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
  const [subscription, setSubscription] = useState({ id: null });
  
  const subscriptionPlans = [
    { id: 1, name: "Bronze Plan", price: 50000 },
    { id: 2, name: "Silver Plan", price: 100000 }
  ];
  const monthlySpend = 150000;
  const favoriteCoffee = "Latte";
  const planStatus = "Active";

  const menuSectionRef = useRef(null);

  // 2. Fetch Data Dummy
  useEffect(() => {
    const fetchData = async () => {
      try {
        setRecommendations([
          { id: 1, name: "Caramel Macchiato", price: 35000 },
          { id: 2, name: "Es Kopi Susu", price: 20000 }
        ]);
        setDisplayedMenu([
           { id: 1, name: "Espresso", price: 15000, category: "Coffee" },
           { id: 2, name: "Latte", price: 25000, category: "Coffee" },
           { id: 3, name: "Cappuccino", price: 30000, category: "Coffee" }
        ]);
        setLoadingMenu(false);
      } catch (error) {
        console.error("Gagal ambil data:", error);
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
    <div className="page-shell min-h-screen pb-20">
      <div className="banner-floating-wrapper">
        <section className="relative w-full overflow-hidden rounded-2xl shadow-sm">
          <Banner />
        </section>
      </div>
      {/* 2. PROMO: Diberikan jarak atas-bawah yang luas (py-12) */}
      <div className="w-full bg-white shadow-sm py-12 mb-10">
        <div className="container mx-auto px-4">
          <PromoMingguan />
        </div>
      </div>

      {/* 3. MAIN CONTENT: Layout Grid Utama */}
      <section className="container mx-auto px-4 flex flex-col lg:flex-row gap-10">
        <main className="content-column flex-1 flex flex-col gap-16"> {/* gap-16 antar komponen utama */}
          
          {/* Recommendations Section */}
          <section>
            <Recommendations items={recommendations} />
          </section>
          
          {/* Menu Grid Section */}
          <section className="bg-white p-6 rounded-3xl shadow-sm">
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
          <section className="panel" id="tools">
            <h2 className="text-3xl font-bold mb-10 text-[#4A3728] pl-4 border-l-4 border-[#FF6E00]">
              Fitur Spesial
            </h2>
            <div className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-8"> {/* gap-8 antar card fitur */}
               <div className="transition-transform hover:scale-[1.02]">
                <PreOrderSection 
                   hasCart={cart.length > 0} 
                   preOrder={preOrder} 
                   onSave={savePreOrder} 
                   onCancel={cancelPreOrder} 
                />
               </div>
               
               <div className="transition-transform hover:scale-[1.02]">
                <GroupOrderSection 
                   groupOrder={groupOrder} 
                   hasCart={cart.length > 0}
                   onUpdateMembers={updateGroupMembers}
                   onAddCart={addCartToGroup}
                   onConfirm={confirmGroupPayment}
                />
               </div>

               <div className="transition-transform hover:scale-[1.02]">
                <CoffeeSubscription 
                   plans={subscriptionPlans} 
                   activeId={subscription?.id} 
                   onActivate={activatePlan} 
                />
               </div>

               <div className="transition-transform hover:scale-[1.02]">
                <AnalyticsDashboard 
                   monthlySpend={monthlySpend} 
                   favoriteCoffee={favoriteCoffee} 
                   planStatus={planStatus} 
                />
               </div>
            </div>
          </section>
        </main>

        {/* SIDEBAR: Sticky agar tetap terlihat saat scroll */}
        <aside className="sidebar-column w-full lg:w-96">
          <div className="sticky top-10">
            <CartFloating 
                cart={cart || []} 
                subtotal={cart.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0)}
                preOrder={preOrder}
                onTableNumberChange={(val) => console.log(val)} 
                onPickupTimeChange={(val) => console.log(val)}
                onOrderNoteChange={(val) => console.log(val)}
                onClearCart={() => setCart([])}
            />
          </div>
        </aside>
      </section>
    </div>
  );
}

export default MenuView;