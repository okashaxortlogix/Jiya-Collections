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
import { sizeSurcharges, calculateSizePrice } from '../../data/initialData'

interface CustomerDashboardProps {
  onClose: () => void
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

export function CustomerDashboard({
  onClose,
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
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all')

  // Sub-dialog states inside dashboard
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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="luxury-client-suite"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Customer Account Portal"
      >
        {/* Modern Clean Client Header (Daraz / Shopify VIP standard) */}
        <header className="client-suite-header">
          <div className="client-header-top-bar">
            <div className="suite-title-meta">
              <span className="suite-app-badge">JIYA CLIENT SUITE</span>
              <h3 className="suite-dialog-title">Account & Orders</h3>
            </div>
            <button
              className="suite-close-btn"
              onClick={onClose}
              aria-label="Close customer portal"
            >
              ✕
            </button>
          </div>

          <div className="client-header-left">
            <div className="client-avatar-ring">
              <span className="client-avatar-monogram">{userProfile.avatarInitial}</span>
              <span className="client-vip-crown" title="Member">✓</span>
            </div>
            <div className="client-identity">
              <div className="client-name-row">
                <h2>{userProfile.name}</h2>
                <span className="client-tier-pill">👑 {userProfile.tier || 'VIP Gold'}</span>
              </div>
              <div className="client-meta-line">
                <span>📍 {userProfile.city}, PK</span>
                <span>📞 {userProfile.phone}</span>
                <span>📅 Member since {userProfile.memberSince}</span>
              </div>
            </div>
          </div>

          <div className="client-kpi-strip">
            <div className="kpi-pill" onClick={() => setActiveTab('orders')} title="View My Orders">
              <span className="kpi-pill-val">{orders.length}</span>
              <span className="kpi-pill-lbl">Orders Placed</span>
            </div>
            <div className="kpi-pill" onClick={() => setActiveTab('loyalty')} title="View Reward Points">
              <span className="kpi-pill-val">{userProfile.points}</span>
              <span className="kpi-pill-lbl">Reward Points</span>
            </div>
            <div className="kpi-pill" onClick={() => setActiveTab('loyalty')} title="View Wallet Balance">
              <span className="kpi-pill-val">{formatPrice(userProfile.walletBalance)}</span>
              <span className="kpi-pill-lbl">Wallet</span>
            </div>
            <div className="kpi-pill" onClick={() => setActiveTab('wishlist')} title="View Wishlist">
              <span className="kpi-pill-val">{wishlist.length}</span>
              <span className="kpi-pill-lbl">Saved Items</span>
            </div>
          </div>
        </header>

        {/* Clean Modern Navigation Bar */}
        <nav className="client-suite-nav">
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            ❤️ Wishlist ({wishlist.length})
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'bespoke' ? 'active' : ''}`}
            onClick={() => setActiveTab('bespoke')}
          >
            ✂ Custom Stitching ({bespokeRequests.length})
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Addresses ({addresses.length})
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            🎁 Rewards & Wallet
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'sizing' ? 'active' : ''}`}
            onClick={() => setActiveTab('sizing')}
          >
            📏 Measurements
          </button>
          <button
            type="button"
            className={`suite-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙ Settings
          </button>
        </nav>

        {/* Dashboard Main Content Body */}
        <div className="client-suite-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="suite-overview-view">
              {/* Personalized Greeting Card */}
              <div className="welcome-banner-card">
                <div className="wb-left">
                  <span className="section-eyebrow">Customer Account</span>
                  <h3>Welcome back, {userProfile.name}!</h3>
                  <p>
                    Manage your recent orders, track courier deliveries, and check your store wallet.
                    You currently have{' '}
                    <strong>{orders.filter((o) => o.status !== 'Delivered').length} active order</strong> in progress.
                  </p>
                </div>
                <div className="wb-right">
                  <button
                    type="button"
                    className="btn-primary-luxury sm"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders →
                  </button>
                </div>
              </div>

              {/* Grid with Active Order & Customer Support */}
              <div className="overview-cards-grid">
                {/* Active Order Spotlight */}
                {orders.length > 0 && (
                  <div className="overview-card active-order-spotlight">
                    <div className="oc-header">
                      <div>
                        <span className="oc-eyebrow">Active Order</span>
                        <h4>Order #{orders[0].id}</h4>
                      </div>
                      <span className={`status-tag ${orders[0].status.toLowerCase().replace(' ', '-')}`}>
                        {orders[0].status}
                      </span>
                    </div>

                    <p className="oc-eta">
                      Estimated Delivery: <strong>{orders[0].estimatedDelivery || 'In 2-3 Days'}</strong> via Trax Express
                    </p>

                    {/* Stepper tracker */}
                    <div className="order-stepper">
                      {['Confirmed', 'In Stitching', 'Dispatched', 'Delivered'].map((step, idx) => {
                        const activeIdx = ['Confirmed', 'In Stitching', 'Dispatched', 'Delivered'].indexOf(orders[0].status)
                        const isDone = activeIdx >= idx
                        return (
                          <div key={step} className={`step-node ${isDone ? 'done' : ''}`}>
                            <span className="node-circle">{isDone ? '✓' : idx + 1}</span>
                            <span className="node-title">{step}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="oc-items-preview">
                      {orders[0].items.map((item, i) => (
                        <div key={i} className="oc-mini-item">
                          <img src={item.product.image} alt={item.product.name} />
                          <div>
                            <strong>{item.product.name}</strong>
                            <span>Qty: {item.quantity} · Size: {item.size} · {item.product.color}</span>
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
                        Track Delivery 🚚
                      </button>
                      <button
                        type="button"
                        className="btn-outline-luxury sm"
                        onClick={() => setInvoiceOrder(orders[0])}
                      >
                        View Invoice 📄
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Support & Sizing Card */}
                <div className="overview-card stylist-concierge-card">
                  <div className="oc-header">
                    <div>
                      <span className="oc-eyebrow">Customer Support</span>
                      <h4>Styling & Order Help</h4>
                    </div>
                    <span className="stylist-verified-badge">Support Online</span>
                  </div>

                  <p className="stylist-bio">
                    Have questions about suit sizing, stitching options, or order dispatch? Our support
                    team in Lahore is ready to assist you.
                  </p>

                  <div className="stylist-perks">
                    <span>✓ Free size and fitting guidance</span>
                    <span>✓ Track parcels with Trax courier</span>
                    <span>✓ 3-Day doorstep exchange guarantee</span>
                  </div>

                  <div className="stylist-cta-group">
                    <a
                      href="https://wa.me/923018472910?text=Salam,%20I%20need%20assistance%20with%20my%20Jiya%20Collections%20account"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary-luxury sm whatsapp-btn"
                    >
                      Chat on WhatsApp 💬
                    </a>
                  </div>
                </div>
              </div>

              {/* Sizing & Wallet Snapshot */}
              <div className="overview-lower-grid">
                <div className="overview-card-flat">
                  <div className="oc-flat-header">
                    <strong>📐 My Saved Measurements</strong>
                    <button type="button" onClick={() => setActiveTab('sizing')} className="text-link-sm">
                      Edit Measurements →
                    </button>
                  </div>
                  <div className="sizing-pills-row">
                    <span>Bust: {sizingProfile.bust}"</span>
                    <span>Waist: {sizingProfile.waist}"</span>
                    <span>Hip: {sizingProfile.hip}"</span>
                    <span>Length: {sizingProfile.kurtaLength}"</span>
                    <span>Fit: {sizingProfile.preferredEase}</span>
                  </div>
                </div>

                <div className="overview-card-flat">
                  <div className="oc-flat-header">
                    <strong>💳 Store Wallet Balance</strong>
                    <button type="button" onClick={() => setActiveTab('loyalty')} className="text-link-sm">
                      View Wallet →
                    </button>
                  </div>
                  <p className="wallet-note">
                    You have <strong>{formatPrice(userProfile.walletBalance)}</strong> store wallet balance ready to
                    apply automatically at checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="suite-orders-view">
              <div className="orders-toolbar">
                <div className="order-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${orderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('all')}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${orderFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('active')}
                  >
                    In Progress ({orders.filter((o) => o.status !== 'Delivered').length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${orderFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('delivered')}
                  >
                    Delivered ({orders.filter((o) => o.status === 'Delivered').length})
                  </button>
                </div>

                <span className="orders-guarantee-note">
                  ✓ 3-Day Doorstep Exchange Guarantee on all orders
                </span>
              </div>

              <div className="orders-cards-stack">
                {visibleOrders.map((order) => (
                  <div key={order.id} className="client-order-card">
                    <div className="client-order-header">
                      <div className="coh-meta">
                        <strong className="order-code">Order #{order.id}</strong>
                        <span className="order-timestamp">Placed: {order.date}</span>
                        <span className="order-tracking-num">
                          Courier: Trax Express ({order.trackingCode || 'TRX-849102-LHR'})
                        </span>
                      </div>

                      <div className="coh-status">
                        <span className={`status-tag ${order.status.toLowerCase().replace(' ', '-')}`}>
                          {order.status}
                        </span>
                        <strong className="order-grand-total">{formatPrice(order.total)}</strong>
                      </div>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="order-stepper">
                      {['Confirmed', 'In Stitching', 'Dispatched', 'Delivered'].map((step, idx) => {
                        const activeIdx = ['Confirmed', 'In Stitching', 'Dispatched', 'Delivered'].indexOf(order.status)
                        const isDone = activeIdx >= idx
                        return (
                          <div key={step} className={`step-node ${isDone ? 'done' : ''}`}>
                            <span className="node-circle">{isDone ? '✓' : idx + 1}</span>
                            <span className="node-title">{step}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Item lines */}
                    <div className="order-items-table">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.product.image} alt={item.product.name} />
                          <div className="oir-details">
                            <strong>{item.product.name}</strong>
                            <span>{item.product.fabric} · {item.product.color}</span>
                            <small>Size: {item.size} · Quantity: {item.quantity}</small>
                          </div>
                          <div className="oir-price">
                            <strong>{formatPrice((item.unitPrice || item.product.price) * item.quantity)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Action Buttons */}
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

          {/* TAB 3: SAVED WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="suite-wishlist-view">
              <div className="wishlist-toolbar">
                <div>
                  <h4>My Saved Wishlist ({wishlist.length})</h4>
                  <p>Items saved to your personal wishlist ready to add to your bag.</p>
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
                        <div className="sw-img-wrap">
                          <img src={product.image} alt={product.name} />
                          {product.tag && <span className="sw-tag">{product.tag}</span>}
                        </div>

                        <div className="sw-info">
                          <span className="sw-cat">{product.category}</span>
                          <h5>{product.name}</h5>
                          <p>{product.fabric} · {product.color}</p>

                          {/* Inline size selector with rates */}
                          <div className="wishlist-size-picker">
                            <label>Choose Size & Rate:</label>
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
                                const surcharge = sizeSurcharges[sz].surcharge
                                return (
                                  <option key={sz} value={sz}>
                                    {sz} — {formatPrice(product.price + surcharge)}
                                  </option>
                                )
                              })}
                            </select>
                          </div>

                          <strong className="sw-price">{formatPrice(chosenPrice)}</strong>

                          <div className="sw-btns-row">
                            <button
                              type="button"
                              className="btn-primary-luxury sm"
                              onClick={() => onMoveWishlistToCart(product, chosenSize, chosenPrice)}
                            >
                              Add ({chosenSize}) to Cart →
                            </button>
                            <button
                              type="button"
                              className="btn-outline-luxury sm delete"
                              onClick={() => onToggleWishlist(product.id)}
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
            <div className="suite-bespoke-view">
              <div className="bespoke-toolbar">
                <div>
                  <h4>Custom Stitching Orders ({bespokeRequests.length})</h4>
                  <p>Track your custom stitching requests tailored to your exact measurements.</p>
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

          {/* TAB 5: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="suite-addresses-view">
              <div className="address-toolbar">
                <div>
                  <h4>Saved Delivery Addresses ({addresses.length})</h4>
                  <p>Manage your doorstep locations across Pakistan for fast checkout.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-luxury sm"
                  onClick={() => setShowAddAddressModal(true)}
                >
                  + Add New Address
                </button>
              </div>

              <div className="addresses-cards-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className="suite-address-card">
                    <div className="sac-header">
                      <strong>{addr.name}</strong>
                      {addr.isDefault && <span className="default-badge">Primary Address</span>}
                    </div>
                    <p className="sac-body">{addr.address}</p>
                    <p className="sac-city">{addr.city}, Pakistan</p>
                    <p className="sac-phone">📞 {addr.phone}</p>

                    <div className="sac-actions">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="btn-outline-luxury sm"
                          onClick={() => {
                            onSetDefaultAddress(addr.id)
                            showToast(`Set "${addr.name}" as primary address`, 'info')
                          }}
                        >
                          Make Primary
                        </button>
                      )}
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          className="btn-outline-luxury sm delete"
                          onClick={() => {
                            onDeleteAddress(addr.id)
                            showToast('Address removed', 'info')
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LOYALTY & REWARDS */}
          {activeTab === 'loyalty' && (
            <div className="suite-loyalty-view">
              <div className="loyalty-hero-banner">
                <div className="lh-copy">
                  <span className="section-eyebrow">Rewards & Loyalty</span>
                  <h3>You Have {userProfile.points} Reward Points</h3>
                  <p>
                    Earn 1 point for every Rs. 100 spent. Redeem points for instant discount vouchers on
                    any order.
                  </p>

                  <div className="loyalty-meter-wrap">
                    <div className="meter-label-row">
                      <span>Current: <strong>Silver Member</strong></span>
                      <span>Next: <strong>Gold Member (1,000 Points)</strong></span>
                    </div>
                    <div className="loyalty-bar-track">
                      <div
                        className="loyalty-bar-fill"
                        style={{ width: `${Math.min(100, (userProfile.points / 1000) * 100)}%` }}
                      />
                    </div>
                    <small className="meter-caption">150 more points to reach Gold Member status</small>
                  </div>
                </div>

                <div className="lh-wallet-card">
                  <span className="wallet-badge">STORE WALLET BALANCE</span>
                  <strong>{formatPrice(userProfile.walletBalance)}</strong>
                  <p>Available to apply automatically at checkout.</p>
                </div>
              </div>

              <div className="rewards-redemption-section">
                <h4>Available Discount Vouchers</h4>
                <div className="vouchers-grid">
                  <div className="voucher-card">
                    <span className="v-pts">300 Points</span>
                    <h5>Rs. 500 Discount Voucher</h5>
                    <p>Valid on all ready-to-wear and unstitched suits.</p>
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      onClick={() => onRedeemVoucher(300, 500, 'REWARD500')}
                    >
                      Redeem Voucher →
                    </button>
                  </div>

                  <div className="voucher-card featured-voucher">
                    <span className="v-pts">500 Points</span>
                    <h5>Rs. 1,000 Discount Voucher</h5>
                    <p>Valid on all festive suits, lawn, and abayas.</p>
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      onClick={() => onRedeemVoucher(500, 1000, 'REWARD1000')}
                    >
                      Redeem Voucher →
                    </button>
                  </div>

                  <div className="voucher-card">
                    <span className="v-pts">800 Points</span>
                    <h5>Rs. 2,000 Discount Voucher</h5>
                    <p>Applicable to all online and custom orders.</p>
                    <button
                      type="button"
                      className="btn-primary-luxury sm"
                      onClick={() => onRedeemVoucher(800, 2000, 'REWARD2000')}
                    >
                      Redeem Voucher →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SIZE & MEASUREMENTS */}
          {activeTab === 'sizing' && (
            <div className="suite-sizing-view">
              <div className="sizing-intro">
                <h4>My Body Measurements</h4>
                <p>
                  Save your exact measurements once so our tailors can stitch your suits to your exact fit.
                </p>
              </div>

              <form className="sizing-profile-form" onSubmit={handleSizingSave}>
                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Bust (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.bust}
                      onChange={(e) => setEditSizing({ ...editSizing, bust: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Waist (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.waist}
                      onChange={(e) => setEditSizing({ ...editSizing, waist: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Hip (Inches) *</label>
                    <input
                      type="text"
                      required
                      value={editSizing.hip}
                      onChange={(e) => setEditSizing({ ...editSizing, hip: e.target.value })}
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
                    />
                  </div>
                  <div className="form-field">
                    <label>Preferred Kurta Length (Inches)</label>
                    <input
                      type="text"
                      value={editSizing.kurtaLength}
                      onChange={(e) => setEditSizing({ ...editSizing, kurtaLength: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Sleeve Length (Inches)</label>
                    <input
                      type="text"
                      value={editSizing.sleeveLength}
                      onChange={(e) => setEditSizing({ ...editSizing, sleeveLength: e.target.value })}
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

                <button type="submit" className="btn-primary-luxury sm">
                  Save Measurements ✓
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="suite-settings-view">
              <form className="settings-profile-form" onSubmit={handleProfileSave}>
                <h4>Client Contact Details</h4>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      value={editProfile.email}
                      onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={editProfile.phone}
                      onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Primary City</label>
                    <select
                      value={editProfile.city}
                      onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                      className="luxury-select"
                    >
                      <option>Islamabad</option>
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Rawalpindi</option>
                      <option>Faisalabad</option>
                      <option>Multan</option>
                      <option>Peshawar</option>
                      <option>Quetta</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>

                <div className="settings-actions-row">
                  <button type="submit" className="btn-primary-luxury sm">
                    Save Changes ✓
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ================= SUB-MODALS ================= */}

        {/* 1. TRACKING DETAILS MODAL */}
        {trackingOrder && (
          <div className="sub-modal-backdrop" onClick={() => setTrackingOrder(null)}>
            <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="smd-header">
                <div>
                  <span className="drawer-eyebrow">Trax Courier Logistics</span>
                  <h3>Live Tracking: Order #{trackingOrder.id}</h3>
                  <small>Airway Bill Code: {trackingOrder.trackingCode || 'TRX-849102-LHR'}</small>
                </div>
                <button type="button" onClick={() => setTrackingOrder(null)} className="modal-close-icon">✕</button>
              </div>

              <div className="tracking-timeline-box">
                <div className="tracking-checkpoint done">
                  <span className="tcp-dot">✓</span>
                  <div>
                    <strong>Order Confirmed & Payment Verified</strong>
                    <p>Placed on {trackingOrder.date} · Lahore Studio</p>
                  </div>
                </div>
                <div className="tracking-checkpoint done">
                  <span className="tcp-dot">✓</span>
                  <div>
                    <strong>Quality Inspection & Steam Pressed</strong>
                    <p>Lahore Studio · Inspected & Packed</p>
                  </div>
                </div>
                <div className={`tracking-checkpoint ${['Dispatched', 'Delivered'].includes(trackingOrder.status) ? 'done' : 'current'}`}>
                  <span className="tcp-dot">{['Dispatched', 'Delivered'].includes(trackingOrder.status) ? '✓' : '●'}</span>
                  <div>
                    <strong>Handed to Trax Courier Hub (Lahore)</strong>
                    <p>En route to destination city hub ({trackingOrder.customer.city})</p>
                  </div>
                </div>
                <div className={`tracking-checkpoint ${trackingOrder.status === 'Delivered' ? 'done' : 'pending'}`}>
                  <span className="tcp-dot">{trackingOrder.status === 'Delivered' ? '✓' : '○'}</span>
                  <div>
                    <strong>Out for Doorstep Delivery</strong>
                    <p>Estimated by: {trackingOrder.estimatedDelivery || 'In 2-3 Days'}</p>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-primary-luxury full-width" onClick={() => setTrackingOrder(null)}>
                Close Tracking
              </button>
            </div>
          </div>
        )}

        {/* 2. INVOICE MODAL */}
        {invoiceOrder && (
          <div className="sub-modal-backdrop" onClick={() => setInvoiceOrder(null)}>
            <div className="sub-modal-dialog invoice-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="smd-header">
                <div>
                  <span className="drawer-eyebrow">Official Tax Invoice</span>
                  <h3>Jiya Collections</h3>
                  <small>NTN: 8491028-4 · Gulberg III, Lahore</small>
                </div>
                <button type="button" onClick={() => setInvoiceOrder(null)} className="modal-close-icon">✕</button>
              </div>

              <div className="invoice-printable-content">
                <div className="invoice-meta-grid">
                  <div>
                    <span>Invoice Ref:</span>
                    <strong>#{invoiceOrder.id}</strong>
                  </div>
                  <div>
                    <span>Invoice Date:</span>
                    <strong>{invoiceOrder.date}</strong>
                  </div>
                  <div>
                    <span>Billed To:</span>
                    <strong>{invoiceOrder.customer.name}</strong>
                    <small>{invoiceOrder.customer.address}, {invoiceOrder.customer.city}</small>
                  </div>
                  <div>
                    <span>Payment Mode:</span>
                    <strong>{invoiceOrder.customer.paymentMethod}</strong>
                    {invoiceOrder.customer.transactionId && (
                      <small style={{ display: 'block', color: 'var(--terracotta)', fontFamily: 'var(--font-mono)' }}>
                        TID: {invoiceOrder.customer.transactionId}
                      </small>
                    )}
                  </div>
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Ensemble</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceOrder.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.product.name} ({it.product.color})</td>
                        <td>{it.size}</td>
                        <td>{it.quantity}</td>
                        <td>{formatPrice(it.unitPrice || it.product.price)}</td>
                        <td>{formatPrice((it.unitPrice || it.product.price) * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-totals-box">
                  <div><span>Subtotal:</span> <strong>{formatPrice(invoiceOrder.subtotal)}</strong></div>
                  {invoiceOrder.discount > 0 && (
                    <div className="discount-green"><span>Discount Applied:</span> <span>− {formatPrice(invoiceOrder.discount)}</span></div>
                  )}
                  <div><span>Courier Shipping:</span> <span>{invoiceOrder.shipping === 0 ? 'FREE' : formatPrice(invoiceOrder.shipping)}</span></div>
                  <div className="inv-grand"><span>Total Paid:</span> <strong>{formatPrice(invoiceOrder.total)}</strong></div>
                </div>
              </div>

              <div className="invoice-dialog-footer">
                <button
                  type="button"
                  className="btn-primary-luxury sm"
                  onClick={() => {
                    window.print?.()
                  }}
                >
                  Print Invoice 🖨
                </button>
                <button type="button" className="btn-outline-luxury sm" onClick={() => setInvoiceOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. EXCHANGE / RETURN MODAL */}
        {exchangeOrder && (
          <div className="sub-modal-backdrop" onClick={() => setExchangeOrder(null)}>
            <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="smd-header">
                <div>
                  <span className="drawer-eyebrow">3-Day Hassle-Free Exchange</span>
                  <h3>Request Exchange / Return</h3>
                  <small>Order #{exchangeOrder.id}</small>
                </div>
                <button type="button" onClick={() => setExchangeOrder(null)} className="modal-close-icon">✕</button>
              </div>

              <form onSubmit={handleExchangeSubmit} className="exchange-form-body">
                <div className="form-field">
                  <label>Select Reason for Exchange *</label>
                  <select
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value)}
                    className="luxury-select"
                  >
                    <option>Size too large (Need smaller size)</option>
                    <option>Size too small (Need larger size)</option>
                    <option>Kurta length adjustment required</option>
                    <option>Sleeve fitting adjustment</option>
                    <option>Prefer alternative color or design</option>
                    <option>Exchange for Store Wallet Balance</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Specific Instructions or Replacement Item</label>
                  <textarea
                    rows={3}
                    value={exchangeNotes}
                    onChange={(e) => setExchangeNotes(e.target.value)}
                    placeholder="Tell us what size or replacement item you would like..."
                  />
                </div>

                <div className="exchange-pickup-note">
                  <p>
                    📦 Trax Courier will pick up the parcel from{' '}
                    <strong>{exchangeOrder.customer.address}, {exchangeOrder.customer.city}</strong> within 48
                    hours. Please keep original fabric tags intact.
                  </p>
                </div>

                <button type="submit" className="btn-primary-luxury full-width">
                  Confirm Doorstep Exchange Request ✓
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. ADD NEW ADDRESS MODAL */}
        {showAddAddressModal && (
          <div className="sub-modal-backdrop" onClick={() => setShowAddAddressModal(false)}>
            <div className="sub-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="smd-header">
                <div>
                  <span className="drawer-eyebrow">Address Book</span>
                  <h3>Add Delivery Address</h3>
                </div>
                <button type="button" onClick={() => setShowAddAddressModal(false)} className="modal-close-icon">✕</button>
              </div>

              <form onSubmit={handleAddressSubmit} className="exchange-form-body">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Label / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Home, Office, Mom's House"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 301 8472910"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>City *</label>
                    <select
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="luxury-select"
                    >
                      <option>Islamabad</option>
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Rawalpindi</option>
                      <option>Faisalabad</option>
                      <option>Multan</option>
                      <option>Peshawar</option>
                      <option>Quetta</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Set as Primary Address?</label>
                    <input
                      type="checkbox"
                      checked={newAddr.isDefault}
                      onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                      className="luxury-checkbox"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Full Street Address, House/Apt, Sector/Area *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary-luxury full-width">
                  Save Delivery Address ✓
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
