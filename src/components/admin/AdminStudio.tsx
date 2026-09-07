import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Product, Order, PromoCode } from '../../types'

interface AdminStudioProps {
  onClose: () => void
  brandName: string
  onUpdateBrandName: (name: string) => void
  announcementText: string
  onUpdateAnnouncementText: (text: string) => void
  products: Product[]
  onAddProduct: (prod: Omit<Product, 'id'>) => void
  onUpdateProduct: (id: number, field: 'name' | 'price' | 'stock', val: string) => void
  onDeleteProduct: (id: number) => void
  orders: Order[]
  onUpdateOrderStatus: (id: string, status: Order['status']) => void
  promoList: PromoCode[]
  onAddPromo: (code: string, discount: number) => void
  onTogglePromo: (code: string) => void
  formatPrice: (pkr: number) => string
  showToast: (msg: string, type?: 'success' | 'info') => void
  onLogout: () => void
}

type AdminTab = 'overview' | 'products' | 'orders' | 'discounts' | 'shipping' | 'settings'

export function AdminStudio({
  onClose,
  onLogout,
  brandName,
  onUpdateBrandName,
  announcementText,
  onUpdateAnnouncementText,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  promoList,
  onAddPromo,
  onTogglePromo,
  formatPrice,
  showToast,
}: AdminStudioProps) {
  const [adminTab, setAdminTab] = useState<AdminTab>('overview')

  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Women Stitched' as Product['category'],
    gender: 'Women' as Product['gender'],
    stitchType: 'Stitched' as Product['stitchType'],
    pieces: '3-Piece (Kurta, Shalwar, Dupatta)',
    price: 6500,
    fabric: '',
    color: '',
    stock: 10,
    image: '/products/women_lawn_suit.jpg',
    tag: 'Cultural Edition',
  })

  const [newPromoCode, setNewPromoCode] = useState('')
  const [newPromoPercent, setNewPromoPercent] = useState('15')

  const [cityRates, setCityRates] = useState({
    Lahore: '200',
    Karachi: '250',
    Islamabad: '200',
    Peshawar: '280',
    Quetta: '320',
    Other: '300',
  })

  const handleAddProductSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newProd.name || !newProd.fabric) {
      showToast('Please provide a product title and fabric composition', 'info')
      return
    }
    onAddProduct({
      name: newProd.name,
      category: newProd.category,
      gender: newProd.gender,
      stitchType: newProd.stitchType,
      pieces: newProd.pieces,
      price: Number(newProd.price) || 5000,
      color: newProd.color || 'Custom Ivory',
      fabric: newProd.fabric,
      stock: Number(newProd.stock) || 1,
      image: newProd.image,
      tag: newProd.tag,
      rating: 5.0,
      reviewsCount: 1,
      description: 'Artisanal Pakistani ensemble tailored with care in our Lahore atelier.',
    })
    setNewProd({
      name: '',
      category: 'Women Stitched',
      gender: 'Women',
      stitchType: 'Stitched',
      pieces: '3-Piece (Kurta, Shalwar, Dupatta)',
      price: 6500,
      fabric: '',
      color: '',
      stock: 10,
      image: '/products/women_lawn_suit.jpg',
      tag: 'Cultural Edition',
    })
  }

  const handleAddPromoSubmit = (e: FormEvent) => {
    e.preventDefault()
    const code = newPromoCode.trim().toUpperCase()
    if (!code) return
    onAddPromo(code, parseInt(newPromoPercent, 10) || 10)
    setNewPromoCode('')
  }

  return (
    <div className="admin-studio-fullscreen" role="dialog" aria-label="Admin Operations Suite">
      <aside className="admin-studio-sidebar">
        <div className="admin-studio-brand">
          <strong>{brandName}</strong>
          <span className="admin-badge-pill">OPERATIONS STUDIO</span>
        </div>

        <nav className="admin-nav-tabs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products & Stock' },
            { id: 'orders', label: 'Orders & Dispatch' },
            { id: 'discounts', label: 'Promo Codes' },
            { id: 'shipping', label: 'City Shipping' },
            { id: 'settings', label: 'Storefront Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab-btn ${adminTab === tab.id ? 'active' : ''}`}
              onClick={() => setAdminTab(tab.id as AdminTab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={onLogout}>
            🔒 Staff Sign Out
          </button>
          <button className="admin-exit-btn" onClick={onClose}>
            ← Return to Store
          </button>
        </div>
      </aside>

      <main className="admin-studio-content">
        <div className="admin-content-topbar">
          <div>
            <span className="drawer-eyebrow">Atelier Control Centre</span>
            <h2>{adminTab.toUpperCase()}</h2>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-logout-top-btn" onClick={onLogout} title="Sign out as Admin">
              🔒 Sign Out
            </button>
            <button className="admin-close-x" onClick={onClose} aria-label="Exit admin">
              ✕ Return to Store
            </button>
          </div>
        </div>

        {/* TAB: Overview */}
        {adminTab === 'overview' && (
          <div className="admin-overview-grid">
            <div className="kpi-card">
              <span className="kpi-label">Today's Revenue</span>
              <strong className="kpi-value">{formatPrice(184500)}</strong>
              <span className="kpi-delta">+24% vs last week</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Active Orders</span>
              <strong className="kpi-value">{orders.length + 12}</strong>
              <span className="kpi-delta">4 dispatched today</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Live Inventory</span>
              <strong className="kpi-value">
                {products.reduce((acc, p) => acc + p.stock, 0)} Units
              </strong>
              <span className="kpi-delta">Across {products.length} designs</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Bespoke Queue</span>
              <strong className="kpi-value">5 Requests</strong>
              <span className="kpi-delta">2 awaiting client reply</span>
            </div>

            <div className="admin-full-card">
              <div className="card-top-row">
                <h3>Recent Customer Orders Feed</h3>
                <button
                  className="btn-outline-luxury sm"
                  onClick={() => setAdminTab('orders')}
                >
                  View All Orders →
                </button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>#{o.id}</strong></td>
                      <td>{o.customer.name}</td>
                      <td>{o.customer.city}</td>
                      <td>{o.items.length} items</td>
                      <td>{formatPrice(o.total)}</td>
                      <td>
                        <span className={`status-tag ${o.status.toLowerCase().replace(' ', '-')}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Products */}
        {adminTab === 'products' && (
          <div className="admin-products-view">
            <div className="admin-add-product-card">
              <h3>Add New Piece to Catalog</h3>
              <form className="admin-add-form" onSubmit={handleAddProductSubmit}>
                <div className="form-grid-3">
                  <input
                    type="text"
                    required
                    placeholder="Product Name (e.g. Noor Lawn Shalwar Kameez)"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  />
                  <select
                    value={newProd.category}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="luxury-select"
                  >
                    <option value="Women Stitched">Women Stitched</option>
                    <option value="Women Unstitched">Women Unstitched</option>
                    <option value="Men Stitched">Men Stitched</option>
                    <option value="Men Unstitched">Men Unstitched</option>
                    <option value="Festive Couture">Festive Couture</option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Price (PKR)"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                  />
                </div>
                <div className="form-grid-3">
                  <select
                    value={newProd.gender}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        gender: e.target.value as Product['gender'],
                      })
                    }
                    className="luxury-select"
                  >
                    <option value="Women">Women's Collection</option>
                    <option value="Men">Men's Collection</option>
                    <option value="Unisex">Unisex Couture</option>
                  </select>
                  <select
                    value={newProd.stitchType}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        stitchType: e.target.value as Product['stitchType'],
                      })
                    }
                    className="luxury-select"
                  >
                    <option value="Stitched">Stitched (Ready-to-Wear)</option>
                    <option value="Unstitched">Unstitched (Fabric Box)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Pieces (e.g. 3-Piece, 4.5m Box)"
                    value={newProd.pieces}
                    onChange={(e) => setNewProd({ ...newProd, pieces: e.target.value })}
                  />
                </div>
                <div className="form-grid-3">
                  <input
                    type="text"
                    required
                    placeholder="Fabric (e.g. Chinese Boski, Egyptian Latha, Lawn)"
                    value={newProd.fabric}
                    onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Color (e.g. Royal White, Charcoal)"
                    value={newProd.color}
                    onChange={(e) => setNewProd({ ...newProd, color: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Initial Stock (e.g. 10)"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                  />
                </div>
                <button type="submit" className="btn-primary-luxury sm">
                  + Add Product to Live Storefront
                </button>
              </form>
            </div>

            <div className="admin-products-table-card">
              <h3>Live Catalog Items ({products.length}) — Direct Inline Edit</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category & Type</th>
                    <th>Price (PKR)</th>
                    <th>Stock Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-prod-cell">
                          <img src={p.image} alt={p.name} />
                          <div>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => onUpdateProduct(p.id, 'name', e.target.value)}
                            />
                            <small className="admin-prod-sub">{p.fabric} · {p.color}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{p.category}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginTop: '2px' }}>
                            {p.gender} · {p.stitchType} {p.pieces ? `(${p.pieces})` : ''}
                          </div>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="table-num-input"
                          value={p.price}
                          onChange={(e) => onUpdateProduct(p.id, 'price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="table-num-input"
                          value={p.stock}
                          onChange={(e) => onUpdateProduct(p.id, 'stock', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => onDeleteProduct(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Orders */}
        {adminTab === 'orders' && (
          <div className="admin-orders-management">
            <h3>Order Dispatch & Status Pipeline</h3>
            <div className="orders-pipeline-list">
              {orders.map((o) => (
                <div key={o.id} className="pipeline-card">
                  <div className="pipeline-header">
                    <div>
                      <strong>Order #{o.id}</strong>
                      <span>Placed: {o.date} by {o.customer.name} ({o.customer.phone})</span>
                      <small>{o.customer.address}, {o.customer.city}</small>
                    </div>
                    <div className="pipeline-actions">
                      <label>Update Status:</label>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(o.id, e.target.value as Order['status'])
                        }
                        className="luxury-select"
                      >
                        <option>Confirmed</option>
                        <option>In Atelier</option>
                        <option>Dispatched</option>
                        <option>Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="pipeline-items">
                    {o.items.map((it, idx) => (
                      <span key={idx}>
                        {it.quantity}× {it.product.name} ({it.size}) · {formatPrice(it.product.price)}
                      </span>
                    ))}
                  </div>
                  <div className="pipeline-footer">
                    <span>Payment: {o.customer.paymentMethod}</span>
                    <strong>Total: {formatPrice(o.total)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Discounts */}
        {adminTab === 'discounts' && (
          <div className="admin-discounts-view">
            <div className="discount-create-card">
              <h3>Create Promotional Coupon</h3>
              <form className="discount-form-inline" onSubmit={handleAddPromoSubmit}>
                <input
                  type="text"
                  required
                  placeholder="Coupon Code (e.g. FLASH25)"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                />
                <input
                  type="number"
                  required
                  placeholder="Discount % (e.g. 25)"
                  value={newPromoPercent}
                  onChange={(e) => setNewPromoPercent(e.target.value)}
                />
                <button type="submit" className="btn-primary-luxury sm">
                  + Create Active Coupon
                </button>
              </form>
            </div>

            <div className="promos-table-card">
              <h3>Active Storefront Discount Codes</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount Value</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {promoList.map((promo) => (
                    <tr key={promo.code}>
                      <td><strong>{promo.code}</strong></td>
                      <td>{promo.discount}% Off</td>
                      <td>
                        <span className={`status-tag ${promo.active ? 'confirmed' : 'delivered'}`}>
                          {promo.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-outline-luxury sm"
                          onClick={() => onTogglePromo(promo.code)}
                        >
                          {promo.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Shipping */}
        {adminTab === 'shipping' && (
          <div className="admin-shipping-view">
            <h3>City-Specific Courier Rates (PKR)</h3>
            <div className="shipping-rates-form">
              {Object.entries(cityRates).map(([city, rate]) => (
                <div key={city} className="rate-field">
                  <label>{city} Delivery Fee</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) =>
                      setCityRates({ ...cityRates, [city]: e.target.value })
                    }
                  />
                </div>
              ))}
              <button
                className="btn-primary-luxury sm"
                onClick={() => showToast('City shipping rates saved successfully!', 'success')}
              >
                Save Shipping Rates ✓
              </button>
            </div>
          </div>
        )}

        {/* TAB: Settings */}
        {adminTab === 'settings' && (
          <div className="admin-settings-view">
            <h3>Storefront Branding & Announcement</h3>
            <div className="settings-fields-card">
              <div className="form-field">
                <label>Store Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => onUpdateBrandName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="form-field">
                <label>Top Announcement Bar Ticker</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => onUpdateAnnouncementText(e.target.value)}
                />
              </div>
              <button
                className="btn-primary-luxury sm"
                onClick={() => showToast('Store settings updated across website!', 'success')}
              >
                Save & Apply Changes to Live Storefront ✓
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
