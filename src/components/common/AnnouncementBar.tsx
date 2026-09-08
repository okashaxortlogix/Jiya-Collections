import type { Currency } from '../../types'

interface AnnouncementBarProps {
  announcementText: string
  currentCurrency: Currency
  onCurrencyChange: (c: Currency) => void
  onCopyPromo: (code: string) => void
}

export function AnnouncementBar({
  announcementText,
  currentCurrency,
  onCurrencyChange,
  onCopyPromo,
}: AnnouncementBarProps) {
  const currencies: Currency[] = ['PKR', 'USD', 'AED', 'GBP']

  // Duplicate items for continuous seamless loop
  const tickerItems = [1, 2, 3, 4]

  return (
    <aside className="announcement-bar" aria-label="Store announcement">
      <div className="announcement-ticker-container">
        <div className="announcement-ticker-track">
          {tickerItems.map((idx) => (
            <div key={idx} className="announcement-ticker-item">
              <span className="sparkle">✦</span>
              <span className="announcement-msg">{announcementText}</span>
              <button
                type="button"
                className="announcement-copy-btn"
                onClick={() => onCopyPromo('EID2026')}
                title="Click to copy promo code"
              >
                Copy Code <strong>EID2026</strong>
              </button>
              <span className="ticker-bullet">·</span>
              <span className="announcement-submsg">
                Free Delivery All Across Pakistan on orders over Rs. 8,000
              </span>
              <span className="sparkle">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="announcement-actions">
        <div className="currency-selector" title="Select Currency">
          <span className="currency-label">Currency:</span>
          {currencies.map((c) => (
            <button
              key={c}
              className={`currency-btn ${currentCurrency === c ? 'active' : ''}`}
              onClick={() => onCurrencyChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
