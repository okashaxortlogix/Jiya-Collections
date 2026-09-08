import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  isSaved: boolean
  formattedPrice: string
  formattedOldPrice?: string
  onToggleWishlist: (id: number) => void
  onQuickView: (product: Product) => void
  onQuickAdd: (product: Product) => void
}

export function ProductCard({
  product,
  isSaved,
  formattedPrice,
  formattedOldPrice,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}: ProductCardProps) {
  return (
    <article className="luxury-product-card">
      <div className="card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        <div className="card-badges-wrapper">
          {product.tag && <span className="product-badge">{product.tag}</span>}
          <span className={`product-badge-stitch ${product.stitchType === 'Stitched' ? 'stitched' : 'unstitched'}`}>
            {product.stitchType}
          </span>
          {product.pieces && (
            <span className="product-badge-pieces">{product.pieces}</span>
          )}
        </div>

        <button
          className={`wishlist-heart-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product.id)
          }}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          {isSaved ? '♥' : '♡'}
        </button>

        <div className="card-overlay-actions">
          <button
            className="quick-view-btn"
            onClick={() => onQuickView(product)}
            aria-label={`Quick look at ${product.name}`}
          >
            Quick Look & Sizing
          </button>
          <button
            className="quick-add-btn"
            onClick={(e) => {
              e.stopPropagation()
              onQuickAdd(product)
            }}
            aria-label={`Quick add ${product.name} to cart`}
          >
            <span>{product.stitchType === 'Unstitched' ? '+ Quick Add (Fabric Box)' : '+ Quick Add (M)'}</span>
          </button>
        </div>
      </div>

      <div className="card-info" onClick={() => onQuickView(product)}>
        <div className="card-category-row">
          <div className="card-cat-wrap">
            <span className="card-category">{product.category}</span>
            <span className="card-gender-pill">{product.gender}</span>
          </div>
          <div className="card-rating">
            <span className="star-glyph">★</span>
            <span>{product.rating}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-fabric">
          {product.fabric} · {product.color}
        </p>

        <div className="card-footer">
          <div className="card-pricing">
            {formattedOldPrice && (
              <span className="old-price">{formattedOldPrice}</span>
            )}
            <div className="price-stack">
              <span className="from-prefix">From</span>
              <strong className="current-price">{formattedPrice}</strong>
            </div>
          </div>

          <span
            className={`stock-status ${
              product.stock <= 4 ? 'low-stock' : 'in-stock'
            }`}
          >
            {product.stock <= 4 ? `Only ${product.stock} left` : 'Ready to ship'}
          </span>
        </div>

        <div className="card-size-hint">
          {product.stitchType === 'Unstitched' ? (
            <span>✂ Unstitched Fabric Cut · Custom Tailoring Available</span>
          ) : (
            <span>✦ Ready to Wear · Sizes XS – XL & Custom Fit</span>
          )}
        </div>
      </div>
    </article>
  )
}
