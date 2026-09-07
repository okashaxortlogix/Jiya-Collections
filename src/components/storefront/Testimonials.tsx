export function Testimonials() {
  return (
    <section className="testimonials-section" aria-label="Customer Reviews">
      <div className="testimonials-header">
        <span className="section-eyebrow">Client Voices</span>
        <h2 className="section-title">Worn, Loved, Cherished</h2>
        <div className="overall-rating-badge">
          <span className="stars">★★★★★</span>
          <strong>4.92 / 5.0</strong>
          <span>Based on 340+ verified Pakistan & diaspora reviews</span>
        </div>
      </div>

      <div className="testimonials-grid">
        <div className="testimonial-card">
          <span className="quote-mark">“</span>
          <p className="quote-body">
            The Noor Lawn Set feels extraordinary on an ordinary afternoon. The scalloped organza finishing
            and breathability of the fabric is far superior to standard commercial lawn.
          </p>
          <div className="quote-author">
            <strong>Zainab K.</strong>
            <span>Verified Buyer · Lahore (Cantt)</span>
          </div>
        </div>

        <div className="testimonial-card featured">
          <span className="quote-mark">“</span>
          <p className="quote-body">
            I ordered the Ayla Raw Silk Abaya for an overseas graduation ceremony. The drape is heavy, opaque,
            and completely wrinkle-resistant. The packaging arrived scented with a personalized note!
          </p>
          <div className="quote-author">
            <strong>Dr. Anum Tariq</strong>
            <span>Verified Buyer · Islamabad</span>
          </div>
        </div>

        <div className="testimonial-card">
          <span className="quote-mark">“</span>
          <p className="quote-body">
            The Bespoke Studio nailed my exact sleeve and kurta length. Finding modestwear that doesn't
            compromise on haute aesthetics in Pakistan used to be difficult — Jiya Collections is my go-to now.
          </p>
          <div className="quote-author">
            <strong>Mahnoor F.</strong>
            <span>Verified Buyer · Karachi (Clifton)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
