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
import CartFloating from './MenuViewComponents/CartFloating';
import { coffeeSeed, subscriptionPlans as subscriptionSeed } from '../../data/menuSeed';
import { STORAGE_KEYS, readStoredValue, writeStoredValue } from '../../data/customerStorage';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';
import {
  addCartItem,
  clearCart as clearStoredCart,
  fetchCart,
  getStoredCart,
  removeCartItem,
  setCartItemQuantity,
} from '../../services/cartService';

const API_BASE_URL = getApiBaseUrl()

const apiUrl = (path) => {
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const normalizeFavoriteIds = (values = []) =>
  Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  )

const MenuView = () => {
  const [allProducts, setAllProducts] = useState(coffeeSeed);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState(() => getStoredCart().items || []);
  const [authUser, setAuthUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null));
  const [favoriteIdSet, setFavoriteIdSet] = useState(() => new Set(normalizeFavoriteIds(readStoredValue(STORAGE_KEYS.favorites, []))));
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [preOrder, setPreOrder] = useState(() => readStoredValue(STORAGE_KEYS.preorder, null));
  
  // State groupOrder dikembalikan ke state awal mendeteksi database (id: null, status: 'idle')
  const [groupOrder, setGroupOrder] = useState({ 
    id: null, 
    code: '', 
    members: 1, 
    items: [], 
    status: 'idle' 
  });
  
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

  // Ambil data session group jika user tergabung dalam group order tertentu saat masuk halaman
  useEffect(() => {
    const checkActiveGroupSession = async () => {
      if (!authUser?.id && !authUser?.email) return;
      try {
        const query = new URLSearchParams()
        if (authUser?.id) query.set('userId', authUser.id)
        if (authUser?.email) query.set('userEmail', authUser.email)
        if (authUser?.name) query.set('userName', authUser.name)

        const response = await fetch(apiUrl(`/api/group-sessions/active?${query.toString()}`));
        if (response.ok) {
          const activeSession = await response.json();
          if (activeSession) {
            setGroupOrder({
              id: activeSession.id,
              code: activeSession.group_code,
              members: activeSession.members || 1,
              status: activeSession.status,
              items: []
            });
          } else {
            setGroupOrder({
              id: null,
              code: '',
              members: 1,
              status: 'idle',
              items: [],
            })
          }
        }
      } catch (err) {
        console.warn("Gagal sinkronisasi sesi grup aktif dari server:", err);
      }
    };
    checkActiveGroupSession();
  }, [authUser?.id]);

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
    const syncAuth = () => {
      setAuthUser(readStoredValue(STORAGE_KEYS.auth, null))
    }

    window.addEventListener('storage', syncAuth)
    window.addEventListener('warungkopi-state-changed', syncAuth)

    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('warungkopi-state-changed', syncAuth)
    }
  }, [])

  useEffect(() => {
    const syncFavorites = async () => {
      const storedAuth = readStoredValue(STORAGE_KEYS.auth, null)

      if (!storedAuth?.email) {
        const localFavoriteIds = normalizeFavoriteIds(readStoredValue(STORAGE_KEYS.favorites, []))
        setFavoriteIdSet(new Set(localFavoriteIds))
        return
      }

      try {
        const response = await fetch(apiUrl(`/api/users/favorites?userEmail=${encodeURIComponent(storedAuth.email)}`))

        if (!response.ok) {
          throw new Error('Gagal memuat favorit')
        }

        const data = await response.json()
        const favoriteIds = normalizeFavoriteIds(
          Array.isArray(data) ? data.map((item) => item.product_id) : []
        )

        setFavoriteIdSet(new Set(favoriteIds))
        writeStoredValue(STORAGE_KEYS.favorites, favoriteIds)
      } catch (error) {
        console.warn('Gagal memuat favorit dari backend, fallback ke localStorage:', error)
        const localFavoriteIds = normalizeFavoriteIds(readStoredValue(STORAGE_KEYS.favorites, []))
        setFavoriteIdSet(new Set(localFavoriteIds))
      }
    }

    syncFavorites()
  }, [authUser?.email])

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

  const persistLocalFavorites = (ids = []) => {
    const normalized = normalizeFavoriteIds(ids)
    writeStoredValue(STORAGE_KEYS.favorites, normalized)
    window.dispatchEvent(new Event('warungkopi-state-changed'))
    return new Set(normalized)
  }

  const toggleFavorite = async (id) => {
    const productId = Number(id)
    if (!Number.isFinite(productId) || productId <= 0) return

    const previousFavorites = new Set(favoriteIdSet)
    const nextFavorites = new Set(favoriteIdSet)
    const wasFavorite = nextFavorites.has(productId)

    if (wasFavorite) nextFavorites.delete(productId)
    else nextFavorites.add(productId)

    if (!authUser?.email) {
      setFavoriteIdSet(persistLocalFavorites([...nextFavorites]))
      return
    }

    setFavoriteIdSet(nextFavorites)

    try {
      const response = await fetch(
        apiUrl(wasFavorite ? `/api/users/favorites/${productId}` : '/api/users/favorites'),
        {
          method: wasFavorite ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: authUser.email,
            userName: authUser.name,
            productId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.message || 'Gagal memperbarui favorit')
      }

      const nextFavoriteIds = Array.from(nextFavorites)
      setFavoriteIdSet(persistLocalFavorites(nextFavoriteIds))
    } catch (error) {
      console.error('Gagal menyimpan favorit:', error)
      setFavoriteIdSet(previousFavorites)
      alert(error.message || 'Gagal menyimpan favorit')
    }
  };

  const addToCart = async (item) => {
    try {
      const snapshot = await addCartItem(item, 1)
      setCart(snapshot.items || [])
    } catch (error) {
      console.error('Gagal menambahkan menu ke keranjang:', error)
    }
  };

  // 1. Tombol "+" Tambah ke group langsung dari Grid Menu
  const addToGroup = async (item) => {
    if (!authUser?.email && !authUser?.id) {
      alert("Silakan login terlebih dahulu untuk menggunakan fitur grup.");
      return;
    }
    if (!groupOrder?.code || !groupOrder?.id) {
      alert("Sesi grup belum aktif. Tunggu sinkronisasi grup atau muat ulang halaman.");
      return;
    }
    try {
      const response = await fetch(apiUrl('/api/group-cart/items'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_code: groupOrder.code,
          user_id: authUser.id,
          user_email: authUser.email,
          user_name: authUser.name,
          product_id: item.id,
          quantity: 1
        })
      });
      if (response.ok) {
        alert(`${item.name} berhasil ditambahkan langsung ke Keranjang Grup!`);
      }
    } catch (error) {
      console.error("Gagal menambahkan item langsung ke grup:", error);
    }
  };

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
    {
      const nextPreOrder = {
        status: 'Tersimpan',
        isPreorder: true,
        time: data.time || pickupTime,
        pickupTime: data.time || pickupTime,
        note: data.note || orderNote,
        items: cart,
        tableNumber,
      };

      setPreOrder(nextPreOrder);
      writeStoredValue(STORAGE_KEYS.preorder, nextPreOrder);
    };

  const cancelPreOrder = () => {
    setPreOrder(null);
    setPickupTime('');
    setOrderNote('');
    writeStoredValue(STORAGE_KEYS.preorder, null);
  };

  // HANDLER BARU: Aksi membuat sesi Group Order baru dari frontend otomatis
  const handleCreateGroupSession = async () => {
    if (!authUser || !authUser.id) {
      alert("Silakan login terlebih dahulu untuk membuat grup.");
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/group-sessions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host_id: authUser.id
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data) {
        alert(`Sesi grup berhasil dibuat! Kode Grup: ${data.group_code || data.code}`);
        setGroupOrder({
          id: data.id,
          code: data.group_code || data.code,
          members: 1,
          status: 'active',
          items: []
        });
      } else {
        // Fallback untuk demo jika backend API belum terdeploy penuh
        console.warn("API Server belum siap, mengaktifkan simulasi sesi lokal (Mock Data).");
        setGroupOrder({
          id: 777,
          code: "GRP-D64J",
          members: 1,
          status: 'active',
          items: []
        });
      }
    } catch (error) {
      console.error("Error menghubungkan ke backend:", error);
      // Fallback otomatis agar program tidak crash saat demo lokal
      setGroupOrder({
        id: 777,
        code: "GRP-D64J",
        members: 1,
        status: 'active',
        items: []
      });
    }
  };

  // 2. Mengubah jumlah anggota group session
  const updateGroupMembers = async (members) => {
    if (!groupOrder?.code) {
      alert("Sesi grup belum aktif.");
      return;
    }
    setGroupOrder(prev => ({ ...prev, members }));
    try {
      await fetch(apiUrl(`/api/group-sessions/update-members`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_code: groupOrder.code,
          user_id: authUser?.id,
          user_email: authUser?.email,
          user_name: authUser?.name,
          members: members
        })
      });
    } catch (error) {
      console.error("Gagal mengupdate jumlah anggota ke server:", error);
    }
  };

  // 3. Memasukkan isi cart lokal ke dalam group_cart_items di database
  const addCartToGroup = async () => {
    if (cart.length === 0) {
      alert("Keranjang belanja kosong!");
      return;
    }
    if (!authUser) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    if (!groupOrder?.code || !groupOrder?.id) {
      alert("Sesi grup belum aktif.");
      return;
    }

    const formattedItems = cart
      .map((item) => ({
        product_id: Number(item.productId || item.product_id || item.productID || item.id),
        quantity: Number(item.qty || item.quantity || 1),
      }))
      .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0 && Number.isFinite(item.quantity) && item.quantity > 0);

    if (!formattedItems.length) {
      alert("Tidak ada item valid untuk disinkronkan ke grup.");
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/group-cart/sync-local'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          group_code: groupOrder.code,
          user_id: authUser.id,
          user_email: authUser.email,
          user_name: authUser.name,
          items: formattedItems,
        })
      });

      if (response.ok) {
        alert("Keranjang belanja lokal Anda berhasil digabungkan ke grup!");
        handleClearCart(); // Kosongkan keranjang pribadi setelah sukses dilempar ke grup
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Gagal sinkronisasi group cart:', response.status, errorData)
        alert(errorData?.message || "Gagal menyinkronkan keranjang ke grup.");
      }
    } catch (error) {
      console.error("Error sync keranjang ke grup:", error);
      alert("Gagal menyinkronkan keranjang ke grup.");
    }
  };

  // 4. Konfirmasi pembayaran grup (Mengunci sesi & redirect ke split bill checkout)
  const confirmGroupPayment = async () => {
    if (!groupOrder?.code) {
      alert("Sesi grup belum aktif.");
      return;
    }
    try {
      const response = await fetch(apiUrl(`/api/group-sessions/lock`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_code: groupOrder.code,
          user_id: authUser?.id,
          user_email: authUser?.email,
          user_name: authUser?.name,
        })
      });

      if (response.ok) {
        // Alihkan halaman ke komponen ringkasan split bill untuk proses pembayaran individual
        navigate(`/checkout/group?code=${groupOrder.code}&table=${tableNumber}`);
      } else {
        alert("Gagal melakukan konfirmasi transaksi grup.");
      }
    } catch (error) {
      console.error("Error konfirmasi grup:", error);
    }
  };

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
    <div className="page-shell min-h-screen">
      <div className="banner-wrapper-floating">
        <Banner />
      </div>
      <div className="w-full py-2 px-2">
        <PromoMingguan />
      </div>

      <section className="w-full flex flex-col gap-4">
        <main className="w-full flex flex-col">
          <div className="px-2">
            <Recommendations items={recommendations} />
          </div>
          
          <section className="w-full">
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

          <section className="w-full bg-transparent pb-20 mt-16" id="tools">
            <div className="pl-4 mb-10 border-l-4 border-[#FF6E00]">
              <span className="text-xs font-semibold text-[#FF6E00] uppercase tracking-widest block mb-1">
                Exclusive Utilities
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#4A3728] tracking-tight">
                Fitur Spesial
              </h2>
            </div>

            <style>{`
              @keyframes featureSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .fitur-item-wrapper {
                animation: featureSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>

            <div className="w-full flex flex-col gap-8 px-2">
              {/* 1. Pre-Order Section */}
              <div className="fitur-item-wrapper bg-white rounded-[2.5rem] shadow-[0_4px_25px_-5px_rgba(74,52,46,0.06)] hover:shadow-[0_15px_35px_-5px_rgba(74,52,46,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{ animationDelay: '100ms' }}>
                <PreOrderSection 
                  hasCart={cart.length > 0} 
                  preOrder={preOrder} 
                  onSave={savePreOrder} 
                  onCancel={cancelPreOrder} 
                />
              </div>

              {/* 2. Group Order Section */}
              <div className="fitur-item-wrapper bg-white rounded-[2.5rem] shadow-[0_4px_25px_-5px_rgba(74,52,46,0.06)] hover:shadow-[0_15px_35px_-5px_rgba(74,52,46,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{ animationDelay: '200ms' }}>
                <GroupOrderSection 
                  groupOrder={groupOrder} 
                  hasCart={cart.length > 0}
                  onUpdateMembers={updateGroupMembers}
                  onAddCart={addCartToGroup}
                  onConfirm={confirmGroupPayment}
                  onCreateGroup={handleCreateGroupSession} // <--- Menyalurkan fungsi pembuatan grup baru
                />
              </div>
            
              {/* 3. Coffee Subscription */}
              <div className="fitur-item-wrapper bg-white rounded-[2.5rem] shadow-[0_4px_25px_-5px_rgba(74,52,46,0.06)] hover:shadow-[0_15px_35px_-5px_rgba(74,52,46,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{ animationDelay: '300ms' }}>
                <CoffeeSubscription 
                  plans={subscriptionPlans} 
                  activeId={activeSub?.id} 
                  onActivate={activatePlan} 
                />
              </div>
            
              {/* 4. Analytics Dashboard */}
              <div className="fitur-item-wrapper bg-white rounded-[2.5rem] shadow-[0_4px_25px_-5px_rgba(74,52,46,0.06)] hover:shadow-[0_15px_35px_-5px_rgba(74,52,46,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden" style={{ animationDelay: '400ms' }}>
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
