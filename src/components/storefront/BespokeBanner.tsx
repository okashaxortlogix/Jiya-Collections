interface BespokeBannerProps {
  onStartCustomDesign: () => void
}

export function BespokeBanner({ onStartCustomDesign }: BespokeBannerProps) {
  return (
    <section className="bespoke-banner" id="custom">
      <div className="bespoke-inner">
        <div className="bespoke-visual">
          <img
            src="/products/bespoke_artisan.jpg"
            alt="Artisan hand-embroidery in progress"
            className="bespoke-img"
          />
          <div className="bespoke-badge-overlay">
            <span>CUSTOM STITCHING</span>
            <strong>Lahore, Pakistan</strong>
          </div>
        </div>

        <div className="bespoke-copy">
          <span className="section-eyebrow">Custom Stitching & Tailoring</span>
          <h2 className="bespoke-title">Custom Outfits Stitched Just For You</h2>
          <p className="bespoke-text">
            Have a distinct idea for your festive or everyday outfit? Choose your preferred fabrics,
            necklines, sleeve lengths, and trouser cuts. Our master tailors stitch your dress to
            your exact measurements with perfect fitting.
          </p>

          <div className="bespoke-points">
            <div className="b-point">
              <span>01</span>
              <div>
                <strong>Fabric Selection</strong>
                <small>Supima Lawn, Mulberry Silk, Organza, Velvet</small>
              </div>
            </div>
            <div className="b-point">
              <span>02</span>
              <div>
                <strong>Made to Measure</strong>
                <small>Custom bust, waist, shoulder & length adjustments</small>
              </div>
            </div>
            <div className="b-point">
              <span>03</span>
              <div>
                <strong>WhatsApp Support</strong>
                <small>Direct WhatsApp progress updates with photos</small>
              </div>
            </div>
          </div>

          <button
            className="btn-primary-luxury bespoke-btn"
            onClick={onStartCustomDesign}
          >
            <span>Request Custom Stitching</span>
            <span className="arrow-glyph">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
