import { useState, useRef } from 'react'
import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
  onOpenFilterDrawer: () => void
  search: string
  onClearSearch: () => void
  priceMax: number
  onResetPriceMax: () => void
  inStockOnly: boolean
  onToggleInStockOnly: () => void
  onResetAllFilters: () => void
  wishlist: number[]
  onToggleWishlist: (id: number) => void
  onQuickView: (product: Product) => void
  onQuickAdd: (product: Product) => void
  formatPrice: (pkr: number) => string
}

export function ProductGrid({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  onOpenFilterDrawer,
  search,
  onClearSearch,
  priceMax,
  onResetPriceMax,
  inStockOnly,
  onToggleInStockOnly,
  onResetAllFilters,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
  formatPrice,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider')
  const tabsRef = useRef<HTMLDivElement>(null)
  const productsScrollRef = useRef<HTMLDivElement>(null)

  const hasActiveFilters =
    activeCategory !== 'All pieces' || search || priceMax < 20000 || inStockOnly

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const offset = direction === 'left' ? -260 : 260
      tabsRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  const scrollProducts = (direction: 'left' | 'right') => {
    if (productsScrollRef.current) {
      const scrollAmount = Math.max(340, productsScrollRef.current.clientWidth * 0.75)
      productsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <main className="shop-container" id="shop">
      <div className="shop-header">
        <div className="shop-heading-group">
          <span className="section-eyebrow">The 2026 Pret & Luxury Edit</span>
          <h2 className="section-title">Considered Pieces for Every Day</h2>
          <p className="section-subtitle">
            Showing {products.length} handcrafted pieces crafted from premium natural fibres.
          </p>
        </div>

        <div className="shop-controls">
          {/* Category Filter Tabs with Left & Right Arrow Buttons */}
          <div className="category-tabs-container">
            <button
              type="button"
              className="cat-scroll-arrow left"
              onClick={() => scrollTabs('left')}
              aria-label="Scroll categories left"
              title="Previous categories"
            >
              ‹
            </button>

            <div className="category-tabs" ref={tabsRef} role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="cat-scroll-arrow right"
              onClick={() => scrollTabs('right')}
              aria-label="Scroll categories right"
              title="More categories"
            >
              ›
            </button>
          </div>

          {/* Controls: View Switcher & Filter Trigger */}
          <div className="sort-filter-actions">
            <div className="view-mode-toggle" title="Switch layout">
              <button
                type="button"
                className={`view-btn ${viewMode === 'slider' ? 'active' : ''}`}
                onClick={() => setViewMode('slider')}
                title="Horizontal Slider with Left/Right side buttons"
              >
                <span>⇄ Slider</span>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Full Grid View"
              >
                <span>⊞ Grid</span>
              </button>
            </div>

            <button
              className="filter-toggle-btn"
              onClick={onOpenFilterDrawer}
              aria-label="Open filter & sort drawer"
            >
              <span>Filters & Refinements</span>
              <span className="filter-badge-pill">
                {priceMax < 20000 || inStockOnly || activeCategory !== 'All pieces'
                  ? 'Active'
                  : 'All'}
              </span>
              <span>⚙</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="active-chips-bar">
          <span className="active-chips-label">Applied Filters:</span>
          {activeCategory !== 'All pieces' && (
            <span className="filter-chip">
              Category: {activeCategory}
              <button onClick={() => onSelectCategory('All pieces')}>✕</button>
            </span>
          )}
          {search && (
            <span className="filter-chip">
              Search: "{search}"
              <button onClick={onClearSearch}>✕</button>
            </span>
          )}
          {priceMax < 20000 && (
            <span className="filter-chip">
              Under {formatPrice(priceMax)}
              <button onClick={onResetPriceMax}>✕</button>
            </span>
          )}
          {inStockOnly && (
            <span className="filter-chip">
              In Stock Only
              <button onClick={onToggleInStockOnly}>✕</button>
            </span>
          )}
          <button className="clear-all-chips-btn" onClick={onResetAllFilters}>
            Reset All
          </button>
        </div>
      )}

      {/* Product Showcase with Left & Right Side Navigation Buttons */}
      <div className="products-showcase-wrapper">
        {viewMode === 'slider' && products.length > 0 && (
          <button
            type="button"
            className="products-scroll-arrow left"
            onClick={() => scrollProducts('left')}
            aria-label="Scroll products left"
            title="Previous items (Left)"
          >
            ‹
          </button>
        )}

        <div
          className={`products-container ${viewMode === 'slider' ? 'slider-mode' : 'grid-mode'}`}
          ref={productsScrollRef}
        >
          {products.map((product) => {
            const isSaved = wishlist.includes(product.id)
            return (
              <ProductCard
                key={product.id}
                product={product}
                isSaved={isSaved}
                formattedPrice={formatPrice(product.price)}
                formattedOldPrice={product.oldPrice ? formatPrice(product.oldPrice) : undefined}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onQuickAdd={onQuickAdd}
              />
            )
          })}
        </div>

        {viewMode === 'slider' && products.length > 0 && (
          <button
            type="button"
            className="products-scroll-arrow right"
            onClick={() => scrollProducts('right')}
            aria-label="Scroll products right"
            title="Next items (Right)"
          >
            ›
          </button>
        )}
      </div>

      {products.length === 0 && (
        <div className="empty-catalog-state">
          <span className="empty-icon">⌕</span>
          <h3>No matching pieces found</h3>
          <p>Try adjusting your search keywords, price range, or category filters.</p>
          <button className="btn-primary-luxury" onClick={onResetAllFilters}>
            Show All Collections
          </button>
        </div>
      )}
    </main>
  )
}
