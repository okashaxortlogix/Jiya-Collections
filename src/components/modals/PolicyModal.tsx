import { useState } from 'react'

interface PolicyModalProps {
  onClose: () => void
}

export function PolicyModal({ onClose }: PolicyModalProps) {
  const [city, setCity] = useState('Lahore')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="policy-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Client Care</span>
            <h2 className="drawer-title">Shipping & Return Policies</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close policy">
            ✕
          </button>
        </div>

        {/* City Delivery Estimator */}
        <div className="policy-calc-box">
          <h4>Estimate Delivery Time to Your City</h4>
          <div className="policy-calc-row">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="luxury-select"
            >
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad / Rawalpindi</option>
              <option>Faisalabad</option>
              <option>Multan</option>
              <option>Peshawar</option>
              <option>Quetta</option>
              <option>International (UK, UAE, US)</option>
            </select>
            <div className="calc-result-tag">
              {city === 'Lahore' && '⚡ Next-Day Delivery (24 Hours)'}
              {city === 'Karachi' && '📦 2–3 Business Days via Air Express'}
              {city.includes('Islamabad') && '📦 1–2 Business Days'}
              {city === 'International (UK, UAE, US)' && '✈ 4–7 Days via DHL Express'}
              {!['Lahore', 'Karachi', 'International (UK, UAE, US)'].includes(city) &&
                !city.includes('Islamabad') &&
                '📦 2–4 Business Days via Trax Logistics'}
            </div>
          </div>
        </div>

        <div className="policy-copy-sections">
          <div className="policy-section">
            <h3>Domestic Pakistan Shipping</h3>
            <p>
              All domestic orders are carefully steam-pressed, perfumed with bespoke atelier mist, and
              dispatched from our Lahore facility via tracked couriers. Complimentary shipping is
              automatically applied on all orders of Rs. 8,000 or above.
            </p>
          </div>

          <div className="policy-section">
            <h3>3-Day Return & Exchange Guarantee</h3>
            <p>
              We want you to adore your piece. If sizing or styling requires adjustment, request a return
              or exchange within 3 days of parcel delivery. Our courier will pick up from your doorstep.
              Items must be unwashed with all original fabric security tags attached.
            </p>
          </div>

          <div className="policy-section">
            <h3>Payment Methods</h3>
            <p>
              We offer Cash on Delivery (COD) nationwide, alongside Direct Bank Transfers (IBFT),
              JazzCash, EasyPaisa, and Visa/Mastercard processing.
            </p>
          </div>
        </div>

        <button className="btn-primary-luxury full-width" onClick={onClose}>
          Back to Shopping
        </button>
      </div>
    </div>
  )
}
