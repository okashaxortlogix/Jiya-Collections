import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import type { Product } from '../../types'

interface HeaderProps {
  brandName: string
  search: string
  onSearchChange: (query: string) => void
  onClearSearch: () => void
  products: Product[]
  onQuickView: (product: Product) => void
  formatPrice: (pkr: number) => string
  wishlistCount: number
  cartCount: number
  mobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  onScrollTo: (id: string) => void
  onOpenModal: (modal: 'wishlist' | 'cart' | 'account' | 'admin' | 'custom' | 'size' | 'policy' | 'contact') => void
  onCategorySelect?: (cat: string) => void
  isCustomerLoggedIn?: boolean
  customerName?: string
}

const TRENDING_SEARCHES = [
  'Shalwar Kameez',
  'Men Boski 6-Pound',
  'Royal Latha',
  'Unstitched 3-Piece Lawn',
  'Jamawar Waistcoat',
  'Festive Sherwani',
]

export function Header({
  brandName,
  search,
  onSearchChange,
  onClearSearch,
  products,
  onQuickView,
  formatPrice,
  wishlistCount,
  cartCount,
  mobileMenuOpen,
  onToggleMobileMenu,
  onScrollTo,
  onOpenModal,
  onCategorySelect,
  isCustomerLoggedIn = true,
  customerName,
}: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchWrapRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // Compute live search matches
  const cleanQ = search.trim().toLowerCase()
  const matchingProducts = cleanQ
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(cleanQ) ||
            p.category.toLowerCase().includes(cleanQ) ||
            p.fabric.toLowerCase().includes(cleanQ) ||
            p.color.toLowerCase().includes(cleanQ)
        )
        .slice(0, 5)
    : []

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  const handleSearchSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault()
    setIsFocused(false)
    setMobileSearchOpen(false)
    onScrollTo('shop')
  }

  const handleSelectTrending = (tag: string) => {
    onSearchChange(tag)
    setIsFocused(false)
    setMobileSearchOpen(false)
    onScrollTo('shop')
  }

  const handleSelectProduct = (product: Product) => {
    setIsFocused(false)
    setMobileSearchOpen(false)
    onQuickView(product)
  }

  const handleNavCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName)
    }
    onScrollTo('shop')
    if (mobileMenuOpen) {
      onToggleMobileMenu()
    }
  }

  return (
    <header className="site-header">
      {/* Main Header Container */}
      <div className="header-inner">
        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle-btn"
          aria-label="Toggle mobile menu"
          onClick={onToggleMobileMenu}
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>

        {/* Brand Monogram & Logo */}
        <button
          className="brand-logo"
          onClick={() => onScrollTo('hero')}
          aria-label="Return to Jiya Collections home"
        >
          <span className="brand-primary">{brandName}</span>
          <span className="brand-tagline">Lahore, Pakistan · Est. 2024</span>
        </button>

        {/* Primary Desktop Navigation Bar */}
        <nav className="desktop-primary-nav" aria-label="Primary Navigation">
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavCategoryClick('Women Stitched')}
          >
            Women Stitched
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavCategoryClick('Men Stitched')}
          >
            Men Stitched
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavCategoryClick('Women Unstitched')}
          >
            Unstitched Fabrics
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavCategoryClick('Festive Wear')}
          >
            Festive Wear
          </button>
          <button
            type="button"
            className="nav-link nav-highlight"
            onClick={() => onScrollTo('custom')}
          >
            Custom Stitching
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo('story')}
          >
            Our Story
          </button>
        </nav>

        {/* Header Right Utilities */}
        <div className="header-utilities">
          {/* Desktop Search Bar with Live Autocomplete Suggestions */}
          <div className="search-input-wrap desktop-search-wrap" ref={searchWrapRef}>
            <form className="header-search-form" onSubmit={handleSearchSubmit}>
              <button type="submit" className="search-submit-btn" aria-label="Submit search">
                ⌕
              </button>
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search shalwar kameez, boski, latha, kurtas, 3-piece..."
                aria-label="Search catalog"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    onClearSearch()
                    setIsFocused(false)
                  }}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isFocused && (
              <div className="search-dropdown-menu">
                {cleanQ.length === 0 ? (
                  <div className="search-trending-box">
                    <span className="search-dropdown-heading">Trending Searches</span>
                    <div className="search-trending-chips">
                      {TRENDING_SEARCHES.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="search-trend-chip"
                          onClick={() => handleSelectTrending(tag)}
                        >
                          <span className="trend-glyph">↗</span> {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : matchingProducts.length > 0 ? (
                  <div className="search-matches-box">
                    <div className="search-dropdown-heading-row">
                      <span className="search-dropdown-heading">
                        Matching Pieces ({matchingProducts.length})
                      </span>
                      <button
                        type="button"
                        className="see-all-results-link"
                        onClick={() => handleSearchSubmit()}
                      >
                        View in Shop →
                      </button>
                    </div>

                    <div className="search-results-list">
                      {matchingProducts.map((p) => (
                        <div
                          key={p.id}
                          className="search-result-item"
                          onClick={() => handleSelectProduct(p)}
                          role="button"
                          tabIndex={0}
                        >
                          <img src={p.image} alt={p.name} className="search-item-thumb" />
                          <div className="search-item-meta">
                            <strong className="search-item-title">{p.name}</strong>
                            <span className="search-item-cat">
                              {p.category} · {p.color}
                            </span>
                            <span className="search-item-price">{formatPrice(p.price)}</span>
                          </div>
                          <button className="search-item-view-btn" type="button">
                            View Size
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="search-footer-action-btn"
                      onClick={() => handleSearchSubmit()}
                    >
                      See all results for "{search}" in catalog →
                    </button>
                  </div>
                ) : (
                  <div className="search-empty-box">
                    <span className="search-empty-icon">⌕</span>
                    <p>No pieces found matching "<strong>{search}</strong>"</p>
                    <span className="search-empty-hint">Try searching for:</span>
                    <div className="search-trending-chips">
                      {TRENDING_SEARCHES.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="search-trend-chip"
                          onClick={() => handleSelectTrending(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Icon Trigger Button */}
          <button
            className={`util-btn search-mobile-btn ${mobileSearchOpen ? 'active' : ''}`}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search bar"
            title="Search Catalog"
          >
            <span className="util-icon">⌕</span>
            <span className="util-text">Search</span>
          </button>

          {/* Wishlist Button */}
          <button
            className="util-btn wishlist-util"
            onClick={() => onOpenModal('wishlist')}
            aria-label={`Saved pieces (${wishlistCount})`}
            title="Saved Wishlist"
          >
            <span className="util-icon">♡</span>
            <span className="util-text">Wishlist</span>
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </button>

          {/* Account Button (VIP Customer Dashboard) */}
          <button
            className="util-btn account-util"
            onClick={() => onOpenModal('account')}
            aria-label={isCustomerLoggedIn ? `Customer Account (${customerName})` : 'Sign In / Register'}
            title={isCustomerLoggedIn ? `Logged in as ${customerName}` : 'Sign In / Register'}
          >
            <span className="util-icon">👤</span>
            <span className="util-text">{isCustomerLoggedIn ? (customerName?.split(' ')[0] || 'Account') : 'Sign In'}</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            className="util-btn bag-util cart-util"
            onClick={() => onOpenModal('cart')}
            aria-label={`Shopping Cart (${cartCount} items)`}
            title="View Shopping Cart"
          >
            <span className="util-icon">🛒</span>
            <span className="util-text">Cart</span>
            <span className="badge-count bag-badge cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer (Appears when mobile hamburger is tapped) */}
      <nav className={`nav-menu mobile-drawer-menu ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-nav-header">
          <div className="mobile-nav-brand">
            <strong>{brandName}</strong>
            <span>Lahore Store & Studio</span>
          </div>
          <button
            className="modal-close-icon"
            onClick={onToggleMobileMenu}
            aria-label="Close mobile menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-section-title">Eastern Collections</div>
        <div className="mobile-nav-links-grid">
          <button className="mobile-cat-pill" onClick={() => handleNavCategoryClick('Women Stitched')}>
            <span>👗 Women Stitched (Pret)</span>
            <span className="cat-count-badge">7 Items</span>
          </button>
          <button className="mobile-cat-pill" onClick={() => handleNavCategoryClick('Men Stitched')}>
            <span>👔 Men Stitched (Shalwar Kameez)</span>
            <span className="cat-count-badge">7 Items</span>
          </button>
          <button className="mobile-cat-pill" onClick={() => handleNavCategoryClick('Women Unstitched')}>
            <span>🧵 Women Unstitched (3-Piece)</span>
            <span className="cat-count-badge">7 Items</span>
          </button>
          <button className="mobile-cat-pill" onClick={() => handleNavCategoryClick('Men Unstitched')}>
            <span>📦 Men Unstitched (Boski & Latha)</span>
            <span className="cat-count-badge">7 Items</span>
          </button>
          <button className="mobile-cat-pill" onClick={() => handleNavCategoryClick('Festive Wear')}>
            <span>👑 Festive Wear & Sherwanis</span>
            <span className="cat-count-badge">7 Items</span>
          </button>
        </div>

        <div className="mobile-nav-section-title">Customer Care & Services</div>
        <div className="mobile-nav-services">
          <button
            className="mobile-service-link"
            onClick={() => {
              onToggleMobileMenu()
              onScrollTo('custom')
            }}
          >
            ✂ Custom Stitching & Tailoring Consultation →
          </button>
          <button
            className="mobile-service-link"
            onClick={() => {
              onToggleMobileMenu()
              onOpenModal('size')
            }}
          >
            📏 Interactive Sizing & Fit Guide →
          </button>
          <button
            className="mobile-service-link"
            onClick={() => {
              onToggleMobileMenu()
              onOpenModal('account')
            }}
          >
            👤 {isCustomerLoggedIn ? `My Account (${customerName}) →` : 'Sign In / Register →'}
          </button>
          <button
            className="mobile-service-link"
            onClick={() => {
              onToggleMobileMenu()
              onOpenModal('contact')
            }}
          >
            📍 Flagship Studio: Gulberg III, Lahore →
          </button>
        </div>

        <div className="mobile-nav-footer">
          <span>💬 WhatsApp Helpline: +92 301 8472910</span>
          <span>✉ Support: care@jiyacollections.pk</span>
        </div>
      </nav>

      {/* 4. Mobile Search Strip (Appears when mobile search icon is tapped) */}
      {mobileSearchOpen && (
        <div className="mobile-search-strip">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <span className="search-icon">⌕</span>
            <input
              ref={mobileInputRef}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shalwar kameez, boski, latha, 3-piece..."
              aria-label="Search catalog on mobile"
            />
            {search ? (
              <button
                type="button"
                className="search-clear-btn"
                onClick={onClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
            <button
              type="button"
              className="mobile-search-close-btn"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close mobile search"
            >
              Cancel
            </button>
          </form>

          {/* Mobile Instant Match Quick List */}
          {cleanQ && matchingProducts.length > 0 && (
            <div className="mobile-search-results-dropdown">
              <span className="mobile-search-count">Found {matchingProducts.length} matching pieces:</span>
              {matchingProducts.map((p) => (
                <div
                  key={p.id}
                  className="mobile-search-item"
                  onClick={() => handleSelectProduct(p)}
                >
                  <img src={p.image} alt={p.name} />
                  <div className="mobile-item-info">
                    <strong>{p.name}</strong>
                    <span>{p.category} · {formatPrice(p.price)}</span>
                  </div>
                  <span className="arrow-glyph">→</span>
                </div>
              ))}
              <button
                type="button"
                className="mobile-view-all-btn"
                onClick={() => handleSearchSubmit()}
              >
                View all results in shop catalog →
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
