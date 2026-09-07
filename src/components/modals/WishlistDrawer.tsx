import type { Product } from '../../types'

interface WishlistDrawerProps {
  wishlist: number[]
  products: Product[]
  onClose: () => void
  onToggleWishlist: (id: number) => void
  onMoveToBag: (product: Product) => void
  onMoveAllToBag: () => void
  onExploreShop: () => void
  formatPrice: (pkr: number) => string
}

export function WishlistDrawer({
  wishlist,
  products,
  onClose,
  onToggleWishlist,
  onMoveToBag,
  onMoveAllToBag,
  onExploreShop,
  formatPrice,
}: WishlistDrawerProps) {
  const savedProducts = products.filter((p) => wishlist.includes(p.id))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="drawer-panel wishlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="drawer-eyebrow">Saved Pieces</span>
            <h2 className="drawer-title">Your Wishlist ({wishlist.length})</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close wishlist">
            ✕
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="drawer-empty-view">
            <span className="empty-cart-glyph">♡</span>
            <h3>Your wishlist is empty</h3>
            <p>Click the heart icon on any design to save it for later review.</p>
            <button className="btn-primary-luxury" onClick={onExploreShop}>
              Discover Collections
            </button>
          </div>
        ) : (
          <div className="cart-items-scroll">
            {savedProducts.map((product) => (
              <div key={product.id} className="cart-line-item wishlist-item">
                <img src={product.image} alt={product.name} className="cart-item-thumb" />
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <h4>{product.name}</h4>
                    <button
                      className="cart-remove-btn"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      ✕
                    </button>
                  </div>
                  <span className="cart-item-meta">{product.category} · {product.color}</span>
                  <strong className="cart-item-price">{formatPrice(product.price)}</strong>

                  <button
                    className="btn-move-to-cart"
                    onClick={() => onMoveToBag(product)}
                  >
                    Move to Cart (M) →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="drawer-footer">
            <button className="btn-primary-luxury full-width" onClick={onMoveAllToBag}>
              Move All Pieces to Cart
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
