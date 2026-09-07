import { useMemo, useState } from 'react'
import './App.css'

// Types
import type {
  Product,
  CartItem,
  Order,
  Address,
  BespokeRequest,
  Currency,
  Toast,
  ModalType,
  PromoCode,
  UserProfile,
  SizingProfile,
  SizeOption,
} from './types'

// Initial Data
import {
  currencyRates,
  initialProducts,
  categories,
  heroSlides,
  initialOrders,
  initialBespokeRequests,
  initialAddresses,
  initialUserProfile,
  initialSizingProfile,
  initialPromoList,
  calculateSizePrice,
} from './data/initialData'

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { ToastContainer } from './components/common/ToastContainer'

// Storefront Components
import { HeroSection } from './components/storefront/HeroSection'
import { BrandPillars } from './components/storefront/BrandPillars'
import { ProductGrid } from './components/storefront/ProductGrid'
import { BespokeBanner } from './components/storefront/BespokeBanner'
import { Testimonials } from './components/storefront/Testimonials'

// Perfected Customer Portal & Dashboard
import { CustomerDashboard } from './components/customer/CustomerDashboard'

// Drawers & Modals
import { CartDrawer } from './components/modals/CartDrawer'
import { WishlistDrawer } from './components/modals/WishlistDrawer'
import { FilterDrawer } from './components/modals/FilterDrawer'
import { QuickViewModal } from './components/modals/QuickViewModal'
import { CheckoutModal } from './components/modals/CheckoutModal'
import { BespokeModal } from './components/modals/BespokeModal'
import { SizeGuideModal } from './components/modals/SizeGuideModal'
import { PolicyModal } from './components/modals/PolicyModal'
import { ContactModal } from './components/modals/ContactModal'

// AI & Admin
import { StylistAssistant } from './components/ai/StylistAssistant'
import { AdminStudio } from './components/admin/AdminStudio'
import { AdminLoginModal } from './components/admin/AdminLoginModal'

let nextToastCounter = 1
let nextProductCounter = 200
let nextAddressCounter = 300

