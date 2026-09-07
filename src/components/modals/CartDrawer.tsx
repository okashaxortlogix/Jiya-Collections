import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CartItem, PromoCode } from '../../types'

interface CartDrawerProps {
  cart: CartItem[]
  onClose: () => void
  onUpdateQty: (index: number, delta: number) => void
  onRemoveItem: (index: number) => void
  onClearBag: () => void
  onProceedToCheckout: () => void
  onExploreShop: () => void
  cartSubtotal: number
  discountAmount: number
  shippingCost: number
  cartTotal: number
  freeShippingProgress: number
  remainingForFreeShipping: number
  appliedCoupon: { code: string; percent: number } | null
  onApplyCoupon: (code: string) => void
  onRemoveCoupon: () => void
  promoList: PromoCode[]
  formatPrice: (pkr: number) => string
}

export function CartDrawer({
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
  onProceedToCheckout,
  onExploreShop,
  cartSubtotal,
  discountAmount,
  shippingCost,
  cartTotal,
  freeShippingProgress,
  remainingForFreeShipping,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  formatPrice,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('')

  const handleCouponSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim())
      setCouponInput('')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="drawer-panel cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Your Selection</span>
            <h2 className="drawer-title">Shopping Cart</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-meter">
          <div className="meter-label">
            {cartSubtotal >= 8000 ? (
              <strong className="shipping-unlocked">🎉 You have unlocked Free Pakistan Delivery!</strong>
            ) : (
              <span>
                Add <strong>{formatPrice(remainingForFreeShipping)}</strong> more for{' '}
                <strong>Free Delivery</strong>
              </span>
            )}
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="drawer-empty-view">
            <span className="empty-cart-glyph">🛒</span>
            <h3>Your shopping cart is empty</h3>
            <p>Pieces you add will be reserved here during your session.</p>
            <button className="btn-primary-luxury" onClick={onExploreShop}>
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="cart-items-scroll">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.size}-${idx}`} className="cart-line-item">
                <img src={item.product.image} alt={item.product.name} className="cart-item-thumb" />
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h4>{item.product.name}</h4>
                    <button
                      className="cart-remove-btn"
                      onClick={() => onRemoveItem(idx)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      ✕
                    </button>
                  </div>
                  <span className="cart-item-meta">
                    <span className={`cart-stitch-tag ${item.product.stitchType.toLowerCase()}`}>
                      {item.product.stitchType}
                    </span>
                    {item.product.pieces && ` · ${item.product.pieces}`} · Size: {item.size} · {item.product.color}
                  </span>
                  <div className="cart-item-pricing-wrap">
                    <strong className="cart-item-price">
                      {formatPrice((item.unitPrice || item.product.price) * item.quantity)}
                    </strong>
                    {item.quantity > 1 && (
                      <span className="cart-unit-rate">
                        ({formatPrice(item.unitPrice || item.product.price)} each)
                      </span>
                    )}
                  </div>

                  <div className="cart-quantity-stepper">
                    <button
                      onClick={() => onUpdateQty(idx, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(idx, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Coupon Input */}
            <form className="coupon-form" onSubmit={handleCouponSubmit}>
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. EID2026)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit">Apply</button>
            </form>

            {appliedCoupon && (
              <div className="applied-coupon-pill">
                <span>
                  Coupon <strong>{appliedCoupon.code}</strong> ({appliedCoupon.percent}% off) applied
                </span>
                <button onClick={onRemoveCoupon} aria-label="Remove coupon">
                  ✕
                </button>
              </div>
            )}

            {/* Subtotal Calculations */}
            <div className="cart-summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(cartSubtotal)}</strong>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Seasonal Promo Discount</span>
                  <span>− {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Courier Delivery (Pakistan)</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-row grand-total-row">
                <span>Estimated Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
            </div>

            <button
              className="btn-checkout-luxury"
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <span>{formatPrice(cartTotal)} →</span>
            </button>

            <button className="clear-bag-btn clear-cart-btn" onClick={onClearBag}>
              Clear Entire Cart
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
