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

  return (
    <aside className="announcement-bar" aria-label="Store announcement">
      <div className="announcement-content">
        <span className="sparkle">✦</span>
        <span>{announcementText}</span>
        <button
          className="announcement-copy-btn"
          onClick={() => onCopyPromo('EID2026')}
        >
          Copy Code <strong>EID2026</strong>
        </button>
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
