import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CartFloating from '../../components/CartFloating'
import ProductCard from '../../components/ProductCard'
import { STORAGE_KEYS, readStoredValue } from '../../data/customerStorage'
import { promoSeed } from '../../data/promoSeed'
import { coffeeSeed, categoryFilters, subscriptionPlans } from '../../data/menuSeed'
import { getProducts } from '../../services/api'
import { formatRupiah } from '../../utils/formatRupiah'

const ACCENT_FALLBACKS = [
  'accent-espresso',
  'accent-latte',
  'accent-mocha',
  'accent-night',
  'accent-matcha',
  'accent-cocoa',
  'accent-cream',
  'accent-sugar',
]

const getInitials = (value) => {
  const words = String(value || 'Warung Kopi').trim().split(/\s+/)
  const initials = words.slice(0, 2).map((word) => word[0] || '').join('')
  return initials.toUpperCase().slice(0, 2) || 'WK'
}

const defaultSizesForCategory = (category) => {
  if (['Makanan', 'Dessert'].includes(category)) {
    return [{ label: 'Porsi', factor: 1, note: '1 porsi' }]
  }

  return [
    { label: 'Tall', factor: 1, note: '250 ml' },
    { label: 'Grande', factor: 1.15, note: '350 ml' },
    { label: 'Venti', factor: 1.32, note: '450 ml' },
  ]
}

const normalizeMenu = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return coffeeSeed
  }

  return items.map((item, index) => {
    const category = item.category || item.type || 'Kopi'
    const name = item.name || item.product_name || item.title || `Menu ${index + 1}`
    const price = Number(item.price ?? item.harga ?? 0)

    return {
      id: item.id ?? index + 1,
      name,
      category,
      badge: item.badge || (price >= 30000 ? 'Premium' : 'Menu'),
      description: item.description || item.desc || 'Pilihan menu warung kopi yang siap dipesan.',
      price,
      points: Number(item.points ?? Math.max(8, Math.round(price / 2500))),
      featured: Boolean(item.featured ?? index < 3),
      accent: ACCENT_FALLBACKS[index % ACCENT_FALLBACKS.length],
      initials: getInitials(name),
      sizes: item.sizes || defaultSizesForCategory(category),
    }
  })
}

const createCode = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

