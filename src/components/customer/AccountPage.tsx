import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Order,
  Product,
  Address,
  BespokeRequest,
  UserProfile,
  SizingProfile,
  SizeOption,
} from '../../types'
import { calculateSizePrice } from '../../data/initialData'

interface AccountPageProps {
  onBack: () => void
  orders: Order[]
  wishlist: number[]
  products: Product[]
  addresses: Address[]
  bespokeRequests: BespokeRequest[]
  userProfile: UserProfile
  sizingProfile: SizingProfile
  onUpdateUserProfile: (profile: UserProfile) => void
  onUpdateSizingProfile: (profile: SizingProfile) => void
  onAddAddress: (address: Omit<Address, 'id'>) => void
  onSetDefaultAddress: (id: number) => void
  onDeleteAddress: (id: number) => void
  onMoveWishlistToCart: (product: Product, size: SizeOption, unitPrice: number) => void
  onToggleWishlist: (id: number) => void
  onReorder: (order: Order) => void
  onRedeemVoucher: (pointsCost: number, discountAmount: number, code: string) => void
  formatPrice: (pkr: number) => string
  showToast: (msg: string, type?: 'success' | 'info' | 'cart') => void
  cartCount: number
  onOpenCart: () => void
  onSelectProduct?: (product: Product) => void
}

type DashboardTab =
  | 'overview'
  | 'orders'
  | 'wishlist'
  | 'bespoke'
  | 'addresses'
  | 'loyalty'
  | 'sizing'
  | 'settings'