export default function App() {
  // Store Branding & Currency
  const [brandName, setBrandName] = useState('JIYA COLLECTIONS')
  const [announcementText, setAnnouncementText] = useState(
    'Complimentary delivery on all orders over Rs. 8,000 · Code EID2026 for 15% off'
  )
  const [currency, setCurrency] = useState<Currency>('PKR')

  // Catalog & Filter State
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [activeCategory, setActiveCategory] = useState('All pieces')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Recommended')
  const [priceMax, setPriceMax] = useState<number>(20000)
  const [inStockOnly, setInStockOnly] = useState(false)

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([
    { product: initialProducts[0], quantity: 1, size: 'M', unitPrice: initialProducts[0].price },
  ])
  const [wishlist, setWishlist] = useState<number[]>([3])
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>({
    code: 'EID2026',
    percent: 15,
  })

  // Customer Portal State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile)
  const [sizingProfile, setSizingProfile] = useState<SizingProfile>(initialSizingProfile)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [bespokeRequests, setBespokeRequests] = useState<BespokeRequest[]>(initialBespokeRequests)

  // Modals & Assistant State
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [promoList, setPromoList] = useState<PromoCode[]>(initialPromoList)

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = ++nextToastCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }

  // Price Conversion Formatter
  const formatPrice = (pkrAmount: number) => {
    const info = currencyRates[currency]
    const converted = pkrAmount * info.rate
    const formatted = Math.round(converted).toLocaleString()
    return info.prefix ? `${info.symbol}${formatted}` : `${formatted} ${info.symbol}`
  }

  // Filter & Search Logic
  const visibleProducts = useMemo(() => {
    return products
      .filter((p) => {
        const catMatch = activeCategory === 'All pieces' || p.category === activeCategory
        const q = search.toLowerCase().trim()
        const searchMatch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        const priceMatch = p.price <= priceMax
        const stockMatch = !inStockOnly || p.stock > 0
        return catMatch && searchMatch && priceMatch && stockMatch
      })
      .sort((a, b) => {
        if (sort === 'Price low to high') return a.price - b.price
        if (sort === 'Price high to low') return b.price - a.price
        if (sort === 'Newest') return b.id - a.id
        if (sort === 'Rating') return b.rating - a.rating
        return 0
      })
  }, [products, activeCategory, search, priceMax, inStockOnly, sort])

  // Cart Totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (item.unitPrice || item.product.price) * item.quantity,
      0
    )
  }, [cart])

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    return Math.round((cartSubtotal * appliedCoupon.percent) / 100)
  }, [cartSubtotal, appliedCoupon])

  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0
    if (cartSubtotal >= 8000) return 0
    return 250
  }, [cart, cartSubtotal])

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost)
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / 8000) * 100))
  const remainingForFreeShipping = Math.max(0, 8000 - cartSubtotal)

  // Handlers
  const scrollTo = (elementId: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(elementId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const addToCart = (
    product: Product,
    size: SizeOption = 'M',
    quantity: number = 1,
    unitPrice?: number
  ) => {
    const finalPrice = unitPrice ?? calculateSizePrice(product.price, size)
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id && item.size === size)
      if (idx > -1) {
        const updated = [...prev]
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
          unitPrice: finalPrice,
        }
        return updated
      }
      return [...prev, { product, quantity, size, unitPrice: finalPrice }]
    })
    showToast(`Added ${quantity}× ${product.name} (${size}) to your cart!`, 'cart')
  }

  const updateCartQty = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev]
      const newQty = updated[index].quantity + delta
      if (newQty <= 0) {
        showToast(`Removed ${updated[index].product.name} from cart`, 'info')
        return prev.filter((_, i) => i !== index)
      }
      updated[index].quantity = newQty
      return updated
    })
  }

  const removeFromCart = (index: number) => {
    const item = cart[index]
    setCart((prev) => prev.filter((_, i) => i !== index))
    showToast(`Removed ${item.product.name} from cart`, 'info')
  }

  const toggleWishlist = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId))
      showToast(`Removed ${product?.name ?? 'item'} from saved wishlist`, 'info')
    } else {
      setWishlist((prev) => [...prev, productId])
      showToast(`Saved ${product?.name ?? 'item'} to your wishlist!`, 'success')
    }
  }

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    const found = promoList.find((p) => p.code === clean && p.active)
    if (found) {
      setAppliedCoupon({ code: found.code, percent: found.discount })
      showToast(`Coupon "${found.code}" applied! You saved ${found.discount}%`, 'success')
    } else {
      showToast('Invalid or expired coupon code. Try EID2026 or WELCOME10', 'info')
    }
  }

  const handleRedeemVoucher = (pointsCost: number, discountAmountPkr: number, code: string) => {
    if (userProfile.points >= pointsCost) {
      setUserProfile((prev) => ({ ...prev, points: prev.points - pointsCost }))
      setPromoList((prev) => [...prev, { code, discount: 20, active: true }])
      setAppliedCoupon({ code, percent: 20 })
      showToast(
        `Redeemed ${pointsCost} points for ${formatPrice(discountAmountPkr)} voucher code "${code}"!`,
        'success'
      )
    } else {
      showToast(`You need at least ${pointsCost} points to redeem this voucher`, 'info')
    }
  }

  return (
    <div className="storefront-root">
      {/* Universal Floating Toast Alerts */}
      <ToastContainer toasts={toasts} />

      {/* Top Announcement Bar & Currency Selector */}
      <AnnouncementBar
        announcementText={announcementText}
        currentCurrency={currency}
        onCurrencyChange={(c) => {
          setCurrency(c)
          showToast(`Currency switched to ${c}`, 'info')
        }}
        onCopyPromo={(code) => {
          navigator.clipboard?.writeText?.(code)
          handleApplyCoupon(code)
        }}
      />

      {/* Sticky Luxury Header */}
      <Header
        brandName={brandName}
        search={search}
        onSearchChange={(q) => {
          setSearch(q)
          if (q.trim() && activeCategory !== 'All pieces') {
            setActiveCategory('All pieces')
          }
        }}
        onClearSearch={() => setSearch('')}
        products={products}
        onQuickView={(p) => {
          setSelectedProduct(p)
          setActiveModal('product')
        }}
        formatPrice={formatPrice}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
        onScrollTo={scrollTo}
        onOpenModal={(m) => setActiveModal(m)}
        onCategorySelect={(cat) => setActiveCategory(cat)}
      />

      {/* Hero Showcase with Slide Navigation */}
      <HeroSection
        slides={heroSlides}
        onExploreClick={() => scrollTo('shop')}
        onBespokeClick={() => setActiveModal('custom')}
      />

      {/* Haute Couture Brand Pillars */}
      <BrandPillars />

      {/* Main Catalog & Shopping Grid */}
      <ProductGrid
        products={visibleProducts}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenFilterDrawer={() => setActiveModal('filter')}
        search={search}
        onClearSearch={() => setSearch('')}
        priceMax={priceMax}
        onResetPriceMax={() => setPriceMax(20000)}
        inStockOnly={inStockOnly}
        onToggleInStockOnly={() => setInStockOnly((v) => !v)}
        onResetAllFilters={() => {
          setActiveCategory('All pieces')
          setSearch('')
          setPriceMax(20000)
          setInStockOnly(false)
          showToast('All filters cleared', 'info')
        }}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onQuickView={(p) => {
          setSelectedProduct(p)
          setActiveModal('product')
        }}
        onQuickAdd={(p) => addToCart(p, 'M', 1)}
        formatPrice={formatPrice}
      />

      {/* Bespoke Custom Atelier Showcase */}
      <BespokeBanner onStartCustomDesign={() => setActiveModal('custom')} />

      {/* Customer Testimonials & Reviews */}
      <Testimonials />

      {/* Comprehensive Haute Footer */}
      <Footer
        brandName={brandName}
        onCategorySelect={(cat) => setActiveCategory(cat)}
        onOpenModal={(m) => setActiveModal(m)}
        onScrollTo={scrollTo}
        onNewsletterSubscribe={() => showToast('Thank you for subscribing to our Gazette!', 'success')}
      />

      {/* Grounded Jiya AI Stylist Floating Assistant */}
      <StylistAssistant
        products={products}
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen((o) => !o)}
        onAddToCart={(p) => addToCart(p, 'M', 1)}
        onQuickView={(p) => {
          setSelectedProduct(p)
          setActiveModal('product')
        }}
        formatPrice={formatPrice}
      />

      {/* ================= MODALS, DRAWERS & DASHBOARD ================= */}

      {/* 1. SHOPPING CART DRAWER */}
      {activeModal === 'cart' && (
        <CartDrawer
          cart={cart}
          onClose={() => setActiveModal(null)}
          onUpdateQty={updateCartQty}
          onRemoveItem={removeFromCart}
          onClearBag={() => {
            setCart([])
            showToast('Cart cleared', 'info')
          }}
          onProceedToCheckout={() => setActiveModal('checkout')}
          onExploreShop={() => {
            setActiveModal(null)
            scrollTo('shop')
          }}
          cartSubtotal={cartSubtotal}
          discountAmount={discountAmount}
          shippingCost={shippingCost}
          cartTotal={cartTotal}
          freeShippingProgress={freeShippingProgress}
          remainingForFreeShipping={remainingForFreeShipping}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={() => {
            setAppliedCoupon(null)
            showToast('Coupon removed', 'info')
          }}
          promoList={promoList}
          formatPrice={formatPrice}
        />
      )}

      {/* 2. WISHLIST DRAWER */}
      {activeModal === 'wishlist' && (
        <WishlistDrawer
          wishlist={wishlist}
          products={products}
          onClose={() => setActiveModal(null)}
          onToggleWishlist={toggleWishlist}
          onMoveToBag={(p) => {
            addToCart(p, 'M', 1)
            setWishlist((prev) => prev.filter((id) => id !== p.id))
          }}
          onMoveAllToBag={() => {
            const saved = products.filter((p) => wishlist.includes(p.id))
            saved.forEach((p) => addToCart(p, 'M', 1))
            setWishlist([])
            setActiveModal('cart')
          }}
          onExploreShop={() => {
            setActiveModal(null)
            scrollTo('shop')
          }}
          formatPrice={formatPrice}
        />
      )}

      {/* 3. FILTER & SORT DRAWER */}
      {activeModal === 'filter' && (
        <FilterDrawer
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sort={sort}
          onSortChange={setSort}
          priceMax={priceMax}
          onPriceMaxChange={setPriceMax}
          inStockOnly={inStockOnly}
          onToggleInStockOnly={setInStockOnly}
          onReset={() => {
            setActiveCategory('All pieces')
            setSort('Recommended')
            setPriceMax(20000)
            setInStockOnly(false)
            showToast('Filters reset', 'info')
          }}
          onClose={() => setActiveModal(null)}
          visibleCount={visibleProducts.length}
          formatPrice={formatPrice}
        />
      )}

      {/* 4. PRODUCT QUICK VIEW MODAL */}
      {activeModal === 'product' && selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isSaved={wishlist.includes(selectedProduct.id)}
          onClose={() => setActiveModal(null)}
          onAddToCart={(p, size, qty, unitPrice) => addToCart(p, size, qty, unitPrice)}
          onToggleWishlist={toggleWishlist}
          onOpenSizeGuide={() => setActiveModal('size')}
          formatPrice={formatPrice}
        />
      )}

      {/* 5. MULTI-STEP CHECKOUT MODAL */}
      {activeModal === 'checkout' && (
        <CheckoutModal
          cart={cart}
          cartSubtotal={cartSubtotal}
          discountAmount={discountAmount}
          shippingCost={shippingCost}
          cartTotal={cartTotal}
          appliedCoupon={appliedCoupon}
          onClose={() => setActiveModal(null)}
          onCompleteOrder={(newOrder) => {
            setOrders((prev) => [newOrder, ...prev])
            setCart([])
            setUserProfile((prev) => ({
              ...prev,
              points: prev.points + Math.round(newOrder.total / 100),
            }))
            showToast(`Order #${newOrder.id} placed successfully!`, 'success')
          }}
          onOpenAccountPortal={() => setActiveModal('account')}
          formatPrice={formatPrice}
        />
      )}

      {/* 6. BESPOKE CUSTOM TAILORING MODAL */}
      {activeModal === 'custom' && (
        <BespokeModal
          onClose={() => setActiveModal(null)}
          onSubmitBespoke={(req) => {
            setBespokeRequests((prev) => [req, ...prev])
            showToast(`Custom commission #${req.id} submitted!`, 'success')
          }}
        />
      )}

      {/* 7. PERFECTED CUSTOMER DASHBOARD & ACCOUNT SUITE */}
      {activeModal === 'account' && (
        <CustomerDashboard
          onClose={() => setActiveModal(null)}
          orders={orders}
          wishlist={wishlist}
          products={products}
          addresses={addresses}
          bespokeRequests={bespokeRequests}
          userProfile={userProfile}
          sizingProfile={sizingProfile}
          onUpdateUserProfile={setUserProfile}
          onUpdateSizingProfile={setSizingProfile}
          onAddAddress={(newAddr) => {
            setAddresses((prev) => [...prev, { ...newAddr, id: ++nextAddressCounter }])
          }}
          onSetDefaultAddress={(id) => {
            setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
          }}
          onDeleteAddress={(id) => {
            setAddresses((prev) => prev.filter((a) => a.id !== id))
          }}
          onMoveWishlistToCart={(prod, size, unitPrice) => {
            addToCart(prod, size, 1, unitPrice)
            setWishlist((prev) => prev.filter((id) => id !== prod.id))
          }}
          onToggleWishlist={toggleWishlist}
          onReorder={(order) => {
            order.items.forEach((item) =>
              addToCart(item.product, item.size, item.quantity, item.unitPrice)
            )
            setActiveModal('cart')
          }}
          onRedeemVoucher={handleRedeemVoucher}
          formatPrice={formatPrice}
          showToast={showToast}
        />
      )}

      {/* 8. INTERACTIVE SIZE GUIDE MODAL */}
      {activeModal === 'size' && (
        <SizeGuideModal
          onClose={() => setActiveModal(null)}
          onAskStylist={() => {
            setActiveModal(null)
            setAssistantOpen(true)
          }}
        />
      )}

      {/* 9. POLICIES & DELIVERY ESTIMATOR MODAL */}
      {activeModal === 'policy' && (
        <PolicyModal onClose={() => setActiveModal(null)} />
      )}

      {/* 10. ATELIER CONCIERGE CONTACT MODAL */}
      {activeModal === 'contact' && (
        <ContactModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => showToast('Message sent to our Lahore concierge!', 'success')}
        />
      )}

      {/* 11. OPERATIONS & ADMIN STUDIO (STRICTLY RESTRICTED TO AUTHENTICATED STAFF) */}
      {activeModal === 'admin' && !isAdminAuthenticated && (
        <AdminLoginModal
          onClose={() => setActiveModal(null)}
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true)
          }}
          showToast={showToast}
        />
      )}

      {activeModal === 'admin' && isAdminAuthenticated && (
        <AdminStudio
          onClose={() => setActiveModal(null)}
          onLogout={() => {
            setIsAdminAuthenticated(false)
            setActiveModal(null)
            showToast('Staff logged out successfully', 'info')
          }}
          brandName={brandName}
          onUpdateBrandName={setBrandName}
          announcementText={announcementText}
          onUpdateAnnouncementText={setAnnouncementText}
          products={products}
          onAddProduct={(prod) => {
            const newP: Product = { ...prod, id: ++nextProductCounter }
            setProducts((prev) => [newP, ...prev])
            showToast(`Added "${newP.name}" to live catalog!`, 'success')
          }}
          onUpdateProduct={(id, field, val) => {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === id
                  ? { ...p, [field]: field === 'name' ? val : Math.max(0, Number(val) || 0) }
                  : p
              )
            )
          }}
          onDeleteProduct={(id) => {
            const prod = products.find((p) => p.id === id)
            setProducts((prev) => prev.filter((p) => p.id !== id))
            showToast(`Removed "${prod?.name}" from live catalog`, 'info')
          }}
          orders={orders}
          onUpdateOrderStatus={(id, status) => {
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
            showToast(`Order #${id} status updated to ${status}`, 'success')
          }}
          promoList={promoList}
          onAddPromo={(code, discount) => {
            setPromoList((prev) => [...prev, { code, discount, active: true }])
            showToast(`Coupon "${code}" (${discount}%) activated!`, 'success')
          }}
          onTogglePromo={(code) => {
            setPromoList((prev) =>
              prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
            )
            showToast(`Coupon "${code}" toggled`, 'info')
          }}
          formatPrice={formatPrice}
          showToast={showToast}
        />
      )}
    </div>
  )
}