const uniqueByKey = (items, getKey) => {
  const seen = new Set()
  return items.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

const MenuView = () => {
  const location = useLocation()
  const searchInputRef = useRef(null)
  const [menu, setMenu] = useState(coffeeSeed)
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [tableNumber, setTableNumber] = useState(() => readStoredValue(STORAGE_KEYS.profile, {}).tableNumber || '12')
  const [pickupTime, setPickupTime] = useState(() => readStoredValue(STORAGE_KEYS.profile, {}).pickupTime || '12:30')
  const [orderNote, setOrderNote] = useState(() => readStoredValue(STORAGE_KEYS.profile, {}).orderNote || '')
  const [cart, setCart] = useState(() => readStoredValue(STORAGE_KEYS.cart, []))
  const [favorites, setFavorites] = useState(() => readStoredValue(STORAGE_KEYS.favorites, [1, 2]))
  const [history, setHistory] = useState(() => readStoredValue(STORAGE_KEYS.history, []))
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => readStoredValue(STORAGE_KEYS.loyalty, 320))
  const [subscription, setSubscription] = useState(() => readStoredValue(STORAGE_KEYS.subscription, null))
  const [preOrder, setPreOrder] = useState(() => readStoredValue(STORAGE_KEYS.preorder, null))
  const [groupOrder, setGroupOrder] = useState(() =>
    readStoredValue(STORAGE_KEYS.groupOrder, {
      code: createCode('GRP'),
      members: 4,
      items: [],
      status: 'Siap diisi',
    }),
  )

  useEffect(() => {
    let mounted = true

    const loadCatalog = async () => {
      try {
        const remoteMenu = await getProducts()
        if (!mounted) {
          return
        }

        const normalized = normalizeMenu(remoteMenu)
        setMenu(normalized)
      } finally {
        if (mounted) {
          setLoadingMenu(false)
        }
      }
    }

    loadCatalog()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!location.state?.focusSearch) {
      return
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus()
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [location.state])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
    localStorage.setItem(STORAGE_KEYS.loyalty, JSON.stringify(loyaltyPoints))
    localStorage.setItem(STORAGE_KEYS.subscription, JSON.stringify(subscription))
    localStorage.setItem(STORAGE_KEYS.preorder, JSON.stringify(preOrder))
    localStorage.setItem(STORAGE_KEYS.groupOrder, JSON.stringify(groupOrder))
    localStorage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify({
        tableNumber,
        pickupTime,
        orderNote,
      }),
    )
  }, [cart, favorites, history, loyaltyPoints, subscription, preOrder, groupOrder, tableNumber, pickupTime, orderNote])

  const categories = useMemo(() => {
    const dynamicCategories = menu.map((item) => item.category)
    return uniqueByKey([...categoryFilters, ...dynamicCategories], (item) => item)
  }, [menu])

  const filteredMenu = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return menu.filter((item) => {
      const matchesCategory = category === 'Semua' || item.category === category
      const matchesKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)

      return matchesCategory && matchesKeyword
    })
  }, [menu, search, category])

  const cartCount = cart.reduce((total, item) => total + item.qty, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0)
  const cartPoints = Math.floor(subtotal / 1000)
  const groupSubtotal = groupOrder.items.reduce((total, item) => total + item.price * item.qty, 0)
  const splitPayment = groupOrder.members > 0 ? Math.ceil(groupSubtotal / groupOrder.members) : groupSubtotal
  const monthlySpend = history.reduce((total, order) => total + order.total, 0)

  const favoriteItemIds = favorites.map((item) => Number(item))
  const favoriteIdSet = useMemo(() => new Set(favoriteItemIds), [favoriteItemIds])
  const favoriteMenu = menu.filter((item) => favoriteItemIds.includes(Number(item.id)))
  const featuredMenu = menu.filter((item) => item.featured)

  const recommendations = useMemo(() => {
    const categoryMatch = cart[0]?.category || favoriteMenu[0]?.category || 'Signature'
    const recommendationPool = [
      ...favoriteMenu,
      ...menu.filter((item) => item.category === categoryMatch),
      ...featuredMenu,
      ...menu,
    ]

    return uniqueByKey(recommendationPool, (item) => item.id).slice(0, 4)
  }, [menu, cart, favoriteMenu, featuredMenu])

  const favoriteCoffee =
    history.length > 0
      ? Object.entries(
          history.reduce((acc, order) => {
            order.items.forEach((item) => {
              acc[item.name] = (acc[item.name] || 0) + item.qty
            })
            return acc
          }, {}),
        ).sort((a, b) => b[1] - a[1])[0]?.[0]
      : favoriteMenu[0]?.name || 'Latte Gula Aren'

  const addToCart = (product, size, price) => {
    const key = `${product.id}-${size.label}`

    setCart((current) => {
      const existing = current.find((item) => item.key === key)

      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item,
        )
      }

      return [
        ...current,
        {
          key,
          id: product.id,
          name: product.name,
          category: product.category,
          badge: product.badge,
          size,
          price,
          qty: 1,
        },
      ]
    })
  }

  const addToGroup = (product, size, price) => {
    const key = `${product.id}-${size.label}`

    setGroupOrder((current) => {
      const existing = current.items.find((item) => item.key === key)
      const items = existing
        ? current.items.map((item) =>
            item.key === key ? { ...item, qty: item.qty + 1 } : item,
          )
        : [
            ...current.items,
            {
              key,
              id: product.id,
              name: product.name,
              category: product.category,
              size,
              price,
              qty: 1,
            },
          ]

      return {
        ...current,
        items,
        status: 'Menunggu anggota grup',
      }
    })
  }

  const toggleFavorite = (productId) => {
    setFavorites((current) => {
      const numericId = Number(productId)
      const normalized = current.map(Number)

      return normalized.includes(numericId)
        ? normalized.filter((item) => item !== numericId)
        : [...normalized, numericId]
    })
  }

  const updateQuantity = (productId, sizeLabel, delta) => {
    const key = `${productId}-${sizeLabel}`

    setCart((current) =>
      current
        .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    )
  }

  const removeItem = (productId, sizeLabel) => {
    const key = `${productId}-${sizeLabel}`
    setCart((current) => current.filter((item) => item.key !== key))
  }

  const clearCart = () => setCart([])

  const savePreOrder = () => {
    if (!cart.length) {
      return
    }

    setPreOrder({
      code: createCode('PO'),
      tableNumber,
      pickupTime,
      note: orderNote,
      items: cart,
      status: 'Terjadwal',
      updatedAt: new Date().toISOString(),
    })
  }

  const cancelPreOrder = () => {
    setPreOrder(null)
  }

  const checkout = () => {
    if (!cart.length) {
      return
    }

    const order = {
      code: createCode('OR'),
      createdAt: new Date().toISOString(),
      tableNumber,
      pickupTime,
      note: orderNote,
      items: cart,
      total: subtotal,
    }

    setHistory((current) => [order, ...current].slice(0, 5))
    setLoyaltyPoints((current) => current + cartPoints + 20)
    setCart([])
    setPreOrder(null)
  }

  const addCartToGroup = () => {
    if (!cart.length) {
      return
    }

    setGroupOrder((current) => {
      const mergedItems = [...current.items]

      cart.forEach((item) => {
        const key = `${item.id}-${item.size.label}`
        const existing = mergedItems.find((entry) => entry.key === key)

        if (existing) {
          mergedItems.splice(mergedItems.indexOf(existing), 1, {
            ...existing,
            qty: existing.qty + item.qty,
          })
        } else {
          mergedItems.push({ ...item })
        }
      })

      return {
        ...current,
        items: mergedItems,
        status: 'Siap dibagi',
      }
    })
  }

  const updateGroupMembers = (value) => {
    const parsed = Math.max(1, Number(value) || 1)
    setGroupOrder((current) => ({
      ...current,
      members: parsed,
    }))
  }

  const copyInviteCode = async () => {
    const inviteText = `Gabung group order Warung Kopi: ${groupOrder.code}`
    try {
      await navigator.clipboard.writeText(inviteText)
      setGroupOrder((current) => ({
        ...current,
        status: 'Kode undangan tersalin',
      }))
    } catch {
      setGroupOrder((current) => ({
        ...current,
        status: 'Salin manual: ' + groupOrder.code,
      }))
    }
  }

  const confirmGroupPayment = () => {
    if (!groupOrder.items.length) {
      return
    }

    const groupPurchase = {
      code: createCode('GR'),
      createdAt: new Date().toISOString(),
      tableNumber,
      pickupTime,
      note: `Group order ${groupOrder.code}`,
      items: groupOrder.items,
      total: groupSubtotal,
    }

    setHistory((current) => [groupPurchase, ...current].slice(0, 5))
    setLoyaltyPoints((current) => current + Math.floor(groupSubtotal / 1500) + 10)
    setGroupOrder({
      code: createCode('GRP'),
      members: groupOrder.members,
      items: [],
      status: 'Group order selesai',
    })
  }

  const activatePlan = (plan) => {
    setSubscription({
      ...plan,
      activatedAt: new Date().toISOString(),
    })
    setLoyaltyPoints((current) => current + 50)
  }

  const planStatus = subscription
    ? `Aktif: ${subscription.name}`
    : 'Belum ada langganan aktif'

  const latestOrder = history[0]

  return (
    <div className="page-shell">
      <div className="page-glow page-glow--one" />
      <div className="page-glow page-glow--two" />

      <section className="promo-banner">
        <div className="promo-banner__copy">
          <span className="eyebrow">Promo Minggu Ini</span>
          <h2>{promoSeed[0].title}</h2>
          <p>{promoSeed[0].description}</p>
          <div className="promo-banner__actions">
            <Link to="/promo" className="btn btn-primary">
              Lihat semua promo
            </Link>
            <span className="promo-code-chip">Kode {promoSeed[0].code}</span>
          </div>
        </div>

        <div className="promo-banner__rail">
          {promoSeed.map((promo) => (
            <article key={promo.id} className={`promo-rail-card ${promo.accent}`}>
              <span>{promo.badge}</span>
              <strong>{promo.title}</strong>
              <p>{promo.code}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-hub">
        <Link to="/akun" className="feature-hub__card">
          <span className="feature-hub__icon">01</span>
          <div>
            <strong>Akun Saya</strong>
            <p>Login, register, dan atur profil pelanggan.</p>
          </div>
        </Link>
        <Link to="/pesanan" className="feature-hub__card">
          <span className="feature-hub__icon">02</span>
          <div>
            <strong>Pesanan Saya</strong>
            <p>Tracking status dan riwayat order.</p>
          </div>
        </Link>
        <Link to="/promo" className="feature-hub__card">
          <span className="feature-hub__icon">03</span>
          <div>
            <strong>Promo</strong>
            <p>Diskon, bundling, dan voucher aktif.</p>
          </div>
        </Link>
        <Link to="/lokasi" className="feature-hub__card">
          <span className="feature-hub__icon">04</span>
          <div>
            <strong>Lokasi / Kontak</strong>
            <p>Alamat warung, maps, dan WhatsApp.</p>
          </div>
        </Link>
      </section>

      <header className="hero-card">
        <div className="hero-card__copy">
          <span className="eyebrow">Customer Experience</span>
          <h1>Pemesanan menu Warung Kopi yang hangat, cepat, dan siap dipakai.</h1>
          <p>
            Frontend ini fokus ke user dulu: pilih menu, simpan favorit, atur pre-order,
            gabung group order, langganan kopi, dan cek rekomendasi personal.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="btn btn-primary">
              Mulai pilih menu
            </a>
            <a href="#tools" className="btn btn-secondary">
              Atur pre-order
            </a>
          </div>
        </div>

        <div className="hero-card__visual">
          <div className="hero-card__stack">
            <div className="hero-stat">
              <span>Keranjang aktif</span>
              <strong>{cartCount} item</strong>
              <small>{formatRupiah(subtotal)}</small>
            </div>
            <div className="hero-stat">
              <span>Poin loyalty</span>
              <strong>{loyaltyPoints}</strong>
              <small>{cartPoints} poin dari keranjang ini</small>
            </div>
            <div className="hero-stat">
              <span>Jadwal ambil</span>
              <strong>{pickupTime}</strong>
              <small>{preOrder ? preOrder.status : 'Belum dijadwalkan'}</small>
            </div>
            <div className="hero-stat hero-stat--wide">
              <span>Menu favorit</span>
              <strong>{favoriteCoffee}</strong>
              <small>{subscription ? planStatus : 'Siap dipersonalisasi'}</small>
            </div>
          </div>
        </div>
      </header>

      <section className="search-card">
        <label className="field field--search">
          <span>Cari menu</span>
          <input
            id="menu-search"
            ref={searchInputRef}
            type="search"
            placeholder="Contoh: latte, matcha, roti bakar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="quick-filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${category === item ? 'is-active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="layout-grid">
        <main className="content-column">
          <section className="panel panel--recommendation">
            <div className="section-head">
              <div>
                <span className="eyebrow">Personalized Suggestions</span>
                <h2>Rekomendasi untuk kamu</h2>
              </div>
              <p>Diambil dari favorit, kategori yang sering dipilih, dan menu unggulan.</p>
            </div>

            <div className="recommendation-strip">
              {recommendations.map((item) => (
                <div key={item.id} className="recommendation-card">
                  <div className={`recommendation-card__art ${item.accent}`}>
                    <strong>{item.initials}</strong>
                  </div>
                  <div>
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" id="menu">
            <div className="section-head">
              <div>
                <span className="eyebrow">Menu Pilihan</span>
                <h2>{loadingMenu ? 'Memuat menu...' : 'Daftar menu untuk user'}</h2>
              </div>
              <p>Setiap menu bisa dipilih ukuran Tall, Grande, atau Venti sebelum masuk keranjang.</p>
            </div>

            <div className="menu-grid">
              {filteredMenu.map((product) => (
                  <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIdSet.has(Number(product.id))}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  onAddToGroup={addToGroup}
                />
              ))}
            </div>
          </section>

          <section className="panel" id="tools">
            <div className="section-head">
              <div>
                <span className="eyebrow">Fitur Utama User</span>
                <h2>Pre-order, grup, langganan, dan insight pribadi</h2>
              </div>
              <p>Bagian ini meng-cover fitur yang paling relevan untuk pelanggan dulu.</p>
            </div>

            <div className="tools-grid">
              <article className="tool-card">
                <span className="eyebrow">Pre-order Scheduling</span>
                <h3>Atur jam ambil dan simpan pre-order</h3>
                <p>
                  Pilih jam ambil, tulis catatan, lalu simpan order agar bisa diubah atau dibatalkan sebelum checkout.
                </p>
                <div className="tool-card__actions">
                  <button type="button" className="btn btn-primary" onClick={savePreOrder} disabled={!cart.length}>
                    Simpan Pre-order
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelPreOrder} disabled={!preOrder}>
                    Batalkan
                  </button>
                </div>
              </article>

              <article className="tool-card">
                <span className="eyebrow">Group Order & Split Payment</span>
                <h3>Gabung pesanan bareng teman</h3>
                <p>
                  Tambahkan semua isi keranjang ke grup, bagikan kode undangan, dan bagi tagihan per orang.
                </p>
                <div className="tool-card__mini-grid">
                  <label className="field">
                    <span>Anggota</span>
                    <input
                      type="number"
                      min="1"
                      value={groupOrder.members}
                      onChange={(event) => updateGroupMembers(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Kode grup</span>
                    <input type="text" value={groupOrder.code} readOnly />
                  </label>
                </div>
                <div className="tool-card__actions">
                  <button type="button" className="btn btn-primary" onClick={addCartToGroup} disabled={!cart.length}>
                    Tambah keranjang ke grup
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={copyInviteCode}>
                    Salin undangan
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={confirmGroupPayment}
                    disabled={!groupOrder.items.length}
                  >
                    Konfirmasi pembayaran grup
                  </button>
                </div>
              </article>

              <article className="tool-card">
                <span className="eyebrow">Coffee Subscription</span>
                <h3>Aktifkan langganan favorit</h3>
                <p>
                  Cukup pilih plan yang cocok. User bisa mulai dari paket harian hingga paket tim.
                </p>
                <div className="subscription-list">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      className={`subscription-plan ${subscription?.id === plan.id ? 'is-active' : ''} ${plan.accent}`}
                      onClick={() => activatePlan(plan)}
                    >
                      <div>
                        <strong>{plan.name}</strong>
                        <span>{formatRupiah(plan.price)}</span>
                      </div>
                      <small>{plan.description}</small>
                    </button>
                  ))}
                </div>
              </article>

              <article className="tool-card">
                <span className="eyebrow">Analytics Dashboard</span>
                <h3>Ringkasan kebiasaan ngopi</h3>
                <div className="insight-list">
                  <div>
                    <span>Total belanja</span>
                    <strong>{formatRupiah(monthlySpend)}</strong>
                  </div>
                  <div>
                    <span>Menu favorit</span>
                    <strong>{favoriteCoffee}</strong>
                  </div>
                  <div>
                    <span>Status langganan</span>
                    <strong>{planStatus}</strong>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="section-head">
              <div>
                <span className="eyebrow">Riwayat Order</span>
                <h2>Order terakhir yang tersimpan</h2>
              </div>
              <p>Digunakan untuk melihat pola belanja dan menu yang sering dipilih.</p>
            </div>

            <div className="history-grid">
              {history.length === 0 ? (
                <div className="empty-state empty-state--wide">
                  <strong>Belum ada riwayat pesanan.</strong>
                  <p>Checkout pertama akan otomatis masuk ke riwayat ini.</p>
                </div>
              ) : (
                history.map((order) => (
                  <article key={order.code} className="history-card">
                    <div className="history-card__head">
                      <div>
                        <span>{order.code}</span>
                        <strong>{new Date(order.createdAt).toLocaleString('id-ID')}</strong>
                      </div>
                      <strong>{formatRupiah(order.total)}</strong>
                    </div>
                    <p>
                      {(Array.isArray(order.items) ? order.items.length : 0)} item, meja {order.tableNumber || '-'}, pickup {order.pickupTime || '-'}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>

        <div className="sidebar-column">
          <CartFloating
            cart={cart}
            subtotal={subtotal}
            tableNumber={tableNumber}
            pickupTime={pickupTime}
            orderNote={orderNote}
            preOrder={preOrder}
            loyaltyPoints={loyaltyPoints}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onTableNumberChange={setTableNumber}
            onPickupTimeChange={setPickupTime}
            onOrderNoteChange={setOrderNote}
            onSavePreOrder={savePreOrder}
            onCancelPreOrder={cancelPreOrder}
            onCheckout={checkout}
          />

          <section className="panel panel--compact">
            <div className="section-head section-head--compact">
              <div>
                <span className="eyebrow">Quick Facts</span>
                <h2>Menu cepat untuk user</h2>
              </div>
            </div>
            <div className="quick-facts">
              <div>
                <span>Menu tampil</span>
                <strong>{filteredMenu.length}</strong>
              </div>
              <div>
                <span>Favorit tersimpan</span>
                <strong>{favorites.length}</strong>
              </div>
              <div>
                <span>Group split</span>
                <strong>{splitPayment > 0 ? formatRupiah(splitPayment) : '-'}</strong>
              </div>
              <div>
                <span>Pre-order aktif</span>
                <strong>{preOrder ? 'Ya' : 'Belum'}</strong>
              </div>
              <div>
                <span>Order terakhir</span>
                <strong>{latestOrder ? latestOrder.code : '-'}</strong>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default MenuView
