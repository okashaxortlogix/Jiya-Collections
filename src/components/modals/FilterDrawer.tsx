interface FilterDrawerProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (cat: string) => void
  sort: string
  onSortChange: (sort: string) => void
  priceMax: number
  onPriceMaxChange: (price: number) => void
  inStockOnly: boolean
  onToggleInStockOnly: (val: boolean) => void
  onReset: () => void
  onClose: () => void
  visibleCount: number
  formatPrice: (pkr: number) => string
}

export function FilterDrawer({
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onSortChange,
  priceMax,
  onPriceMaxChange,
  inStockOnly,
  onToggleInStockOnly,
  onReset,
  onClose,
  visibleCount,
  formatPrice,
}: FilterDrawerProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="drawer-panel filter-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Refine Collection</span>
            <h2 className="drawer-title">Filters & Sort</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        <div className="filter-drawer-body">
          {/* Sort Dropdown */}
          <div className="filter-group">
            <label className="filter-title">Sort Collection By</label>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="luxury-select"
            >
              <option value="Recommended">Recommended Editorial</option>
              <option value="Newest">Newest Arrivals</option>
              <option value="Price low to high">Price: Low to High</option>
              <option value="Price high to low">Price: High to Low</option>
              <option value="Rating">Highest Customer Rating</option>
            </select>
          </div>

          {/* Category Radio Pills */}
          <div className="filter-group">
            <label className="filter-title">Category</label>
            <div className="filter-pill-grid">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter-pill ${activeCategory === c ? 'active' : ''}`}
                  onClick={() => onSelectCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="filter-group">
            <div className="slider-header">
              <label className="filter-title">Maximum Price</label>
              <strong>{formatPrice(priceMax)}</strong>
            </div>
            <input
              type="range"
              min="4000"
              max="20000"
              step="500"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
              className="luxury-range-slider"
            />
            <div className="slider-labels">
              <span>{formatPrice(4000)}</span>
              <span>{formatPrice(20000)}</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="filter-group toggle-group">
            <div>
              <strong className="filter-title">In-Stock Only</strong>
              <p className="filter-hint">Hide pieces requiring made-to-order lead time</p>
            </div>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStockOnly(e.target.checked)}
              className="luxury-checkbox"
            />
          </div>
        </div>

        <div className="drawer-footer">
          <div className="drawer-two-buttons">
            <button className="btn-outline-luxury" onClick={onReset}>
              Reset
            </button>
            <button className="btn-primary-luxury" onClick={onClose}>
              Show {visibleCount} Results
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
