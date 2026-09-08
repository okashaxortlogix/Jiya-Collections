import { useState } from 'react'
import type { FormEvent } from 'react'

interface ContactModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function ContactModal({ onClose, onSuccess }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
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
        <div className="sheet-pull-handle" aria-hidden="true" />
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Get in Touch</span>
            <h2 className="drawer-title">Customer Support & Inquiries</h2>
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
                  placeholder="e.g. Ayesha Khan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
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
            </div>

            <div className="form-field">
              <label>Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="luxury-select"
              >
                <option>Sizing & Fit Advice</option>
                <option>Custom Stitching Consultation</option>
                <option>Existing Order Inquiries</option>
                <option>Bridal & Wedding Orders</option>
                <option>General Questions</option>
              </select>
            </div>

            <div className="form-field">
              <label>Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you with your order, sizing, or stitching?..."
              />
            </div>

            <button type="submit" className="btn-primary-luxury full-width">
              Send Message ↗
            </button>
          </form>
        ) : (
          <div className="contact-success-box">
            <span className="success-seal">✓</span>
            <h3>Message Received</h3>
            <p>
              Thank you for reaching out! Our customer support team will reply to {form.email} within 2 hours.
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