export function AccountPage({
  onBack,
  orders,
  wishlist,
  products,
  addresses,
  bespokeRequests,
  userProfile,
  sizingProfile,
  onUpdateUserProfile,
  onUpdateSizingProfile,
  onAddAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  onMoveWishlistToCart,
  onToggleWishlist,
  onReorder,
  onRedeemVoucher,
  formatPrice,
  showToast,
  cartCount,
  onOpenCart,
  onSelectProduct,
}: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all')

  // Sub-dialog states inside account page
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null)
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null)
  const [exchangeOrder, setExchangeOrder] = useState<Order | null>(null)
  const [exchangeReason, setExchangeReason] = useState('Size too large')
  const [exchangeNotes, setExchangeNotes] = useState('')
  const [showAddAddressModal, setShowAddAddressModal] = useState(false)

  // Wishlist selected sizes state per product
  const [wishlistSizes, setWishlistSizes] = useState<Record<number, SizeOption>>({})

  // Local forms state
  const [editProfile, setEditProfile] = useState<UserProfile>({ ...userProfile })
  const [editSizing, setEditSizing] = useState<SizingProfile>({ ...sizingProfile })
  const [newAddr, setNewAddr] = useState({
    name: '',
    phone: '',
    city: 'Islamabad',
    address: '',
    isDefault: false,
  })

  // Filtered orders
  const visibleOrders = orders.filter((o) => {
    if (orderFilter === 'active') return o.status !== 'Delivered'
    if (orderFilter === 'delivered') return o.status === 'Delivered'
    return true
  })

  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault()
    onUpdateUserProfile(editProfile)
    showToast('Profile information successfully updated!', 'success')
  }

  const handleSizingSave = (e: FormEvent) => {
    e.preventDefault()
    onUpdateSizingProfile(editSizing)
    showToast('Body measurements saved to your account!', 'success')
  }

  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newAddr.name || !newAddr.address) return
    onAddAddress(newAddr)
    setShowAddAddressModal(false)
    setNewAddr({ name: '', phone: '', city: 'Islamabad', address: '', isDefault: false })
    showToast('New delivery address added!', 'success')
  }

  const handleExchangeSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!exchangeOrder) return
    showToast(
      `Exchange request for Order #${exchangeOrder.id} confirmed! Trax Courier will pick up within 48h.`,
      'success'
    )
    setExchangeOrder(null)
    setExchangeNotes('')
  }

  const sizeList: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom']

  return (
    <div className="account-page-wrapper">
      {/* 1. TOP STICKY APP BAR (Daraz / Shopify Standard) */}
      <nav className="account-top-bar" aria-label="Account navigation">
        <div className="account-top-bar-inner">
          <button
            type="button"
            className="account-back-btn"
            onClick={onBack}
            aria-label="Back to store"
          >
            <span className="account-back-arrow">←</span>
            <span className="account-back-text">Store</span>
          </button>

          <div className="account-top-title-group">
            <span className="account-top-title">JIYA COLLECTIONS</span>
            <span className="account-top-subtitle">VIP Client Portal</span>
          </div>

          <div className="account-top-actions">
            <button
              type="button"
              className={`account-icon-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              ❤️
              {wishlist.length > 0 && <span className="account-badge">{wishlist.length}</span>}
            </button>
            <button
              type="button"
              className="account-icon-btn"
              onClick={onOpenCart}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              🛒
              {cartCount > 0 && <span className="account-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN ACCOUNT CONTENT */}
      <main className="account-page-main">
        {/* VIP Profile Banner Card */}
        <section className="account-hero-card">
          <div className="ah-profile-row">
            <div className="ah-avatar-ring">
              <span className="ah-avatar-mono">{userProfile.avatarInitial}</span>
              <span className="ah-vip-badge" title="Verified Customer">✓</span>
            </div>
            <div className="ah-user-meta">
              <div className="ah-name-line">
                <h2>{userProfile.name}</h2>
                <span className="ah-tier-pill">👑 {userProfile.tier || 'Gold VIP'}</span>
              </div>
              <div className="ah-details-line">
                <span>📍 {userProfile.city}, PK</span>
                <span>📞 {userProfile.phone}</span>
                <span>📅 Member since {userProfile.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Daraz-Style Quick KPI Chips */}
          <div className="ah-kpi-grid">
            <div className="ah-kpi-card" onClick={() => setActiveTab('orders')} role="button" tabIndex={0}>
              <span className="ah-kpi-val">{orders.length}</span>
              <span className="ah-kpi-lbl">Total Orders</span>
            </div>
            <div className="ah-kpi-card" onClick={() => setActiveTab('loyalty')} role="button" tabIndex={0}>
              <span className="ah-kpi-val">{userProfile.points}</span>
              <span className="ah-kpi-lbl">Reward Points</span>
            </div>
            <div className="ah-kpi-card" onClick={() => setActiveTab('loyalty')} role="button" tabIndex={0}>
              <span className="ah-kpi-val">{formatPrice(userProfile.walletBalance)}</span>
              <span className="ah-kpi-lbl">Wallet Cash</span>
            </div>
            <div className="ah-kpi-card" onClick={() => setActiveTab('wishlist')} role="button" tabIndex={0}>
              <span className="ah-kpi-val">{wishlist.length}</span>
              <span className="ah-kpi-lbl">Saved Wishlist</span>
            </div>
          </div>
        </section>

        {/* Daraz 4-Stage Order Status Ribbon */}
        <section className="account-order-ribbon">
          <div className="aor-header">
            <span className="aor-heading">My Orders Status</span>
            <button
              type="button"
              className="aor-view-all-link"
              onClick={() => {
                setActiveTab('orders')
                setOrderFilter('all')
              }}
            >
              View All Orders ({orders.length}) →
            </button>
          </div>

          <div className="aor-cards-strip">
            <div
              className="aor-item"
              onClick={() => {
                setActiveTab('orders')
                setOrderFilter('all')
              }}
              role="button"
              tabIndex={0}
            >
              <div className="aor-icon-box">💳</div>
              <span className="aor-title">To Pay</span>
              <span className="aor-count">0</span>
            </div>

            <div
              className="aor-item"
              onClick={() => {
                setActiveTab('orders')
                setOrderFilter('active')
              }}
              role="button"
              tabIndex={0}
            >
              <div className="aor-icon-box">📦</div>
              <span className="aor-title">To Ship</span>
              <span className="aor-count highlight">{activeOrdersCount}</span>
            </div>

            <div
              className="aor-item"
              onClick={() => {
                setActiveTab('orders')
                setOrderFilter('active')
              }}
              role="button"
              tabIndex={0}
            >
              <div className="aor-icon-box">🚚</div>
              <span className="aor-title">To Receive</span>
              <span className="aor-count highlight">{activeOrdersCount}</span>
            </div>

            <div
              className="aor-item"
              onClick={() => {
                setActiveTab('orders')
                setOrderFilter('delivered')
              }}
              role="button"
              tabIndex={0}
            >
              <div className="aor-icon-box">⭐</div>
              <span className="aor-title">Delivered</span>
              <span className="aor-count">{deliveredOrdersCount}</span>
            </div>
          </div>
        </section>

        {/* Dedicated Modern Tab Bar */}
        <nav className="account-tabs-nav" aria-label="Account sections">
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            ❤️ Wishlist ({wishlist.length})
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'bespoke' ? 'active' : ''}`}
            onClick={() => setActiveTab('bespoke')}
          >
            ✂ Custom Stitching ({bespokeRequests.length})
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Addresses ({addresses.length})
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            🪙 Rewards & Coins
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'sizing' ? 'active' : ''}`}
            onClick={() => setActiveTab('sizing')}
          >
            📏 Sizing Profile
          </button>
          <button
            type="button"
            className={`at-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙ Settings
          </button>
        </nav>

        {/* Tab Content Container */}
        <div className="account-tab-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane-overview">
              <div className="welcome-banner-card">
                <div>
                  <span className="client-tier-pill">VIP Client</span>
                  <h3>Welcome back, {userProfile.name}</h3>
                  <p>
                    Manage your ongoing orders, track live Trax courier deliveries, redeem reward coins, and view your custom Lahore tailor fit.
                  </p>
                </div>
                <div className="wb-right">
                  <button
                    type="button"
                    className="btn-primary-luxury"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders ({orders.length}) →
                  </button>
                </div>
              </div>

              {/* Order quick snapshot */}
              {orders.length > 0 && (
                <div className="overview-card" style={{ marginBottom: '20px' }}>
                  <div className="oc-header">
                    <div>
                      <span className="oc-eyebrow">Recent Delivery</span>
                      <h4>Order #{orders[0].id}</h4>
                    </div>
                    <span className="badge-status delivered">{orders[0].status}</span>
                  </div>
                  <p className="oc-eta">
                    Courier: <strong>Trax Express</strong> · Tracking: <strong>{orders[0].trackingCode || 'TRX-849102-LHR'}</strong>
                  </p>
                  <div className="oc-items-preview">
                    {orders[0].items.map((it, idx) => (
                      <div key={idx} className="oc-mini-item">
                        <img src={it.product.image} alt={it.product.name} />
                        <div>
                          <strong>{it.product.name}</strong>
                          <span>Size: {it.size} · Qty: {it.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="oc-actions-row">
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      onClick={() => setTrackingOrder(orders[0])}
                    >
                      🚚 Track Live Status
                    </button>
                    <button
                      type="button"
                      className="btn-outline-luxury sm"
                      onClick={() => setInvoiceOrder(orders[0])}
                    >
                      📄 View Invoice
                    </button>
                  </div>
                </div>
              )}

              {/* Sizing & Wallet summary cards */}
              <div className="overview-lower-grid">
                <div className="overview-card-flat">
                  <div className="oc-flat-header">
                    <strong>My Custom Measurements</strong>
                    <button
                      type="button"
                      className="text-link-sm"
                      onClick={() => setActiveTab('sizing')}
                    >
                      Edit Sizing →
                    </button>
                  </div>
                  <div className="sizing-pills-row">
                    <span>Fit: {sizingProfile.preferredEase}</span>
                    <span>Bust: {sizingProfile.bust}"</span>
                    <span>Waist: {sizingProfile.waist}"</span>
                    <span>Hip: {sizingProfile.hip}"</span>
                    <span>Length: {sizingProfile.kurtaLength}"</span>
                  </div>
                </div>

                <div className="overview-card-flat">
                  <div className="oc-flat-header">
                    <strong>Store Wallet & Coins</strong>
                    <button
                      type="button"
                      className="text-link-sm"
                      onClick={() => setActiveTab('loyalty')}
                    >
                      Redeem Vouchers →
                    </button>
                  </div>
                  <p className="wallet-note">
                    Available Coins: <strong>{userProfile.points} Pts</strong> (Worth {formatPrice(userProfile.points * 2)} discount vouchers).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="tab-pane-orders">
              <div className="orders-toolbar">
                <div className="order-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill-sm ${orderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('all')}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill-sm ${orderFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('active')}
                  >
                    Active / In Transit ({activeOrdersCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill-sm ${orderFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('delivered')}
                  >
                    Delivered ({deliveredOrdersCount})
                  </button>
                </div>
                <span className="orders-guarantee-note">
                  🔒 Trax 7-Day Exchange Guaranteed
                </span>
              </div>

              <div className="orders-cards-stack">
                {visibleOrders.map((order) => (
                  <div key={order.id} className="client-order-card">
                    <div className="client-order-header">
                      <div>
                        <strong className="order-code">Order #{order.id}</strong>
                        <span className="order-timestamp">{order.date}</span>
                        <span className="order-tracking-num">Tracking: {order.trackingCode || 'TRX-849102-LHR'}</span>
                      </div>
                      <div className="coh-status">
                        <span className="order-grand-total">{formatPrice(order.total)}</span>
                        <span
                          className={`badge-status ${
                            order.status === 'Delivered'
                              ? 'delivered'
                              : order.status === 'Dispatched'
                              ? 'processing'
                              : 'active'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="order-items-table">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.product.image} alt={item.product.name} />
                          <div className="oir-details">
                            <strong>{item.product.name}</strong>
                            <span>Size: {item.size} · Quantity: {item.quantity}</span>
                            <small>{item.product.fabric} · {item.product.color}</small>
                          </div>
                          <div className="oir-price">
                            <strong>{formatPrice((item.unitPrice || item.product.price) * item.quantity)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons in Clean 2x2 Grid */}
                    <div className="client-order-footer">
                      <div className="cof-left">
                        <span>Payment: {order.customer.paymentMethod}</span>
                        {order.customer.transactionId && (
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--terracotta)', fontFamily: 'var(--font-mono)' }}>
                            TID: {order.customer.transactionId}
                          </span>
                        )}
                        <small>Deliver to: {order.customer.address}, {order.customer.city}</small>
                      </div>

                      <div className="cof-actions order-actions-bar">
                        <button
                          type="button"
                          className="btn-primary-luxury sm"
                          onClick={() => setTrackingOrder(order)}
                        >
                          🚚 Track Delivery
                        </button>
                        <button
                          type="button"
                          className="btn-outline-luxury sm"
                          onClick={() => setInvoiceOrder(order)}
                        >
                          📄 View Invoice
                        </button>
                        <button
                          type="button"
                          className="btn-outline-luxury sm"
                          onClick={() => onReorder(order)}
                        >
                          ↺ Reorder
                        </button>
                        <button
                          type="button"
                          className="btn-outline-luxury sm"
                          onClick={() => setExchangeOrder(order)}
                        >
                          ⇄ Exchange
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {visibleOrders.length === 0 && (
                  <div className="portal-empty-card">
                    <p>No orders found under this filter category.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED WISHLIST (FULL-WIDTH MOBILE CARDS) */}
          {activeTab === 'wishlist' && (
            <div className="tab-pane-wishlist">
              <div className="wishlist-toolbar">
                <div>
                  <h4>Saved Wishlist ({wishlist.length})</h4>
                  <p>Bookmarked items ready to add to your bag with custom sizing.</p>
                </div>
                {wishlist.length > 0 && (
                  <button
                    type="button"
                    className="btn-primary-luxury sm"
                    onClick={() => {
                      const saved = products.filter((p) => wishlist.includes(p.id))
                      saved.forEach((p) => {
                        const sz = wishlistSizes[p.id] || 'M'
                        const pr = calculateSizePrice(p.price, sz)
                        onMoveWishlistToCart(p, sz, pr)
                      })
                      showToast('All saved items moved to cart!', 'cart')
                    }}
                  >
                    Move All to Cart →
                  </button>
                )}
              </div>

              <div className="wishlist-products-grid portal-wishlist-grid">
                {products
                  .filter((p) => wishlist.includes(p.id))
                  .map((product) => {
                    const chosenSize = wishlistSizes[product.id] || 'M'
                    const chosenPrice = calculateSizePrice(product.price, chosenSize)
                    return (
                      <div key={product.id} className="suite-wish-card portal-wish-card">
                        <div
                          className="sw-img-wrap"
                          onClick={() => onSelectProduct && onSelectProduct(product)}
                          style={{ cursor: onSelectProduct ? 'pointer' : 'default' }}
                        >
                          <img src={product.image} alt={product.name} />
                          {product.tag && <span className="sw-tag">{product.tag}</span>}
                        </div>

                        <div className="sw-info">
                          <span className="sw-cat">{product.category}</span>
                          <h5
                            onClick={() => onSelectProduct && onSelectProduct(product)}
                            style={{ cursor: onSelectProduct ? 'pointer' : 'default' }}
                          >
                            {product.name}
                          </h5>
                          <p>{product.fabric} · {product.color}</p>

                          {/* Inline size selector with rates */}
                          <div className="wishlist-size-picker">
                            <label>Size & Rate:</label>
                            <select
                              value={chosenSize}
                              onChange={(e) =>
                                setWishlistSizes({
                                  ...wishlistSizes,
                                  [product.id]: e.target.value as SizeOption,
                                })
                              }
                              className="luxury-select sm"
                            >
                              {sizeList.map((sz) => {
                                const pVal = calculateSizePrice(product.price, sz)
                                return (
                                  <option key={sz} value={sz}>
                                    {sz} — {formatPrice(pVal)}
                                  </option>
                                )
                              })}
                            </select>
                          </div>

                          <div className="sw-btns-row">
                            <button
                              type="button"
                              className="btn-primary-luxury sm"
                              onClick={() => {
                                onMoveWishlistToCart(product, chosenSize, chosenPrice)
                                showToast(`Added "${product.name}" (${chosenSize}) to cart!`, 'cart')
                              }}
                            >
                              Add ({chosenSize}) to Cart · {formatPrice(chosenPrice)}
                            </button>
                            <button
                              type="button"
                              className="btn-outline-luxury sm delete"
                              onClick={() => {
                                onToggleWishlist(product.id)
                                showToast(`Removed from wishlist`, 'info')
                              }}
                              aria-label="Remove from wishlist"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {wishlist.length === 0 && (
                  <div className="portal-empty-card">
                    <span className="empty-glyph">♡</span>
                    <h4>Your saved pieces collection is empty</h4>
                    <p>Browse our lawn, raw silk, and abaya edits to bookmark your favourites.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM STITCHING REQUESTS */}
          {activeTab === 'bespoke' && (
            <div className="tab-pane-bespoke">
              <div className="bespoke-toolbar">
                <div>
                  <h4>Custom Stitching Orders ({bespokeRequests.length})</h4>
                  <p>Track your custom tailored stitching orders tailored in Lahore.</p>
                </div>
              </div>

              <div className="bespoke-cards-stack">
                {bespokeRequests.map((req) => (
                  <div key={req.id} className="bespoke-request-card">
                    <div className="brc-top">
                      <div>
                        <strong className="brc-ref">Order Ref: #{req.id}</strong>
                        <span className="brc-date">Submitted on {req.date}</span>
                      </div>
                      <span className="bespoke-status-tag">{req.status}</span>
                    </div>

                    <div className="brc-specs-grid">
                      <div>
                        <span>Fabric:</span>
                        <strong>{req.fabric}</strong>
                      </div>
                      <div>
                        <span>Silhouette:</span>
                        <strong>{req.silhouette}</strong>
                      </div>
                      <div>
                        <span>Colorway:</span>
                        <strong>{req.colorPreference}</strong>
                      </div>
                      <div>
                        <span>Measurements:</span>
                        <strong>Bust {req.bust}" · Waist {req.waist}" · Length {req.length}"</strong>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="brc-notes">
                        <strong>Tailoring Notes:</strong> {req.notes}
                      </p>
                    )}

                    <div className="brc-actions">
                      <span>Target Delivery: {req.eventDate}</span>
                      <a
                        href={`https://wa.me/923018472910?text=Hi%20Jiya%20Collections,%20inquiring%20about%20my%20Custom%20Order%20${req.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary-luxury sm"
                      >
                        Inquire on WhatsApp 💬
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="tab-pane-addresses">
              <div className="address-toolbar">
                <div>
                  <h4>Delivery Addresses ({addresses.length})</h4>
                  <p>Manage your home, office, and gifting delivery locations in Pakistan.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-luxury sm"
                  onClick={() => setShowAddAddressModal(true)}
                >
                  + Add New Address
                </button>
              </div>

              <div className="addresses-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                    <div className="addr-top">
                      <strong>{addr.name}</strong>
                      {addr.isDefault && <span className="default-pill">DEFAULT</span>}
                    </div>
                    <p className="addr-text">{addr.address}, {addr.city}</p>
                    <span className="addr-phone">📞 {addr.phone}</span>
                    <div className="addr-actions">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="btn-outline-luxury sm"
                          onClick={() => onSetDefaultAddress(addr.id)}
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-outline-luxury sm delete"
                        onClick={() => onDeleteAddress(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REWARDS & COINS */}
          {activeTab === 'loyalty' && (
            <div className="tab-pane-loyalty">
              <div className="loyalty-hero-box">
                <div className="lh-header">
                  <div>
                    <span className="client-tier-pill">Rewards & Coins Club</span>
                    <h3>{userProfile.points} Reward Coins Available</h3>
                    <p>Earn 1 coin for every Rs. 100 spent. Redeem coins for instant cash discounts.</p>
                  </div>
                  <div className="lh-rate-tag">1 Coin = Rs. 2 Discount</div>
                </div>

                <div className="tier-progress-bar-wrap">
                  <div className="tpb-labels">
                    <span>Silver Member (0 pts)</span>
                    <span>Gold VIP (1,000 pts)</span>
                    <span>Platinum VIP (2,500 pts)</span>
                  </div>
                  <div className="tpb-track">
                    <div
                      className="tpb-fill"
                      style={{ width: `${Math.min(100, (userProfile.points / 2500) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="rewards-vouchers-grid">
                <div className="voucher-card">
                  <div className="vc-left">
                    <span className="vc-val">Rs. 500 OFF</span>
                    <span className="vc-code">CODE: REWARD500</span>
                  </div>
                  <div className="vc-right">
                    <span className="vc-cost">Cost: 250 Coins</span>
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      disabled={userProfile.points < 250}
                      onClick={() => onRedeemVoucher(250, 500, 'REWARD500')}
                    >
                      Redeem Voucher
                    </button>
                  </div>
                </div>

                <div className="voucher-card">
                  <div className="vc-left">
                    <span className="vc-val">Rs. 1,200 OFF</span>
                    <span className="vc-code">CODE: REWARD1200</span>
                  </div>
                  <div className="vc-right">
                    <span className="vc-cost">Cost: 600 Coins</span>
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      disabled={userProfile.points < 600}
                      onClick={() => onRedeemVoucher(600, 1200, 'REWARD1200')}
                    >
                      Redeem Voucher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SIZING PROFILE */}
          {activeTab === 'sizing' && (
            <div className="tab-pane-sizing">
              <form onSubmit={handleSizingSave} className="sizing-profile-form">
                <div className="form-header">
                  <h4>Custom Master Tailoring Fit Profile</h4>
                  <p>Save your exact body measurements for tailored shirts, kurtas, and trousers.</p>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Bust (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.bust}
                      onChange={(e) => setEditSizing({ ...editSizing, bust: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Waist (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.waist}
                      onChange={(e) => setEditSizing({ ...editSizing, waist: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Hip (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.hip}
                      onChange={(e) => setEditSizing({ ...editSizing, hip: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Shoulder Width (Inches)</label>
                    <input
                      type="text"
                      value={editSizing.shoulder}
                      onChange={(e) => setEditSizing({ ...editSizing, shoulder: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Preferred Kurta Length (Inches)</label>
                    <input
                      type="text"
                      value={editSizing.kurtaLength}
                      onChange={(e) => setEditSizing({ ...editSizing, kurtaLength: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Sleeve Length (Inches)</label>
                    <input
                      type="text"
                      value={editSizing.sleeveLength}
                      onChange={(e) => setEditSizing({ ...editSizing, sleeveLength: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Your Height</label>
                    <input
                      type="text"
                      value={editSizing.height}
                      onChange={(e) => setEditSizing({ ...editSizing, height: e.target.value })}
                      placeholder="e.g. 5 ft 5 in"
                      className="luxury-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Preferred Fit Style</label>
                    <select
                      value={editSizing.preferredEase}
                      onChange={(e) =>
                        setEditSizing({
                          ...editSizing,
                          preferredEase: e.target.value as SizingProfile['preferredEase'],
                        })
                      }
                      className="luxury-select"
                    >
                      <option>Modest Relaxed</option>
                      <option>Tailored Contemporary</option>
                      <option>Structured Standard</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary-luxury" style={{ marginTop: '16px' }}>
                  Save Tailoring Measurements ✓
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="tab-pane-settings">
              <form onSubmit={handleProfileSave} className="settings-form">
                <div className="form-header">
                  <h4>Account Profile & Contact Information</h4>
                  <p>Update your name, contact phone number, and city for dispatch records.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="luxury-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>Mobile Number (For Courier Updates)</label>
                    <input
                      type="text"
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                      className="luxury-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                      className="luxury-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>City</label>
                    <select
                      value={editProfile.city}
                      onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                      className="luxury-select"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary-luxury" style={{ marginTop: '16px' }}>
                  Update Profile Details ✓
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ================= SUB-MODALS ================= */}

      {/* 1. Trax Courier Live Tracking Modal */}
      {trackingOrder && (
        <div className="sub-modal-backdrop" onClick={() => setTrackingOrder(null)}>
          <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="smd-header">
              <div>
                <span className="courier-carrier-badge">TRAX LOGISTICS PK</span>
                <h4>Live Tracking: #{trackingOrder.trackingCode || 'TRX-849102-LHR'}</h4>
              </div>
              <button className="smd-close" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>
            <div className="live-courier-stepper">
              <div className="lcs-step completed">
                <span className="lcs-dot" />
                <div>
                  <strong>Order Dispatched from Lahore Warehouse</strong>
                  <small>Trax Hub · Gulberg III, Lahore</small>
                </div>
              </div>
              <div className="lcs-step active">
                <span className="lcs-dot" />
                <div>
                  <strong>In Transit via Overland Express</strong>
                  <small>Expected delivery in 24-48 hours</small>
                </div>
              </div>
              <div className="lcs-step">
                <span className="lcs-dot" />
                <div>
                  <strong>Out for Delivery to Customer</strong>
                  <small>Rider will call {trackingOrder.customer.phone}</small>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary-luxury"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => setTrackingOrder(null)}
            >
              Close Tracker
            </button>
          </div>
        </div>
      )}

      {/* 2. Official Tax Invoice Modal */}
      {invoiceOrder && (
        <div className="sub-modal-backdrop" onClick={() => setInvoiceOrder(null)}>
          <div className="sub-modal-dialog invoice-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-head">
              <div>
                <h3>JIYA COLLECTIONS</h3>
                <span>Gulberg III, Lahore · NTN: 8947219-4</span>
              </div>
              <button className="smd-close" onClick={() => setInvoiceOrder(null)}>✕</button>
            </div>
            <div className="invoice-meta-row">
              <div>
                <strong>Invoice: #{invoiceOrder.id}</strong>
                <span>Date: {invoiceOrder.date}</span>
              </div>
              <div>
                <strong>Customer: {invoiceOrder.customer.name}</strong>
                <span>{invoiceOrder.customer.city}, PK</span>
              </div>
            </div>
            <div className="invoice-items-list">
              {invoiceOrder.items.map((it, idx) => (
                <div key={idx} className="inv-row">
                  <span>{it.product.name} ({it.size}) × {it.quantity}</span>
                  <strong>{formatPrice((it.unitPrice || it.product.price) * it.quantity)}</strong>
                </div>
              ))}
              <div className="inv-total-row">
                <span>Grand Total ({invoiceOrder.customer.paymentMethod}{invoiceOrder.customer.transactionId ? ` · TID: ${invoiceOrder.customer.transactionId}` : ''}):</span>
                <strong>{formatPrice(invoiceOrder.total)}</strong>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary-luxury"
              style={{ width: '100%', marginTop: '16px' }}
              onClick={() => window.print()}
            >
              Print Official Receipt 🖨
            </button>
          </div>
        </div>
      )}

      {/* 3. Exchange / Return Modal */}
      {exchangeOrder && (
        <div className="sub-modal-backdrop" onClick={() => setExchangeOrder(null)}>
          <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="smd-header">
              <h4>Exchange / Return: Order #{exchangeOrder.id}</h4>
              <button className="smd-close" onClick={() => setExchangeOrder(null)}>✕</button>
            </div>
            <form onSubmit={handleExchangeSubmit}>
              <div className="form-field" style={{ marginBottom: '12px' }}>
                <label>Reason for Exchange</label>
                <select
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="luxury-select"
                >
                  <option value="Size too large">Size too large — Need smaller size</option>
                  <option value="Size too small">Size too small — Need larger size</option>
                  <option value="Color variance">Color preference</option>
                  <option value="Fabric defect">Fabric defect / alteration issue</option>
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label>Alteration / Exchange Notes</label>
                <textarea
                  rows={3}
                  value={exchangeNotes}
                  onChange={(e) => setExchangeNotes(e.target.value)}
                  placeholder="Specify replacement size or alteration measurements..."
                  className="luxury-textarea"
                />
              </div>
              <button type="submit" className="btn-primary-luxury" style={{ width: '100%' }}>
                Confirm Exchange Pickup (Free Trax Courier) →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Address Modal */}
      {showAddAddressModal && (
        <div className="sub-modal-backdrop" onClick={() => setShowAddAddressModal(false)}>
          <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="smd-header">
              <h4>Add New Delivery Address</h4>
              <button className="smd-close" onClick={() => setShowAddAddressModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div className="form-field" style={{ marginBottom: '10px' }}>
                <label>Contact Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  placeholder="e.g. Fatima Khan"
                  className="luxury-input"
                />
              </div>
              <div className="form-field" style={{ marginBottom: '10px' }}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  placeholder="0300-1234567"
                  className="luxury-input"
                />
              </div>
              <div className="form-field" style={{ marginBottom: '10px' }}>
                <label>City</label>
                <select
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="luxury-select"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>
              <div className="form-field" style={{ marginBottom: '14px' }}>
                <label>Street Address</label>
                <textarea
                  rows={2}
                  required
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  placeholder="House #, Street #, Sector / Colony..."
                  className="luxury-textarea"
                />
              </div>
              <button type="submit" className="btn-primary-luxury" style={{ width: '100%' }}>
                Save Delivery Address ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
