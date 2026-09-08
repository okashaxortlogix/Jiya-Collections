import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CartItem, Order, UserProfile } from '../../types'

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
  customerProfile?: UserProfile | null
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
  customerProfile,
}: CheckoutModalProps) {
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'success'>('details')
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const [form, setForm] = useState({
    name: customerProfile?.name || '',
    email: customerProfile?.email || '',
    phone: customerProfile?.phone || '',
    city: customerProfile?.city || 'Lahore',
    address: '',
    notes: '',
    paymentMethod: 'Cash on Delivery',
  })

  // Manual mobile transfer state
  const [walletType, setWalletType] = useState<'JazzCash' | 'EasyPaisa'>('JazzCash')
  const [manualDetails, setManualDetails] = useState({
    senderPhone: '',
    trxId: '',
    senderBank: 'HBL',
  })
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validate manual transfer requirements if selected
    if (form.paymentMethod === 'JazzCash / EasyPaisa') {
      if (!manualDetails.senderPhone.trim()) {
        alert('Please enter your sender mobile number for payment verification.')
        return
      }
      if (!manualDetails.trxId.trim()) {
        alert('Please enter your Transaction ID (TID) from JazzCash/EasyPaisa SMS.')
        return
      }
    } else if (form.paymentMethod === 'Direct Bank Transfer') {
      if (!manualDetails.trxId.trim()) {
        alert('Please enter your Bank Reference / Transaction ID.')
        return
      }
    }

    let finalPaymentMethod = form.paymentMethod
    if (form.paymentMethod === 'JazzCash / EasyPaisa') {
      finalPaymentMethod = `${walletType} (Manual Transfer)`
    } else if (form.paymentMethod === 'Direct Bank Transfer') {
      finalPaymentMethod = 'Direct Bank Transfer (Meezan IBFT)'
    }

    const newId = `JC-2026-${++nextCheckoutOrderId}`
    const newOrder: Order = {
      id: newId,
      date: '09 Sep 2026',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      total: cartTotal,
      status: 'Confirmed',
      trackingCode: `TRX-${nextCheckoutOrderId}-LHR`,
      estimatedDelivery: '12 Sep 2026',
      customer: {
        ...form,
        paymentMethod: finalPaymentMethod,
        transactionId: manualDetails.trxId.trim() || undefined,
        senderAccount:
          form.paymentMethod === 'JazzCash / EasyPaisa'
            ? manualDetails.senderPhone.trim()
            : form.paymentMethod === 'Direct Bank Transfer'
            ? `${manualDetails.senderBank.trim()} - Ref: ${manualDetails.trxId.trim()}`
            : undefined,
      },
    }
    setPlacedOrder(newOrder)
    onCompleteOrder(newOrder)
    setCheckoutStep('success')
  }

  // Generate WhatsApp receipt message for 1-click sharing
  const getWhatsAppReceiptUrl = (order: Order) => {
    const isCod = order.customer.paymentMethod === 'Cash on Delivery'
    const msg =
      `Assalam-o-Alaikum Jiya Collections!\n\n` +
      `I have placed an order on your website:\n` +
      `• *Order Reference:* #${order.id}\n` +
      `• *Customer Name:* ${order.customer.name}\n` +
      `• *Phone:* ${order.customer.phone}\n` +
      `• *City:* ${order.customer.city}\n` +
      `• *Total Amount:* ${formatPrice(order.total)}\n` +
      `• *Payment Method:* ${order.customer.paymentMethod}\n` +
      (order.customer.transactionId ? `• *Transaction ID (TID):* ${order.customer.transactionId}\n` : '') +
      (order.customer.senderAccount ? `• *Sender Account/Phone:* ${order.customer.senderAccount}\n` : '') +
      (isCod
        ? `\nPlease confirm my Cash on Delivery order for dispatch.`
        : `\nI am attaching my payment transfer screenshot herewith. Please verify and confirm my order.`)

    return `https://wa.me/923018472910?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <span className="drawer-eyebrow">Pakistan Nationwide Delivery</span>
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
                  placeholder="e.g. Ayesha Khan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0301 2345678"
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
                  placeholder="e.g. ayesha@gmail.com"
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
                placeholder="e.g. House 42, Street 8, Phase 5 DHA"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Special Delivery Instructions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Call before delivery, deliver after 2 PM"
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
                  badge: 'Recommended',
                  desc: 'Pay cash to courier when parcel arrives at your doorstep. Zero advance payment.',
                  icon: '💵',
                },
                {
                  id: 'JazzCash / EasyPaisa',
                  title: 'JazzCash / EasyPaisa (Mobile Transfer)',
                  badge: 'Instant & Easy',
                  desc: 'Transfer directly from your mobile wallet app to 0301-8472910.',
                  icon: '📱',
                },
                {
                  id: 'Direct Bank Transfer',
                  title: 'Direct Bank Transfer (Meezan IBFT)',
                  badge: 'Online Banking',
                  desc: 'Transfer from any Pakistani bank (HBL, Meezan, SadaPay, Nayapay).',
                  icon: '🏦',
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
                    <div className="pay-title-row">
                      <strong>{option.title}</strong>
                      {option.badge && <span className="payment-tag-badge">{option.badge}</span>}
                    </div>
                    <p>{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Subpanel 1: Cash on Delivery */}
            {form.paymentMethod === 'Cash on Delivery' && (
              <div className="payment-subpanel cod-subpanel">
                <div className="subpanel-badge cod-badge-tag">
                  <span>💵 Cash on Delivery (Pakistan Nationwide)</span>
                </div>
                <div className="cod-reassurance-box">
                  <div className="cod-point">
                    <span className="cod-check">✓</span>
                    <div>
                      <strong>Zero Advance Deposit</strong>
                      <p>You only pay when the parcel is handed over to you.</p>
                    </div>
                  </div>
                  <div className="cod-point">
                    <span className="cod-check">✓</span>
                    <div>
                      <strong>Dispatched via Trax / Leopard Courier</strong>
                      <p>Tracking number and SMS/WhatsApp notifications will be sent upon dispatch.</p>
                    </div>
                  </div>
                  <div className="cod-point">
                    <span className="cod-check">✓</span>
                    <div>
                      <strong>Exact Amount Ready</strong>
                      <p>Please keep <strong>{formatPrice(cartTotal)}</strong> in cash ready for the courier rider.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subpanel 2: JazzCash / EasyPaisa (Manual Mobile Transfer) */}
            {form.paymentMethod === 'JazzCash / EasyPaisa' && (
              <div className="payment-subpanel wallet-subpanel">
                <div className="subpanel-badge wallet-badge-tag">
                  <span>📱 JazzCash / EasyPaisa Mobile Transfer</span>
                </div>

                {/* Wallet Switcher Tabs */}
                <div className="wallet-switcher-tabs">
                  <button
                    type="button"
                    className={`wallet-tab-btn ${walletType === 'JazzCash' ? 'active jazzcash' : ''}`}
                    onClick={() => setWalletType('JazzCash')}
                  >
                    <span className="wallet-tab-icon">🔴</span> JazzCash
                  </button>
                  <button
                    type="button"
                    className={`wallet-tab-btn ${walletType === 'EasyPaisa' ? 'active easypaisa' : ''}`}
                    onClick={() => setWalletType('EasyPaisa')}
                  >
                    <span className="wallet-tab-icon">🟢</span> EasyPaisa
                  </button>
                </div>

                {/* Account Details Card with Copy */}
                <div className="account-details-card">
                  <div className="account-detail-line">
                    <span className="adl-label">Account Title:</span>
                    <strong className="adl-value">Jiya Collections</strong>
                  </div>
                  <div className="account-detail-line highlight">
                    <span className="adl-label">{walletType} Number:</span>
                    <strong className="adl-value phone-number">0301 8472910</strong>
                    <button
                      type="button"
                      className="copy-badge-btn"
                      onClick={() => handleCopy('03018472910', 'walletPhone')}
                    >
                      {copiedField === 'walletPhone' ? '✓ Copied!' : '📋 Copy Number'}
                    </button>
                  </div>
                  <div className="account-detail-line">
                    <span className="adl-label">Payable Amount:</span>
                    <strong className="adl-value price-tag">{formatPrice(cartTotal)}</strong>
                  </div>
                </div>

                {/* Quick 3-step instructions */}
                <div className="manual-transfer-steps">
                  <div className="mts-step">
                    <span className="mts-num">1</span>
                    <span>Open your <strong>{walletType} app</strong> & tap <em>Send Money</em>.</span>
                  </div>
                  <div className="mts-step">
                    <span className="mts-num">2</span>
                    <span>Send <strong>{formatPrice(cartTotal)}</strong> to <strong>0301 8472910</strong> (Title: <em>Jiya Collections</em>).</span>
                  </div>
                  <div className="mts-step">
                    <span className="mts-num">3</span>
                    <span>Enter your sender mobile number and Transaction ID (TID) below:</span>
                  </div>
                </div>

                {/* Form fields for sender number & TID */}
                <div className="subpanel-grid" style={{ marginTop: '14px' }}>
                  <div>
                    <label>Your Sender Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300 1234567"
                      className="checkout-subinput"
                      value={manualDetails.senderPhone}
                      onChange={(e) =>
                        setManualDetails({ ...manualDetails, senderPhone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Transaction ID (TID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10294857291"
                      className="checkout-subinput"
                      value={manualDetails.trxId}
                      onChange={(e) =>
                        setManualDetails({ ...manualDetails, trxId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <small className="manual-hint">
                  💬 After submitting, you can 1-click share your payment receipt on WhatsApp.
                </small>
              </div>
            )}

            {/* Subpanel 3: Direct Bank Transfer (IBFT) */}
            {form.paymentMethod === 'Direct Bank Transfer' && (
              <div className="payment-subpanel bank-subpanel">
                <div className="subpanel-badge bank-badge-tag">
                  <span>🏦 Meezan Islamic Banking IBFT</span>
                </div>

                <div className="bank-specs-card">
                  <div className="spec-row">
                    <span>Account Title:</span>
                    <strong>Jiya Collections</strong>
                  </div>
                  <div className="spec-row">
                    <span>Bank:</span>
                    <strong>Meezan Bank Ltd (Gulberg Branch, Lahore)</strong>
                  </div>
                  <div className="spec-row">
                    <span>Account No:</span>
                    <strong>0284 0104 8291 001</strong>
                    <button
                      type="button"
                      className="copy-mini-btn"
                      onClick={() => handleCopy('028401048291001', 'bankAcc')}
                    >
                      {copiedField === 'bankAcc' ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                  <div className="spec-row">
                    <span>IBAN:</span>
                    <strong>PK42 MEZN 0002 8401 0482 9101</strong>
                    <button
                      type="button"
                      className="copy-mini-btn"
                      onClick={() => handleCopy('PK42MEZN0002840104829101', 'bankIban')}
                    >
                      {copiedField === 'bankIban' ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                <div className="subpanel-grid" style={{ marginTop: '14px' }}>
                  <div>
                    <label>Your Bank Name *</label>
                    <select
                      className="checkout-subinput"
                      value={manualDetails.senderBank}
                      onChange={(e) =>
                        setManualDetails({ ...manualDetails, senderBank: e.target.value })
                      }
                    >
                      <option>HBL (Habib Bank Ltd)</option>
                      <option>Meezan Bank</option>
                      <option>SadaPay</option>
                      <option>NayaPay</option>
                      <option>Bank Alfalah</option>
                      <option>Standard Chartered</option>
                      <option>MCB Bank</option>
                      <option>UBL (United Bank Ltd)</option>
                      <option>Allied Bank</option>
                      <option>Faysal Bank</option>
                      <option>Other Bank</option>
                    </select>
                  </div>
                  <div>
                    <label>Transaction ID / IBFT Ref # *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FT2608304921"
                      className="checkout-subinput"
                      value={manualDetails.trxId}
                      onChange={(e) =>
                        setManualDetails({ ...manualDetails, trxId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <small className="manual-hint">
                  💬 After submitting, you can 1-click share your payment receipt on WhatsApp.
                </small>
              </div>
            )}

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
              Your order has been confirmed and placed with Jiya Collections studio.
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
                <span>Phone / WhatsApp:</span>
                <span>{placedOrder.customer.phone}</span>
              </div>
              <div className="receipt-row">
                <span>Payment Method:</span>
                <strong>{placedOrder.customer.paymentMethod}</strong>
              </div>
              {placedOrder.customer.transactionId && (
                <div className="receipt-row highlight-row">
                  <span>Transaction ID (TID):</span>
                  <strong>{placedOrder.customer.transactionId}</strong>
                </div>
              )}
              {placedOrder.customer.senderAccount && (
                <div className="receipt-row">
                  <span>Sender Account / Bank:</span>
                  <span>{placedOrder.customer.senderAccount}</span>
                </div>
              )}
              <div className="receipt-row">
                <span>Total Amount:</span>
                <strong>{formatPrice(placedOrder.total)}</strong>
              </div>
              <div className="receipt-row">
                <span>Estimated Delivery:</span>
                <span>2–3 Business Days via Trax Logistics</span>
              </div>
            </div>

            {/* Contextual WhatsApp Action for Manual Transfers */}
            {placedOrder.customer.paymentMethod !== 'Cash on Delivery' ? (
              <div className="whatsapp-receipt-box">
                <div className="wrb-icon">📲</div>
                <div className="wrb-text">
                  <h4>Send Payment Screenshot on WhatsApp</h4>
                  <p>
                    Tap the button below to share your transaction screenshot with our WhatsApp support.
                    Your order will be verified and packed instantly!
                  </p>
                </div>
                <a
                  href={getWhatsAppReceiptUrl(placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-action"
                >
                  <span>💬</span> Send Screenshot on WhatsApp
                </a>
              </div>
            ) : (
              <div className="cod-success-reassurance">
                <div className="csr-icon">💵</div>
                <div className="csr-text">
                  <h4>Cash on Delivery Confirmed</h4>
                  <p>
                    No advance payment required. Please keep <strong>{formatPrice(placedOrder.total)}</strong> in cash ready when the courier arrives at your doorstep.
                  </p>
                </div>
                <a
                  href={getWhatsAppReceiptUrl(placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-secondary"
                >
                  Need Help? WhatsApp Us
                </a>
              </div>
            )}

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
