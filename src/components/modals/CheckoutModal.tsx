import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CartItem, Order } from '../../types'

interface CheckoutModalProps {
  cart: CartItem[]
  cartSubtotal: number
  discountAmount: number
  shippingCost: number
  cartTotal: number
  appliedCoupon: { code: string; percent: number } | null
  onClose: () => void
  onCompleteOrder: (order: Order) => void
  onOpenAccountPortal: () => void
  formatPrice: (pkr: number) => string
}

let nextCheckoutOrderId = 9200

export function CheckoutModal({
  cart,
  cartSubtotal,
  discountAmount,
  shippingCost,
  cartTotal,
  appliedCoupon,
  onClose,
  onCompleteOrder,
  onOpenAccountPortal,
  formatPrice,
}: CheckoutModalProps) {
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'success'>('details')
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const [form, setForm] = useState({
    name: 'Hira Ahmed',
    email: 'hira.ahmed@example.com',
    phone: '+92 301 8472910',
    city: 'Islamabad',
    address: 'House 18, Street 4, Sector F-7/2',
    notes: 'Please call before delivery',
    paymentMethod: 'Cash on Delivery',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newId = `JC-2026-${++nextCheckoutOrderId}`
    const newOrder: Order = {
      id: newId,
      date: '08 Sep 2026',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      total: cartTotal,
      status: 'Confirmed',
      trackingCode: `TRX-${nextCheckoutOrderId}-ISB`,
      estimatedDelivery: '11 Sep 2026',
      customer: { ...form },
    }
    setPlacedOrder(newOrder)
    onCompleteOrder(newOrder)
    setCheckoutStep('success')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <span className="drawer-eyebrow">Secure Pakistan Checkout</span>
            <h2 className="drawer-title">
              {checkoutStep === 'success' ? 'Order Confirmed!' : 'Complete Your Purchase'}
            </h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close checkout">
            ✕
          </button>
        </div>

        {checkoutStep === 'details' && (
          <form
            className="checkout-form"
            onSubmit={(e) => {
              e.preventDefault()
              setCheckoutStep('payment')
            }}
          >
            <div className="checkout-steps-bar">
              <span className="step-badge active">1. Delivery Address</span>
              <span className="step-badge">2. Payment Method</span>
              <span className="step-badge">3. Confirmation</span>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Delivery City *</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="luxury-select"
                >
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Faisalabad</option>
                  <option>Multan</option>
                  <option>Peshawar</option>
                  <option>Quetta</option>
                  <option>Sialkot</option>
                  <option>Gujranwala</option>
                  <option>Other City</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Complete Street Address, Sector, House / Apartment *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Special Delivery Instructions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Ring bell twice, deliver after 2 PM"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="checkout-dialog-footer">
              <div className="checkout-total-preview">
                <span>Total with Delivery:</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <button type="submit" className="btn-primary-luxury">
                Continue to Payment Method →
              </button>
            </div>
          </form>
        )}

        {checkoutStep === 'payment' && (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-steps-bar">
              <span className="step-badge completed">✓ 1. Address</span>
              <span className="step-badge active">2. Payment Method</span>
              <span className="step-badge">3. Confirmation</span>
            </div>

            <div className="payment-options-list">
              {[
                {
                  id: 'Cash on Delivery',
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay cash to courier when parcel arrives at your doorstep.',
                  icon: '💵',
                },
                {
                  id: 'Direct Bank Transfer',
                  title: 'Direct Bank Transfer (IBFT)',
                  desc: 'Meezan Bank · A/C: 0284010482910 · Jiya Collections Atelier',
                  icon: '🏦',
                },
                {
                  id: 'JazzCash / EasyPaisa',
                  title: 'JazzCash / EasyPaisa Mobile Wallet',
                  desc: 'Instant wallet transfer to 0301-8472910 with receipt upload.',
                  icon: '📱',
                },
                {
                  id: 'Credit / Debit Card',
                  title: 'Visa / Mastercard (SafePay)',
                  desc: 'Encrypted online card processing for domestic & international cards.',
                  icon: '💳',
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`payment-option-card ${form.paymentMethod === option.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={form.paymentMethod === option.id}
                    onChange={() => setForm({ ...form, paymentMethod: option.id })}
                  />
                  <span className="pay-icon">{option.icon}</span>
                  <div className="pay-text">
                    <strong>{option.title}</strong>
                    <p>{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="order-summary-box">
              <h4>Order Summary ({cart.length} unique pieces)</h4>
              <div className="order-summary-items">
                {cart.map((item, i) => (
                  <div key={i} className="os-line">
                    <span>{item.quantity}× {item.product.name} ({item.size})</span>
                    <strong>{formatPrice((item.unitPrice || item.product.price) * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="os-totals">
                <div><span>Subtotal:</span> <span>{formatPrice(cartSubtotal)}</span></div>
                {discountAmount > 0 && (
                  <div className="discount-green">
                    <span>Discount ({appliedCoupon?.code}):</span> <span>− {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div><span>Shipping:</span> <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
                <div className="os-grand"><span>Total Payable:</span> <strong>{formatPrice(cartTotal)}</strong></div>
              </div>
            </div>

            <div className="checkout-dialog-footer">
              <button
                type="button"
                className="btn-outline-luxury"
                onClick={() => setCheckoutStep('details')}
              >
                ← Back to Address
              </button>
              <button type="submit" className="btn-primary-luxury">
                Place Confirmed Order ({formatPrice(cartTotal)}) ✓
              </button>
            </div>
          </form>
        )}

        {checkoutStep === 'success' && placedOrder && (
          <div className="checkout-success-view">
            <span className="success-seal">✓</span>
            <h3>Thank you, {placedOrder.customer.name}!</h3>
            <p className="success-sub">
              Your order has been confirmed and sent to our Lahore tailoring studio.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span>Order Reference:</span>
                <strong>#{placedOrder.id}</strong>
              </div>
              <div className="receipt-row">
                <span>Delivery Address:</span>
                <span>{placedOrder.customer.address}, {placedOrder.customer.city}</span>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <span>{placedOrder.customer.paymentMethod}</span>
              </div>
              <div className="receipt-row">
                <span>Total Amount:</span>
                <strong>{formatPrice(placedOrder.total)}</strong>
              </div>
              <div className="receipt-row">
                <span>Estimated Delivery:</span>
                <span>2–3 Business Days via Trax Logistics</span>
              </div>
            </div>

            <div className="success-actions">
              <button
                className="btn-primary-luxury"
                onClick={() => {
                  onClose()
                  onOpenAccountPortal()
                }}
              >
                Track in Account Dashboard →
              </button>
              <button className="btn-outline-luxury" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
