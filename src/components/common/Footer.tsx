import { useState } from 'react'
import type { FormEvent } from 'react'

interface FooterProps {
  brandName: string
  onCategorySelect: (cat: string) => void
  onOpenModal: (modal: 'policy' | 'size' | 'account' | 'contact' | 'admin' | 'custom') => void
  onScrollTo: (id: string) => void
  onNewsletterSubscribe: (email: string) => void
}

export function Footer({
  brandName,
  onCategorySelect,
  onOpenModal,
  onScrollTo,
  onNewsletterSubscribe,
}: FooterProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onNewsletterSubscribe(email.trim())
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 5000)
    }
  }

  return (
    <footer className="site-footer" id="story">
      {/* 1. Prestige Brand Guarantees Bar */}
      <div className="footer-trust-strip">
        <div className="trust-card">
          <span className="trust-icon">🧵</span>
          <div>
            <strong>100% Pure Cultural Fabrics</strong>
            <p>Supima Lawn, 6-Pound Chinese Boski, Egyptian Giza Latha & Karandi</p>
          </div>
        </div>
        <div className="trust-card">
          <span className="trust-icon">🚚</span>
          <div>
            <strong>Doorstep Pakistan Delivery</strong>
            <p>Swift insured courier across all cities. Free on orders over Rs. 8,000</p>
          </div>
        </div>
        <div className="trust-card">
          <span className="trust-icon">✂</span>
          <div>
            <strong>Generational Master Darzi</strong>
            <p>Precision Pret silhouettes & bespoke custom tailoring in Lahore</p>
          </div>
        </div>
        <div className="trust-card">
          <span className="trust-icon">↺</span>
          <div>
            <strong>3-Day Doorstep Exchange</strong>
            <p>Hassle-free size adjustment with dedicated WhatsApp support</p>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Directory */}
      <div className="footer-top">
        {/* Col 1: Jiya Collections Heritage */}
        <div className="footer-brand-col">
          <button className="footer-logo" onClick={() => onScrollTo('hero')}>
            <span className="footer-logo-primary">{brandName}</span>
            <span className="footer-monogram-pill">EST. 2024 · LAHORE</span>
          </button>
          <p className="footer-bio">
            Rooted in Lahore’s rich textile traditions, Jiya Collections creates authentic Pakistani
            cultural attire for men and women. We celebrate modest silhouettes, generational hand-embroidery,
            and 100% natural luxury fabrics.
          </p>
          <div className="footer-contact-info">
            <span>📍 <strong>Flagship Studio:</strong> 24-C Main Boulevard, Gulberg III, Lahore</span>
            <span>💬 <strong>WhatsApp & Support:</strong> +92 301 8472910</span>
            <span>✉ <strong>Official Concierge:</strong> care@jiyacollections.pk</span>
            <span>⏰ <strong>Studio Hours:</strong> Mon – Sat: 11:00 AM – 9:00 PM PKT</span>
          </div>
        </div>

        {/* Col 2: Eastern Collections */}
        <div className="footer-links-col">
          <span className="footer-col-title">Eastern Collections</span>
          <button onClick={() => { onCategorySelect('Women Stitched'); onScrollTo('shop'); }}>
            Women Stitched (Pret Suits)
          </button>
          <button onClick={() => { onCategorySelect('Women Unstitched'); onScrollTo('shop'); }}>
            Women Unstitched (3-Piece)
          </button>
          <button onClick={() => { onCategorySelect('Men Stitched'); onScrollTo('shop'); }}>
            Men Stitched (Shalwar Kameez)
          </button>
          <button onClick={() => { onCategorySelect('Men Unstitched'); onScrollTo('shop'); }}>
            Men Unstitched (Boski & Latha)
          </button>
          <button onClick={() => { onCategorySelect('Festive Couture'); onScrollTo('shop'); }}>
            Festive Couture & Sherwanis
          </button>
          <button onClick={() => onOpenModal('custom')}>
            Bespoke Master Tailoring Atelier
          </button>
        </div>

        {/* Col 3: Client Experience & Care */}
        <div className="footer-links-col">
          <span className="footer-col-title">Client Experience</span>
          <button onClick={() => onOpenModal('size')}>Interactive Size & Fit Guide</button>
          <button onClick={() => onOpenModal('policy')}>Doorstep Delivery & Courier Policy</button>
          <button onClick={() => onOpenModal('policy')}>3-Day Exchange & Returns</button>
          <button onClick={() => onOpenModal('account')}>VIP Customer Dashboard & Orders</button>
          <button onClick={() => onOpenModal('contact')}>Book Lahore Studio Fitting</button>
          <button onClick={() => onOpenModal('custom')}>Custom Measurement Consultation</button>
        </div>

        {/* Col 4: Jiya Gazette VIP Newsletter */}
        <div className="footer-newsletter-col">
          <span className="footer-col-title">The Jiya Gazette</span>
          <p className="newsletter-text">
            Subscribe for private Eid collection previews, unstitched fabric launch alerts, and 10% off
            your first order.
          </p>

          <form className="newsletter-form" onSubmit={handleFormSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address for Jiya Gazette"
            />
            <button type="submit" aria-label="Subscribe to Jiya Gazette">
              Join ↗
            </button>
          </form>

          {isSubscribed ? (
            <div className="newsletter-success-tag">
              ✓ Welcome to Jiya Collections Gazette! Code <strong>EID2026</strong> saved.
            </div>
          ) : (
            <small className="privacy-note">No spam. Only considered notes and private previews.</small>
          )}

          {/* Secure Payment Badges */}
          <div className="footer-payment-strip">
            <span className="payment-label">Accepted Payment Methods:</span>
            <div className="payment-chips">
              <span className="pay-chip">💵 Cash on Delivery (COD)</span>
              <span className="pay-chip">🏦 Bank Transfer (IBFT)</span>
              <span className="pay-chip">📱 JazzCash / EasyPaisa</span>
              <span className="pay-chip">💳 Visa / MasterCard</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Social Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-left">
          <span>© 2026 {brandName} Ltd. All Rights Reserved. Crafted with pride in Lahore, Pakistan.</span>
          <button
            className="staff-portal-discreet-link"
            onClick={() => onOpenModal('admin')}
            title="Authorized Staff Portal"
          >
            🔒 Staff Portal
          </button>
        </div>

        <div className="footer-social-links">
          <a href="#instagram" onClick={(e) => e.preventDefault()} aria-label="Instagram">Instagram</a>
          <a href="#facebook" onClick={(e) => e.preventDefault()} aria-label="Facebook">Facebook</a>
          <a href="#pinterest" onClick={(e) => e.preventDefault()} aria-label="Pinterest">Pinterest</a>
          <a href="#tiktok" onClick={(e) => e.preventDefault()} aria-label="TikTok">TikTok</a>
          <a href="#youtube" onClick={(e) => e.preventDefault()} aria-label="YouTube">YouTube</a>
        </div>

        <button className="back-to-top-btn" onClick={() => onScrollTo('hero')}>
          Back to Top ↑
        </button>
      </div>
    </footer>
  )
}
