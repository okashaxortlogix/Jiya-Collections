import { useState } from 'react'
import type { FormEvent } from 'react'

interface SizeGuideModalProps {
  onClose: () => void
  onAskStylist: () => void
}

export function SizeGuideModal({ onClose, onAskStylist }: SizeGuideModalProps) {
  const [calcBust, setCalcBust] = useState('')
  const [calcWaist, setCalcWaist] = useState('')
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null)

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault()
    const bustNum = parseFloat(calcBust)
    if (!bustNum || isNaN(bustNum)) return

    if (bustNum <= 35) setCalculatedSize('Small (S) — Tailored fit with 2" ease')
    else if (bustNum <= 38) setCalculatedSize('Medium (M) — Best seller size, graceful drape')
    else if (bustNum <= 41) setCalculatedSize('Large (L) — Comfortable relaxed modest cut')
    else setCalculatedSize('Extra Large (XL) — Generous fit with flowing silhouette')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="size-guide-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-pull-handle" aria-hidden="true" />
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Precision Fit</span>
            <h2 className="drawer-title">Size Guide & Fit Calculator</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close size guide">
            ✕
          </button>
        </div>

        {/* Interactive Sizing Calculator */}
        <div className="size-calc-card">
          <h4>Interactive Fit Recommender</h4>
          <p>Enter your measurements in inches to get your tailored recommendation:</p>
          <form className="calc-form" onSubmit={handleCalculate}>
            <div className="form-grid-2">
              <input
                type="number"
                step="0.5"
                placeholder="Bust (e.g. 36)"
                value={calcBust}
                onChange={(e) => setCalcBust(e.target.value)}
              />
              <input
                type="number"
                step="0.5"
                placeholder="Waist (e.g. 30)"
                value={calcWaist}
                onChange={(e) => setCalcWaist(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary-luxury sm">
              Calculate My Recommended Size ↗
            </button>
          </form>

          {calculatedSize && (
            <div className="calc-result-box">
              <span className="result-check">✓</span>
              <strong>Recommended: {calculatedSize}</strong>
            </div>
          )}
        </div>

        {/* Standard Measurement Table */}
        <div className="size-table-container">
          <div className="table-scroll-hint">← Swipe horizontally to view full size chart →</div>
          <table className="luxury-size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Bust (Inches)</th>
                <th>Waist (Inches)</th>
                <th>Hip (Inches)</th>
                <th>Standard Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Extra Small (XS)</strong></td>
                <td>32–33"</td>
                <td>26–27"</td>
                <td>34–35"</td>
                <td>44"</td>
              </tr>
              <tr>
                <td><strong>Small (S)</strong></td>
                <td>34–35"</td>
                <td>28–29"</td>
                <td>36–37"</td>
                <td>45"</td>
              </tr>
              <tr>
                <td><strong>Medium (M)</strong></td>
                <td>36–37"</td>
                <td>30–31"</td>
                <td>38–39"</td>
                <td>46"</td>
              </tr>
              <tr>
                <td><strong>Large (L)</strong></td>
                <td>38–40"</td>
                <td>32–34"</td>
                <td>40–42"</td>
                <td>47"</td>
              </tr>
              <tr>
                <td><strong>Extra Large (XL)</strong></td>
                <td>41–43"</td>
                <td>35–37"</td>
                <td>43–45"</td>
                <td>48"</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="size-dialog-footer">
          <p>
            Between two sizes? Choose the larger size for a relaxed modest fit, or enter your custom
            measurements using our Custom Stitching service.
          </p>
          <button className="btn-primary-luxury" onClick={onAskStylist}>
            Ask Jiya AI Stylist for Advice ↗
          </button>
        </div>
      </div>
    </div>
  )
}
