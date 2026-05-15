import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  addCartItem,
  clearCart as clearStoredCart,
  fetchCart,
  getStoredCart,
  removeCartItem,
  setCartItemQuantity,
} from '../../services/cartService';

const MenuView = () => {
  const [allProducts, setAllProducts] = useState(coffeeSeed);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState(() => getStoredCart().items || []);
  const [favoriteIdSet, setFavoriteIdSet] = useState(new Set());
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [preOrder, setPreOrder] = useState(null);
  const [groupOrder, setGroupOrder] = useState({ members: 4, items: [], status: 'idle' });
  const [subscriptionPlans, setSubscriptionPlans] = useState(subscriptionSeed);
  const [activeSub, setActiveSub] = useState({ id: null });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthlySpend = 150000;
  const favoriteCoffee = "Latte";
  const planStatus = "Active";
  const menuSectionRef = useRef(null);
  const searchQuery = searchParams.get('q')?.trim() || '';
  const normalizedSearchQuery = searchQuery.toLowerCase();

  const matchesSearch = (product) => {
    if (!normalizedSearchQuery) return true;

    const haystack = [
      product.name,
      product.category,
      product.category_label,
      product.badge,
      product.description,
      product.initials,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedSearchQuery);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMenu(true);
        // Kita panggil API secara paralel agar cepat
        const [prodRes, subRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/subscriptions')
        ]);

        const products = prodRes.ok ? await prodRes.json() : coffeeSeed;
        const subs = subRes.ok ? await subRes.json() : subscriptionSeed;

        const safeProducts = Array.isArray(products) && products.length ? products : coffeeSeed;
        const safeSubscriptions = Array.isArray(subs) && subs.length ? subs : subscriptionSeed;

        setAllProducts(safeProducts);
        setSubscriptionPlans(safeSubscriptions);
      } catch (error) {
        console.error("Gagal ambil data menu:", error);
        setAllProducts(coffeeSeed);
        setSubscriptionPlans(subscriptionSeed);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const syncCart = async () => {
      try {
        const snapshot = await fetchCart()
        setCart(snapshot.items || [])
      } catch (error) {
        console.error('Gagal memuat keranjang:', error)
      }
    }

    syncCart()

    const handleCartChange = () => {
      syncCart()
    }

    window.addEventListener('storage', handleCartChange)
    window.addEventListener('warungkopi-state-changed', handleCartChange)

    return () => {
      window.removeEventListener('storage', handleCartChange)
      window.removeEventListener('warungkopi-state-changed', handleCartChange)
    }
  }, [])

  useEffect(() => {
    if (!searchQuery) return

    requestAnimationFrame(() => {
      menuSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [searchQuery])

  const filteredMenu = useMemo(() => {
    const baseMenu = Array.isArray(allProducts) ? allProducts : coffeeSeed
    return baseMenu.filter(matchesSearch)
  }, [allProducts, normalizedSearchQuery])

  const recommendations = useMemo(() => {
    if (normalizedSearchQuery) {
      return filteredMenu.slice(0, 6)
    }

    return filteredMenu.slice(0, 6)
  }, [filteredMenu, normalizedSearchQuery])

  const menuTitle = normalizedSearchQuery
    ? `Hasil pencarian untuk "${searchQuery}"`
    : 'Menu Sering di Pesan'

  const emptyMessage = normalizedSearchQuery
    ? `Tidak ada menu yang cocok dengan "${searchQuery}". Coba kata kunci lain seperti kopi, latte, makanan, atau signature.`
    : 'Menu belum tersedia.'

  const visibleMenu = normalizedSearchQuery ? filteredMenu : filteredMenu.slice(0, 12)

  const toggleFavorite = (id) => {
    const newFavs = new Set(favoriteIdSet);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavoriteIdSet(newFavs);
  };

  const addToCart = async (item) => {
    try {
      const snapshot = await addCartItem(item, 1)
      setCart(snapshot.items || [])
    } catch (error) {
      console.error('Gagal menambahkan menu ke keranjang:', error)
    }
  };
  const addToGroup = (item) => console.log("Grup add:", item);
  const viewDetail = (productId) => {
    const product = (Array.isArray(allProducts) ? allProducts : []).find(
      (item) => String(item.id) === String(productId)
    )

    navigate(`/menu/${productId}`, {
      state: {
        product: product || null,
      },
    });
  };
  const savePreOrder = (data = {}) =>
    setPreOrder({
      status: 'Tersimpan',
      time: data.time || pickupTime,
      pickupTime: data.time || pickupTime,
      note: data.note || orderNote,
      items: cart,
      tableNumber,
    });
  const cancelPreOrder = () => {
    setPreOrder(null);
    setPickupTime('');
    setOrderNote('');
  };
  const updateGroupMembers = (members) => setGroupOrder({...groupOrder, members});
  const addCartToGroup = () => console.log("Sync group cart");
  const confirmGroupPayment = () => alert("Group payment confirmed!");
  const activatePlan = (planId) => setActiveSub({ id: planId });

  const updateCartQuantity = async (itemId, nextQuantity) => {
    try {
      const snapshot = await setCartItemQuantity(itemId, nextQuantity)
      setCart(snapshot.items || [])
    } catch (error) {
      console.error('Gagal memperbarui keranjang:', error)
    }
  }

  const handleRemoveCartItem = async (itemId) => {
    try {
      const snapshot = await removeCartItem(itemId)
      setCart(snapshot.items || [])
    } catch (error) {
      console.error('Gagal menghapus item keranjang:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      const snapshot = await clearStoredCart()
      setCart(snapshot.items || [])
    } catch (error) {
      console.error('Gagal mengosongkan keranjang:', error)
    }
  }

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          (Number(item.subtotal) || Number(item.price || item.unitPrice || 0) * (Number(item.qty) || 0)),
        0
      ),
    [cart]
  )

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
              menu={visibleMenu} 
              loading={loadingMenu}
              favoriteIdSet={favoriteIdSet}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
              addToGroup={addToGroup}
              onViewDetail={viewDetail}
              menuRef={menuSectionRef}
              limit={normalizedSearchQuery ? undefined : 12}
              title={menuTitle}
              emptyMessage={emptyMessage}
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
      {cart.length > 0 && (
        <CartFloating
          cart={cart}
          subtotal={subtotal}
          tableNumber={tableNumber}
          pickupTime={pickupTime}
          orderNote={orderNote}
          preOrder={preOrder}
          loyaltyPoints={Math.floor(subtotal / 1000)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          onTableNumberChange={setTableNumber}
          onPickupTimeChange={setPickupTime}
          onOrderNoteChange={setOrderNote}
          onSavePreOrder={savePreOrder}
          onCancelPreOrder={cancelPreOrder}
          onCheckout={() => navigate('/confirm-pesanan')}
        />
      )}
    </div>
  );
}

export default MenuView;
