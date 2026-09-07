import { useState } from 'react'
import type { FormEvent } from 'react'

interface ContactModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ContactModal({ onClose, onSuccess }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: 'Hira Ahmed',
    email: 'hira.ahmed@example.com',
    subject: 'Sizing & Fit Advice',
    message: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onSuccess()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="contact-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Get in Touch</span>
            <h2 className="drawer-title">Lahore Atelier Concierge</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close contact modal">
            ✕
          </button>
        </div>

        {!submitted ? (
          <form className="contact-form-body" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="luxury-select"
              >
                <option>Sizing & Fit Advice</option>
                <option>Bespoke Couture Consultation</option>
                <option>Existing Order Inquiries</option>
                <option>Bridal & Trousseau Orders</option>
                <option>Press & Collaborations</option>
              </select>
            </div>

            <div className="form-field">
              <label>Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how our Lahore atelier concierge can assist you..."
              />
            </div>

            <button type="submit" className="btn-primary-luxury full-width">
              Send Message to Concierge ↗
            </button>
          </form>
        ) : (
          <div className="contact-success-box">
            <span className="success-seal">✓</span>
            <h3>Message Received</h3>
            <p>
              Thank you for reaching out to the Jiya Collections atelier. A member of our styling
              concierge will reply to {form.email} within 2 hours.
            </p>
            <button className="btn-primary-luxury" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
