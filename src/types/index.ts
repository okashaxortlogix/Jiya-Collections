export type ProductCategory =
  | 'Women Stitched'
  | 'Women Unstitched'
  | 'Men Stitched'
  | 'Men Unstitched'
  | 'Festive Wear'

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom'

export type Product = {
  id: number
  name: string
  category: ProductCategory
  gender: 'Women' | 'Men' | 'Unisex'
  stitchType: 'Stitched' | 'Unstitched'
  pieces?: string
  price: number
  oldPrice?: number
  color: string
  fabric: string
  stock: number
  image: string
  tag?: string
  rating: number
  reviewsCount: number
  description?: string
}

export type CartItem = {
  product: Product
  quantity: number
  size: SizeOption
  unitPrice: number
}

export type OrderStatus = 'Confirmed' | 'In Stitching' | 'Dispatched' | 'Delivered'

export type Order = {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  status: OrderStatus
  trackingCode?: string
  estimatedDelivery?: string
  customer: {
    name: string
    email?: string
    phone: string
    city: string
    address: string
    notes?: string
    paymentMethod: string
    transactionId?: string
    senderAccount?: string
  }
}

export type Address = {
  id: number
  name: string
  phone: string
  city: string
  address: string
  isDefault: boolean
}

export type BespokeRequest = {
  id: string
  date: string
  fabric: string
  silhouette: string
  colorPreference: string
  bust: string
  waist: string
  hip: string
  length: string
  budget: string
  eventDate: string
  notes: string
  status: 'Pattern Drafting' | 'Embroidery in Progress' | 'Final Trial' | 'Completed'
}

export type Currency = 'PKR' | 'USD' | 'AED' | 'GBP'

export type CurrencyInfo = {
  symbol: string
  rate: number
  prefix: boolean
}

export type Toast = {
  id: number
  message: string
  type?: 'success' | 'info' | 'cart'
}

export type HeroSlide = {
  id: number
  eyebrow: string
  title: string
  subtitle: string
  tag: string
  image: string
}

export type PromoCode = {
  code: string
  discount: number
  active: boolean
}

export type UserProfile = {
  name: string
  email: string
  phone: string
  city: string
  avatarInitial: string
  tier: string
  points: number
  walletBalance: number
  memberSince: string
}

export type SizingProfile = {
  bust: string
  waist: string
  hip: string
  shoulder: string
  kurtaLength: string
  sleeveLength: string
  height: string
  preferredEase: 'Modest Relaxed' | 'Tailored Contemporary' | 'Structured Standard'
}

export type ModalType =
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'account'
  | 'custom'
  | 'filter'
  | 'product'
  | 'policy'
  | 'size'
  | 'contact'
  | 'admin'
  | null
