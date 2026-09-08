import { useState, useEffect } from 'react'
import type { Product, SizeOption } from '../../types'
import { sizeSurcharges, calculateSizePrice } from '../../data/initialData'

interface ProductDetailPageProps {
  product: Product
  products: Product[]
  onBack: () => void
  onSelectProduct: (product: Product) => void
  onAddToCart: (product: Product, size: SizeOption, quantity: number) => void
  onBuyNow: (product: Product, size: SizeOption, quantity: number) => void
  isWishlisted: boolean
  onToggleWishlist: () => void
  onOpenSizeGuide: () => void
  onOpenCart: () => void
  cartCount: number
  wishlistCount: number
  formatPrice: (pkr: number) => string
  showToast: (msg: string, type?: 'success' | 'info' | 'cart') => void
}

const AVAILABLE_SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom']

export function ProductDetailPage({
  product,
  products,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide,
  onOpenCart,
  cartCount,
  wishlistCount,
  formatPrice,
  showToast,
}: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedSize('M')
    setQuantity(1)
    setSelectedImageIndex(0)
  }, [product.id])

  // Unit price with size surcharge
  const unitPrice = calculateSizePrice(product.price, selectedSize)
  const oldUnitPrice = product.oldPrice ? calculateSizePrice(product.oldPrice, selectedSize) : null
  const totalPrice = unitPrice * quantity

  // Simulated multi-angle images (primary image + high-res detail zoom variations)
  const productGallery = [
    product.image,
    product.image,
    product.image,
  ]

  // Related products from same category or gender
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4)

  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      showToast('Product link copied to clipboard!', 'info')
    } else {
      showToast('Link ready to share', 'info')
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Salam, I am interested in ordering "${product.name}" (Size: ${selectedSize}, Price: ${formatPrice(unitPrice)}).\nLink: ${window.location.href}`
    )
    window.open(`https://wa.me/923018472910?text=${text}`, '_blank')
  }

  return (
    <div className="pdp-wrapper">
      {/* 1. TOP APP BAR (Daraz / Shopify style) */}
      <nav className="pdp-top-bar" aria-label="Product navigation">
        <div className="pdp-top-bar-inner">
          <button
            type="button"
            className="pdp-back-btn"
            onClick={onBack}
            aria-label="Back to collection"
          >
            <span className="pdp-back-arrow">←</span>
            <span className="pdp-back-text">Back</span>
          </button>

          <div className="pdp-breadcrumbs">
            <span onClick={onBack} className="pdp-crumb-link">Home</span>
            <span className="pdp-crumb-sep">/</span>
            <span onClick={onBack} className="pdp-crumb-link">{product.category}</span>
            <span className="pdp-crumb-sep">/</span>
            <span className="pdp-crumb-current">{product.name}</span>
          </div>

          <div className="pdp-top-actions">
            <button
              type="button"
              className="pdp-icon-btn"
              onClick={handleShare}
              title="Share Product"
              aria-label="Share product"
            >
              🔗
            </button>
            <button
              type="button"
              className={`pdp-icon-btn ${isWishlisted ? 'active' : ''}`}
              onClick={onToggleWishlist}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-label="Wishlist"
            >
              {isWishlisted ? '❤️' : '🤍'}
              {wishlistCount > 0 && <span className="pdp-cart-badge">{wishlistCount}</span>}
            </button>
            <button
              type="button"
              className="pdp-icon-btn pdp-cart-icon-btn"
              onClick={onOpenCart}
              title="Shopping Cart"
              aria-label="View cart"
            >
              🛒
              {cartCount > 0 && <span className="pdp-cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN PDP CONTAINER */}
      <main className="pdp-main-container">
        <div className="pdp-grid">
          {/* LEFT: MEDIA GALLERY */}
          <section className="pdp-gallery-section" aria-label="Product gallery">
            <div className="pdp-main-image-wrap">
              <img
                src={productGallery[selectedImageIndex]}
                alt={product.name}
                className="pdp-main-image"
              />
              {product.tag && (
                <span className="pdp-tag-pill">{product.tag}</span>
              )}
              {product.oldPrice && (
                <span className="pdp-discount-pill">
                  Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="pdp-thumb-strip">
              {productGallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`pdp-thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img} alt={`View angle ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="pdp-trust-strip">
              <div className="pdp-trust-item">
                <span className="pdp-trust-icon">🚚</span>
                <div>
                  <strong>Trax Express Delivery</strong>
                  <p>2–3 working days nationwide</p>
                </div>
              </div>
              <div className="pdp-trust-item">
                <span className="pdp-trust-icon">🔄</span>
                <div>
                  <strong>3-Day Doorstep Exchange</strong>
                  <p>Hassle-free size exchange</p>
                </div>
              </div>
              <div className="pdp-trust-item">
                <span className="pdp-trust-icon">✂️</span>
                <div>
                  <strong>Master Darzi Stitching</strong>
                  <p>Premium finish & neat hemlines</p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: PRODUCT DETAILS & PURCHASE */}
          <section className="pdp-details-section" aria-label="Product details">
            {/* Category & Rating */}
            <div className="pdp-meta-row">
              <span className="pdp-category-badge">{product.category}</span>
              <span className="pdp-gender-badge">{product.gender}</span>
              {product.pieces && <span className="pdp-pieces-badge">{product.pieces}</span>}
              <div className="pdp-rating-stars">
                <span className="stars-glyph">★ ★ ★ ★ ★</span>
                <span className="rating-val">{product.rating}</span>
                <span className="reviews-cnt">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="pdp-product-title">{product.name}</h1>

            {/* Price Box */}
            <div className="pdp-price-card">
              <div className="pdp-pricing-row">
                <span className="pdp-current-price">{formatPrice(unitPrice)}</span>
                {oldUnitPrice && (
                  <span className="pdp-old-price">{formatPrice(oldUnitPrice)}</span>
                )}
                {product.oldPrice && (
                  <span className="pdp-save-badge">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <p className="pdp-price-note">
                ✓ Inclusive of all taxes · Cash on Delivery & Trax courier shipping available
              </p>
            </div>

            {/* Quick Specs Overview */}
            <div className="pdp-quick-specs">
              <div className="spec-pill">
                <span className="spec-label">Fabric</span>
                <span className="spec-value">{product.fabric}</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.color}</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">Stock</span>
                <span className="spec-value in-stock">
                  {product.stock > 0 ? `✓ ${product.stock} pieces ready` : 'Made to Order'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pdp-description-box">
              <p>
                {product.description ||
                  `Tailored from authentic, premium grade fabric with meticulous attention to detail. Designed for everyday comfort and festive elegance with signature stitching standards.`}
              </p>
            </div>

            {/* SIZE SELECTOR */}
            <div className="pdp-size-section">
              <div className="pdp-size-header">
                <strong>Select Size & Tailoring:</strong>
                <button
                  type="button"
                  className="pdp-size-guide-btn"
                  onClick={onOpenSizeGuide}
                >
                  📏 Size Guide & Fit Calculator
                </button>
              </div>

              <div className="pdp-size-chips-grid">
                {AVAILABLE_SIZES.map((size) => {
                  const surcharge = sizeSurcharges[size]?.surcharge || 0
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`pdp-size-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span className="pdp-size-name">{size}</span>
                      <span className="pdp-size-cost">
                        {surcharge === 0 ? 'Base' : `+Rs. ${surcharge}`}
                      </span>
                    </button>
                  )
                })}
              </div>

              {selectedSize === 'Custom' && (
                <div className="pdp-custom-notice">
                  ✂ <strong>Custom Stitching Selected:</strong> Our master tailor will cut this piece to your exact body measurements saved in your profile or submitted at checkout.
                </div>
              )}
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="pdp-qty-section">
              <strong>Quantity:</strong>
              <div className="pdp-qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="pdp-subtotal-hint">
                Subtotal: <strong>{formatPrice(totalPrice)}</strong>
              </span>
            </div>

            {/* PRIMARY ACTIONS (IN-PAGE FOR DESKTOP & SCROLL VIEW) */}
            <div className="pdp-actions-row">
              <button
                type="button"
                className="pdp-btn pdp-btn-add-cart"
                onClick={() => onAddToCart(product, selectedSize, quantity)}
              >
                🛒 Add to Cart · {formatPrice(totalPrice)}
              </button>

              <button
                type="button"
                className="pdp-btn pdp-btn-buy-now"
                onClick={() => onBuyNow(product, selectedSize, quantity)}
              >
                ⚡ Buy Now (Instant Checkout)
              </button>

              <button
                type="button"
                className="pdp-btn pdp-btn-whatsapp"
                onClick={handleWhatsApp}
              >
                💬 Chat on WhatsApp
              </button>
            </div>

            {/* TABS ACCORDION (DETAILS, FABRIC, SHIPPING, REVIEWS) */}
            <div className="pdp-accordion-tabs">
              <div className="pdp-tab-headers">
                <button
                  type="button"
                  className={`pdp-tab-nav ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  type="button"
                  className={`pdp-tab-nav ${activeTab === 'fabric' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fabric')}
                >
                  Fabric & Care
                </button>
                <button
                  type="button"
                  className={`pdp-tab-nav ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping & Exchange
                </button>
                <button
                  type="button"
                  className={`pdp-tab-nav ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.reviewsCount})
                </button>
              </div>

              <div className="pdp-tab-body">
                {activeTab === 'details' && (
                  <div className="pdp-tab-content">
                    <ul className="pdp-bullet-list">
                      <li><strong>Stitching:</strong> Fully tailored with clean inner overlock and reinforced seams.</li>
                      <li><strong>Silhouette:</strong> Modest, elegant eastern cut suitable for formal and festive occasions.</li>
                      <li><strong>Includes:</strong> {product.pieces || 'Complete ensemble as shown in photograph'}.</li>
                      <li><strong>Finishing:</strong> High quality buttons, piping, and delicate lace details.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'fabric' && (
                  <div className="pdp-tab-content">
                    <ul className="pdp-bullet-list">
                      <li><strong>Material:</strong> {product.fabric}.</li>
                      <li><strong>Weave:</strong> High thread-count, soft touch, lightweight, breathable.</li>
                      <li><strong>Washing:</strong> Dry clean or gentle hand wash in cold water with mild detergent.</li>
                      <li><strong>Ironing:</strong> Medium heat steam press on reverse side of embroidery.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="pdp-tab-content">
                    <ul className="pdp-bullet-list">
                      <li><strong>Courier Partner:</strong> Trax Express Delivery across Pakistan.</li>
                      <li><strong>Dispatch Time:</strong> Ready-to-wear orders ship in 24 hours. Custom sizes take 48–72 hours.</li>
                      <li><strong>Shipping Fee:</strong> Free delivery on all orders over Rs. 6,000 (flat Rs. 250 on smaller orders).</li>
                      <li><strong>Doorstep Exchange:</strong> 3-day doorstep exchange covered with instant rider pickup.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="pdp-tab-content pdp-reviews-content">
                    <div className="pdp-review-card">
                      <div className="prc-header">
                        <strong>Fatima K. — Lahore</strong>
                        <span className="prc-stars">★★★★★</span>
                      </div>
                      <p>“The stitching and fabric quality exceeded my expectations. Fitting was spot on for Medium size.”</p>
                      <span className="prc-date">Verified Buyer · 2 weeks ago</span>
                    </div>

                    <div className="pdp-review-card">
                      <div className="prc-header">
                        <strong>Ayesha M. — Islamabad</strong>
                        <span className="prc-stars">★★★★★</span>
                      </div>
                      <p>“Trax delivery arrived in 2 days. The color and organza dupatta work are beautiful!”</p>
                      <span className="prc-date">Verified Buyer · 1 month ago</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 3. RELATED PRODUCTS SECTION (Shopify / Daraz style) */}
        {relatedProducts.length > 0 && (
          <section className="pdp-related-section" aria-label="Related products">
            <div className="pdp-related-header">
              <h2>You May Also Like</h2>
              <p>Handpicked styles tailored with identical standards</p>
            </div>

            <div className="pdp-related-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="pdp-related-card"
                  onClick={() => onSelectProduct(rel)}
                >
                  <div className="prc-img-wrap">
                    <img src={rel.image} alt={rel.name} />
                    {rel.tag && <span className="prc-tag">{rel.tag}</span>}
                  </div>
                  <div className="prc-details">
                    <span className="prc-cat">{rel.category}</span>
                    <strong className="prc-name">{rel.name}</strong>
                    <div className="prc-price-row">
                      <span className="prc-price">{formatPrice(rel.price)}</span>
                      {rel.oldPrice && <span className="prc-old">{formatPrice(rel.oldPrice)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 4. STICKY BOTTOM ACTION BAR FOR MOBILE (Daraz / Shopify format) */}
      <aside className="pdp-mobile-sticky-bar" aria-label="Mobile quick purchase">
        <div className="pdp-msb-left">
          <button
            type="button"
            className="pdp-msb-icon-btn"
            onClick={handleWhatsApp}
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <span className="pdp-msb-glyph">💬</span>
            <span className="pdp-msb-lbl">Chat</span>
          </button>

          <button
            type="button"
            className={`pdp-msb-icon-btn ${isWishlisted ? 'active' : ''}`}
            onClick={onToggleWishlist}
            title={isWishlisted ? 'Wishlisted' : 'Save'}
            aria-label="Save to Wishlist"
          >
            <span className="pdp-msb-glyph">{isWishlisted ? '❤️' : '🤍'}</span>
            <span className="pdp-msb-lbl">Save</span>
          </button>
        </div>

        <div className="pdp-msb-right">
          <button
            type="button"
            className="pdp-msb-btn pdp-msb-cart"
            onClick={() => onAddToCart(product, selectedSize, quantity)}
          >
            Add to Cart
            <small>{formatPrice(totalPrice)}</small>
          </button>

          <button
            type="button"
            className="pdp-msb-btn pdp-msb-buy"
            onClick={() => onBuyNow(product, selectedSize, quantity)}
          >
            Buy Now
            <small>⚡ Fast Checkout</small>
          </button>
        </div>
      </aside>
    </div>
  )
}
