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
import { coffeeSeed, subscriptionPlans as subscriptionSeed } from '../../data/menuSeed';

const MenuView = () => {
  const [recommendations, setRecommendations] = useState(coffeeSeed.slice(0, 6));
  const [displayedMenu, setDisplayedMenu] = useState(coffeeSeed);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState([]);
  const [favoriteIdSet, setFavoriteIdSet] = useState(new Set());
  const [preOrder, setPreOrder] = useState({ date: "", time: "" });
  const [groupOrder, setGroupOrder] = useState({ members: 4, items: [], status: 'idle' });
  const [subscriptionPlans, setSubscriptionPlans] = useState(subscriptionSeed);
  const [activeSub, setActiveSub] = useState({ id: null });

  const monthlySpend = 150000;
  const favoriteCoffee = "Latte";
  const planStatus = "Active";
  const menuSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMenu(true);
        // Kita panggil API secara paralel agar cepat
        const [prodRes, subRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/subscriptions')
        ]);

        if (!prodRes.ok || !subRes.ok) {
          throw new Error(`Server Error: ${prodRes.status}`);
        }

        const products = await prodRes.json();
        const subs = await subRes.json();

        const safeProducts = Array.isArray(products) && products.length ? products : coffeeSeed;
        const safeSubscriptions = Array.isArray(subs) && subs.length ? subs : subscriptionSeed;

        setDisplayedMenu(safeProducts);
        setRecommendations(safeProducts.slice(0, 6));
        setSubscriptionPlans(safeSubscriptions);
        setLoadingMenu(false);
      } catch (error) {
        console.error("Gagal ambil data:", error);
        setLoadingMenu(false);
        setDisplayedMenu(coffeeSeed);
        setRecommendations(coffeeSeed.slice(0, 6));
        setSubscriptionPlans(subscriptionSeed);
      }
    };
    fetchData();
  }, []);

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
  const activatePlan = (planId) => setActiveSub({ id: planId });

  return (
    <div className="page-shell min-h-screen bg-white">
      <div className="banner-wrapper-floating">
        <Banner />
      </div>
      <div className="w-full bg-white shadow-sm py-2 px-2">
        <PromoMingguan />
      </div>

      <section className="w-full flex flex-col gap-4">
        <main className="w-full flex flex-col">
          <div className="px-2">
            <Recommendations items={recommendations} />
          </div>
          
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

          <section className="panel px-6 lg:px-12 pb-20" id="tools">
            <h2 className="text-3xl font-bold mb-10 text-[#4A3728] pl-4 border-l-4 border-[#FF6E00]">
              Fitur Spesial
            </h2>
            <div className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="md:col-span-2">
                <PreOrderSection 
                   hasCart={cart.length > 0} 
                   preOrder={preOrder} 
                   onSave={savePreOrder} 
                   onCancel={cancelPreOrder} 
                />
               </div>
               
               <div className="md:col-span-2">
                <GroupOrderSection 
                   groupOrder={groupOrder} 
                   hasCart={cart.length > 0}
                   onUpdateMembers={updateGroupMembers}
                   onAddCart={addCartToGroup}
                   onConfirm={confirmGroupPayment}
                />
               </div>

               <div className="md:col-span-2">
                <CoffeeSubscription 
                   plans={subscriptionPlans} 
                   activeId={activeSub?.id} 
                   onActivate={activatePlan} 
                />
               </div>

               <div className="md:col-span-2">
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
      {cart.length > 0 && <CartFloating count={cart.length} />}
    </div>
  );
}

export default MenuView;
