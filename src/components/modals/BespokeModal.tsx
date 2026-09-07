import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BespokeRequest } from '../../types'

interface BespokeModalProps {
  onClose: () => void
  onSubmitBespoke: (req: BespokeRequest) => void
}

let nextBespokeId = 830

export function BespokeModal({ onClose, onSubmitBespoke }: BespokeModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [refId, setRefId] = useState('')

  const [form, setForm] = useState({
    fabric: 'Pure Supima Lawn',
    silhouette: 'A-Line Kurta & Trousers',
    colorPreference: 'Ivory / Gold',
    bust: '36',
    waist: '30',
    hip: '38',
    length: '46',
    budget: '15000',
    eventDate: '2026-10-15',
    notes: 'Need delicate tilla embroidery along the neckline and pleated sleeve cuffs.',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newRef = `BESPOKE-2026-${++nextBespokeId}`
    setRefId(newRef)
    setSubmitted(true)
    onSubmitBespoke({
      id: newRef,
      date: '08 Sep 2026',
      ...form,
      status: 'Pattern Drafting',
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bespoke-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="bespoke-dialog-header">
          <div>
            <span className="drawer-eyebrow">Bespoke Couture Atelier</span>
            <h2 className="drawer-title">Craft Your Custom Silhouette</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close custom studio">
            ✕
          </button>
        </div>

        {!submitted ? (
          <form className="bespoke-form-body" onSubmit={handleSubmit}>
            {/* 1. Fabric Selection */}
            <div className="custom-step">
              <label className="step-title">1. Select Base Fabric</label>
              <div className="custom-chips">
                {[
                  'Pure Chinese Boski Silk',
                  'Egyptian Giza Latha',
                  'Pure Supima Lawn',
                  'Koh-e-Noor Fine Karandi',
                  'Pure Crinkle Chiffon',
                  'Micro Velvet 9000',
                ].map((f) => (
                  <button
                    type="button"
                    key={f}
                    className={`custom-chip ${form.fabric === f ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, fabric: f })}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Silhouette Cut */}
            <div className="custom-step">
              <label className="step-title">2. Choose Silhouette & Cultural Style</label>
              <div className="custom-chips">
                {[
                  'Men: Traditional Shalwar Kameez',
                  'Men: Kurta Pajama & Waistcoat',
                  'Men: Royal Sherwani / Prince Coat',
                  'Women: Embroidered Shalwar Kameez',
                  'Women: Kalidar Peshwas & Dupatta',
                  'Women: Festive Gharara / Sharara',
                ].map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`custom-chip ${form.silhouette === s ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, silhouette: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Measurements in Inches */}
            <div className="custom-step">
              <label className="step-title">3. Your Tailoring Measurements (Inches)</label>
              <div className="measurements-grid">
                <div>
                  <label>Bust</label>
                  <input
                    type="text"
                    value={form.bust}
                    onChange={(e) => setForm({ ...form, bust: e.target.value })}
                  />
                </div>
                <div>
                  <label>Waist</label>
                  <input
                    type="text"
                    value={form.waist}
                    onChange={(e) => setForm({ ...form, waist: e.target.value })}
                  />
                </div>
                <div>
                  <label>Hip</label>
                  <input
                    type="text"
                    value={form.hip}
                    onChange={(e) => setForm({ ...form, hip: e.target.value })}
                  />
                </div>
                <div>
                  <label>Kurta Length</label>
                  <input
                    type="text"
                    value={form.length}
                    onChange={(e) => setForm({ ...form, length: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 4. Budget & Event Date */}
            <div className="custom-step">
              <div className="form-grid-2">
                <div>
                  <label>Estimated Budget (PKR)</label>
                  <input
                    type="text"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
                <div>
                  <label>Required By Date</label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 5. Special Notes */}
            <div className="custom-step">
              <label className="step-title">5. Design Notes & Embroidery Details</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Describe necklines, sleeve preferences, color combinations, or occasion context..."
              />
            </div>

            <button type="submit" className="btn-primary-luxury full-width">
              Submit Custom Order Request to Lahore Atelier ↗
            </button>
          </form>
        ) : (
          <div className="custom-success-view">
            <span className="success-seal">✦</span>
            <h3>Your Custom Design Request is Received!</h3>
            <p>
              Reference ID: <strong>{refId}</strong>
            </p>
            <p className="success-desc">
              Our master pattern maker is reviewing your requirements ({form.fabric} · {form.silhouette}).
              A senior design specialist will reach out via WhatsApp within 4 business hours with fabric
              swatches and sketch iterations.
            </p>

            <div className="custom-success-actions">
              <a
                href={`https://wa.me/923018472910?text=Hi%20Jiya%20Collections,%20I%20just%20submitted%20bespoke%20request%20${refId}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary-luxury"
              >
                Open WhatsApp Chat with Stylist 💬
              </a>
              <button className="btn-outline-luxury" onClick={onClose}>
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
