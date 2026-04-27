import React, { useState, useEffect, useRef } from 'react'; // Tambahkan useRef
import Banner from './MenuViewComponents/Banner';
import PromoMingguan from './MenuViewComponents/PromoMingguan';
import Recommendations from './MenuViewComponents/Recommendations';
import MenuGrid from './MenuViewComponents/MenuGrid';
import PreOrderSection from './MenuViewComponents/PreOrderSection';
import GroupOrderSection from './MenuViewComponents/GroupOrderSection';
import CoffeeSubscription from './MenuViewComponents/CoffeeSubscription';
import AnalyticsDashboard from './MenuViewComponents/AnalyticsDashboard';
import CartFloating from './MenuViewComponents/CartFloating'; // Pastikan diimport

const MenuView = () => {
  // 1. State Management
  const [recommendations, setRecommendations] = useState([]);
  const [displayedMenu, setDisplayedMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState([]);
  const [favoriteIdSet, setFavoriteIdSet] = useState(new Set());
  
  const [preOrder, setPreOrder] = useState(null);
  const [groupOrder, setGroupOrder] = useState(null);
  const [subscription, setSubscription] = useState(null);

  // Variabel Dummy untuk Analytics & Subscription (Wajib ada agar tidak error)
  const subscriptionPlans = [
    { id: 1, name: "Bronze Plan", price: 50000 },
    { id: 2, name: "Silver Plan", price: 100000 }
  ];
  const monthlySpend = 150000;
  const favoriteCoffee = "Latte";
  const planStatus = "Active";

  // Ref untuk scrolling ke menu
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

  // 3. Handler Functions (Definisikan agar tidak error saat dipassing ke Props)
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
    <div className="page-shell bg-[#FAF7F2] min-h-screen">
      <Banner />
      <PromoMingguan />

      <section className="layout-grid container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <main className="content-column flex-1">
          <Recommendations items={recommendations} />
          
          <MenuGrid 
            menu={displayedMenu} 
            loading={loadingMenu}
            favoriteIdSet={favoriteIdSet}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            addToGroup={addToGroup}
            menuRef={menuSectionRef}
          />

          <section className="panel mt-12" id="tools">
            <h2 className="text-2xl font-bold mb-6 text-[#4A3728]">Fitur Spesial</h2>
            <div className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-4">
               <PreOrderSection 
                 hasCart={cart.length > 0} 
                 preOrder={preOrder} 
                 onSave={savePreOrder} 
                 onCancel={cancelPreOrder} 
               />
               <GroupOrderSection 
                 groupOrder={groupOrder} 
                 hasCart={cart.length > 0}
                 onUpdateMembers={updateGroupMembers}
                 onAddCart={addCartToGroup}
                 onConfirm={confirmGroupPayment}
               />
               <CoffeeSubscription 
                 plans={subscriptionPlans} 
                 activeId={subscription?.id} 
                 onActivate={activatePlan} 
               />
               <AnalyticsDashboard 
                 monthlySpend={monthlySpend} 
                 favoriteCoffee={favoriteCoffee} 
                 planStatus={planStatus} 
               />
            </div>
          </section>
        </main>
        
        <aside className="sidebar-column w-full lg:w-80">
             <CartFloating items={cart} />
        </aside>
      </section>
    </div>
  );
}

export default MenuView;