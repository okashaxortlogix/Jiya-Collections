import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Product } from '../../types'

interface Message {
  sender: 'assistant' | 'user'
  text: string
  productMatch?: Product
}

interface StylistAssistantProps {
  products: Product[]
  isOpen: boolean
  onToggle: () => void
  onAddToCart: (product: Product) => void
  onQuickView: (product: Product) => void
  formatPrice: (pkr: number) => string
}

export function StylistAssistant({
  products,
  isOpen,
  onToggle,
  onAddToCart,
  onQuickView,
  formatPrice,
}: StylistAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Salam! Welcome to Jiya Collections. I am your personal AI Stylist & Eastern Wardrobe Consultant. How may I assist you with your Pakistani attire today — Men’s Boski & Latha Shalwar Kameez, Women’s Stitched Pret, Luxury Unstitched 3-Piece Lawn, or Festive Sherwanis?',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim()
    if (!q) return

    setMessages((prev) => [...prev, { sender: 'user', text: q }])
    if (!textToSend) setInput('')

    setTimeout(() => {
      const lower = q.toLowerCase()
      let reply = ''
      let match: Product | undefined

      if (lower.includes('men') || lower.includes('male') || lower.includes('mardana') || lower.includes('kurta') || lower.includes('boski') || lower.includes('latha')) {
        reply = 'For Men, Jiya Collections features the iconic Shehroz Royal White Latha Shalwar Kameez, the Mughal 6-Pound Luxury Boski (Unstitched 4.5m box), and the Jahangir Jamawar Waistcoat. Both ready-to-wear and unstitched fabric cuts are ready to dispatch in Lahore.'
        match = products.find((p) => p.id === 8 || p.id === 22 || p.id === 10 || p.id === 9)
      } else if (lower.includes('unstitched') || lower.includes('3-piece') || lower.includes('lawn') || lower.includes('fabric')) {
        reply = 'Our unstitched range includes the Kashmir Rose Embroidered 3-Piece Lawn, Mehtab Luxury Chiffon Festive Suit, and Men’s 6-Pound Boski silk. You can also select "+Tailoring" to have our master-darzi stitch it to your custom measurements!'
        match = products.find((p) => p.id === 15 || p.id === 16 || p.id === 22)
      } else if (lower.includes('eid') || lower.includes('festive') || lower.includes('wedding') || lower.includes('sherwani') || lower.includes('peshwas')) {
        reply = 'For grand weddings and Eid festivities, Jiya Collections presents the Maharaja Royal Brocade Sherwani for men, the Soraya Handcrafted Zardozi Peshwas, and the Mahira Velvet Gharara with heavy marori embroidery.'
        match = products.find((p) => p.id === 29 || p.id === 30 || p.id === 31 || p.id === 32)
      } else if (lower.includes('stitched') || lower.includes('pret') || lower.includes('ready')) {
        reply = 'Our Ready-to-Wear (Pret) suits are tailored with generous margins from XS to XL. Check out the Noor Supima Lawn Shalwar Kameez or the Hamza Classic Navy Wash & Wear Suit.'
        match = products.find((p) => p.id === 1 || p.id === 11 || p.id === 2)
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('measurement') || lower.includes('rate') || lower.includes('price')) {
        reply = 'Standard sizes (XS–M) have zero surcharge. Sizes L & XL include +Rs. 450 / +Rs. 850 for extended fabric yardage. For unstitched suits, choosing "Custom (+Rs. 1,500)" adds full bespoke master tailoring.'
      } else {
        reply = `Jiya Collections offers ${products.length} authentic Pakistani cultural ensembles across Men’s & Women’s Stitched and Unstitched collections, with free delivery across Pakistan over Rs. 8,000.`
        match = products[0]
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          productMatch: match,
        },
      ])
    }, 500)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  return (
    <div className="floating-assistant-container">
      <button
        className={`assistant-trigger-pill ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label="Open Jiya AI Stylist"
      >
        <span className="sparkle-orbit">✨</span>
        <span className="concierge-btn-text">Jiya AI Stylist</span>
        <span className="assistant-dot" />
      </button>

      {isOpen && (
        <aside className="assistant-chat-panel" aria-label="Jiya Collections AI Stylist">
          <div className="chat-panel-header">
            <div className="stylist-badge">
              <div className="stylist-avatar">JC</div>
              <div>
                <strong>Jiya Collections · AI Stylist</strong>
                <span className="online-indicator">● Cultural Eastern Wear & Sizing Expert · Lahore</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={onToggle} aria-label="Close concierge">
              ✕
            </button>
          </div>

          <div className="chat-messages-scroll">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble-wrap ${msg.sender}`}>
                <div className="chat-bubble">
                  <p>{msg.text}</p>
                  {msg.productMatch && (
                    <div className="chat-product-card">
                      <img src={msg.productMatch.image} alt={msg.productMatch.name} />
                      <div className="chat-product-meta">
                        <strong>{msg.productMatch.name}</strong>
                        <span>{msg.productMatch.stitchType} · {formatPrice(msg.productMatch.price)}</span>
                        <div className="chat-card-actions">
                          <button
                            type="button"
                            className="chat-btn-add"
                            onClick={() => {
                              if (msg.productMatch) onAddToCart(msg.productMatch)
                            }}
                          >
                            + Add to Cart
                          </button>
                          <button
                            type="button"
                            className="chat-btn-view"
                            onClick={() => {
                              if (msg.productMatch) onQuickView(msg.productMatch)
                            }}
                          >
                            View Sizing
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="chat-quick-prompts">
            <button type="button" onClick={() => handleSend("Show Men's Shalwar Kameez & Boski")}>
              Men's Shalwar Kameez
            </button>
            <button type="button" onClick={() => handleSend("Women's Unstitched 3-Piece Lawn")}>
              Unstitched 3-Piece
            </button>
            <button type="button" onClick={() => handleSend('Festive Sherwani & Couture')}>
              Sherwani & Couture
            </button>
            <button type="button" onClick={() => handleSend('Find my size and tailoring rates')}>
              Size Rates & Tailoring
            </button>
          </div>

          {/* Chat Input */}
          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask concierge about fits, fabrics, sizing rates..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Ask Atelier Concierge"
            />
            <button type="submit" aria-label="Send message">
              Send ↗
            </button>
          </form>
        </aside>
      )}
    </div>
  )
}
