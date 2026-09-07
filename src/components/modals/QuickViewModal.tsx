import { useState } from 'react'
import type { Product, SizeOption } from '../../types'
import { sizeSurcharges, calculateSizePrice } from '../../data/initialData'

interface QuickViewModalProps {
  product: Product
  isSaved: boolean
  onClose: () => void
  onAddToCart: (product: Product, size: SizeOption, quantity: number, unitPrice: number) => void
  onToggleWishlist: (id: number) => void
  onOpenSizeGuide: () => void
  formatPrice: (pkr: number) => string
}

export function QuickViewModal({
  product,
  isSaved,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onOpenSizeGuide,
  formatPrice,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M')
  const [selectedQty, setSelectedQty] = useState(1)

  const currentUnitPrice = calculateSizePrice(product.price, selectedSize)
  const currentTotalPrice = currentUnitPrice * selectedQty
  const currentSurcharge = sizeSurcharges[selectedSize]

  const sizeList: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom']

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-quickview-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          className="quickview-close-btn"
          onClick={onClose}
          aria-label="Close product view"
        >
          ✕
        </button>

        <div className="quickview-image-wrap">
          <img src={product.image} alt={product.name} />
          {product.tag && <span className="qv-tag">{product.tag}</span>}
        </div>

        <div className="quickview-details">
          <div className="qv-category-row">
            <span className="qv-category">{product.category}</span>
            <span className="qv-gender-badge">{product.gender}</span>
            <span className={`qv-stitch-badge ${product.stitchType === 'Stitched' ? 'stitched' : 'unstitched'}`}>
              {product.stitchType}
            </span>
            {product.pieces && <span className="qv-pieces-badge">{product.pieces}</span>}
          </div>
          <h2 className="qv-title">{product.name}</h2>

          <div className="qv-price-row">
            {product.oldPrice && <del>{formatPrice(calculateSizePrice(product.oldPrice, selectedSize))}</del>}
            <strong className="dynamic-size-price">{formatPrice(currentUnitPrice)}</strong>
            {currentSurcharge.surcharge > 0 && (
              <span className="size-rate-pill">{currentSurcharge.label}</span>
            )}
            <span className="qv-rating">
              ★ {product.rating} ({product.reviewsCount} reviews)
            </span>
          </div>

          <p className="qv-description">{product.description}</p>

          <div className="qv-spec-tags">
            <span><strong>Edition:</strong> {product.stitchType} {product.pieces ? `· ${product.pieces}` : ''}</span>
            <span><strong>Gender:</strong> {product.gender}</span>
            <span><strong>Fabric:</strong> {product.fabric}</span>
            <span><strong>Color:</strong> {product.color}</span>
            <span><strong>Studio Stock:</strong> {product.stock} pieces ready in Lahore</span>
          </div>

          {/* Size Selector with Rates */}
          <div className="qv-size-section">
            <div className="qv-size-header">
              <span className="size-title-label">
                {product.stitchType === 'Unstitched'
                  ? `Fabric Box / Tailoring Option: `
                  : `Select Size & Tailoring Tier: `}
                <strong>{selectedSize} ({formatPrice(currentUnitPrice)})</strong>
              </span>
              <button className="qv-size-guide-link" onClick={onOpenSizeGuide}>
                Size Guide ↗
              </button>
            </div>
            <div className="qv-size-buttons">
              {sizeList.map((size) => {
                const info = sizeSurcharges[size]
                let label = info.surcharge === 0 ? 'Base' : `+${formatPrice(info.surcharge)}`
                if (product.stitchType === 'Unstitched' && info.surcharge === 0) {
                  label = 'Fabric Box'
                } else if (product.stitchType === 'Unstitched' && size === 'Custom') {
                  label = '+Tailoring'
                }
                return (
                  <button
                    key={size}
                    type="button"
                    className={`qv-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <span className="sz-name">{size}</span>
                    <span className="sz-rate">{label}</span>
                  </button>
                )
              })}
            </div>
            <p className="size-tier-hint">
              {product.stitchType === 'Unstitched'
                ? '* Standard tiers (XS–M) provide the luxury unstitched fabric box with all embroidered borders/patches. L, XL, or Custom include expert master-darzi custom tailoring to your measurements.'
                : '* Ready-to-wear sizes L & XL include extra fabric yardage and customized ease. Custom includes bespoke pattern drafting to your body measurements.'}
            </p>
          </div>

          {/* Quantity Selector & Add Button */}
          <div className="qv-action-row">
            <div className="qv-qty-stepper">
              <button
                type="button"
                onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{selectedQty}</span>
              <button
                type="button"
                onClick={() => setSelectedQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-primary-luxury qv-add-btn"
              onClick={() => {
                onAddToCart(product, selectedSize, selectedQty, currentUnitPrice)
                onClose()
              }}
            >
              Add to Cart · {formatPrice(currentTotalPrice)}
            </button>

            <button
              type="button"
              className={`qv-wish-btn ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Toggle wishlist"
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>

          <div className="qv-perks">
            <span>🚚 Free Pakistan delivery on orders over Rs. 8,000</span>
            <span>↺ 3-day doorstep exchange guarantee</span>
            <span>✨ Generational Lahore artisan hand-finishing</span>
          </div>
        </div>
      </div>
    </div>
  )
}
