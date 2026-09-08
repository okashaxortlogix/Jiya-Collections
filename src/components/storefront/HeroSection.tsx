import { useState } from 'react'
import type { HeroSlide } from '../../types'

interface HeroSectionProps {
  slides: HeroSlide[]
  onExploreClick: () => void
  onBespokeClick: () => void
}

export function HeroSection({
  slides,
  onExploreClick,
  onBespokeClick,
}: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <section className="hero-section" id="hero">
      <div className="hero-slide-container">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide ${activeSlide === idx ? 'active' : ''}`}
            style={{ display: activeSlide === idx ? 'grid' : 'none' }}
          >
            <div className="hero-copy-column">
              <div className="hero-eyebrow-badge">
                <span className="gem-dot">✦</span>
                <span>{slide.eyebrow}</span>
              </div>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-description">{slide.subtitle}</p>

              <div className="hero-cta-group">
                <button className="btn-primary-luxury" onClick={onExploreClick}>
                  <span>Explore Collection</span>
                  <span className="arrow-glyph">→</span>
                </button>
                <button className="btn-secondary-luxury" onClick={onBespokeClick}>
                  <span>Custom Stitching</span>
                  <span className="plus-glyph">+</span>
                </button>
              </div>

              <div className="hero-highlights">
                <div className="highlight-item">
                  <strong>100% Authentic Cultural Fabrics</strong>
                  <span>Chinese Boski · Egyptian Latha · Supima Lawn · Fine Karandi</span>
                </div>
                <div className="highlight-item">
                  <strong>Free Shipping</strong>
                  <span>Pakistan-wide on orders over Rs. 8,000</span>
                </div>
              </div>
            </div>

            <div className="hero-visual-column">
              <div className="hero-image-frame">
                <img src={slide.image} alt={slide.title} className="hero-cover-img" />
                <div className="hero-floating-badge">
                  <span className="badge-seal">MADE IN LAHORE</span>
                  <span className="badge-caption">{slide.tag}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Selector Indicators */}
      <div className="hero-slide-nav">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            className={`slide-dot ${activeSlide === idx ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
            aria-label={`Go to slide ${idx + 1}: ${slide.tag}`}
          >
            <span className="dot-index">0{idx + 1}</span>
            <span className="dot-label">{slide.tag}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
