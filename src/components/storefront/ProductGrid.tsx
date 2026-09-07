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
  const hasActiveFilters =
    activeCategory !== 'All pieces' || search || priceMax < 20000 || inStockOnly

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
          {/* Category Filter Tabs */}
          <div className="category-tabs" role="tablist">
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

          {/* Filter & Sort Trigger */}
          <div className="sort-filter-actions">
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

      {/* Product Cards Grid */}
      <div className="products-grid">
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
