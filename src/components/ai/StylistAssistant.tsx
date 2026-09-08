import { useState, useRef, useEffect } from 'react'
import type { FormEvent } from 'react'
import type { Product } from '../../types'

interface Message {
  sender: 'assistant' | 'user'
  text: string
  productMatch?: Product
  isStreaming?: boolean
}

interface StylistAssistantProps {
  products: Product[]
  isOpen: boolean
  onToggle: () => void
  onAddToCart: (product: Product) => void
  onQuickView: (product: Product) => void
  formatPrice: (pkr: number) => string
  cartCount?: number
  onOpenCart?: () => void
}

export function StylistAssistant({
  products,
  isOpen,
  onToggle,
  onAddToCart,
  onQuickView,
  formatPrice,
  cartCount = 0,
  onOpenCart,
}: StylistAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Salam! Welcome to Jiya Collections. I am your personal AI Stylist & Eastern Wardrobe Consultant. How may I assist you with your Pakistani attire today — Men’s Boski & Latha Shalwar Kameez, Women’s Stitched Pret, Luxury Unstitched 3-Piece Lawn, or Festive Sherwanis?',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<number | null>(null)
  const thinkTimeoutRef = useRef<number | null>(null)

  // Auto-scroll when messages or typing state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
      if (thinkTimeoutRef.current) clearTimeout(thinkTimeoutRef.current)
    }
  }, [])

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim()
    if (!q || isTyping) return

    setMessages((prev) => [...prev, { sender: 'user', text: q }])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Clear any previous streaming/thinking timers
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    if (thinkTimeoutRef.current) {
      clearTimeout(thinkTimeoutRef.current)
      thinkTimeoutRef.current = null
    }

    thinkTimeoutRef.current = window.setTimeout(() => {
      const lower = q.toLowerCase()
      let reply = ''
      let match: Product | undefined

      // 1. GREETINGS & SALUTATIONS
      const isGreeting =
        /\b(hello|hi|hey|salam|assalam|assalamu|asalam|aoa|adaab|greetings|good morning|good afternoon|good evening|kese ho|kaise ho|kya haal|hal chal)\b/i.test(lower) ||
        lower === 'hello' || lower === 'hi' || lower === 'hey' || lower === 'salam' || lower === 'aoa' || lower === 'hy'

      // 2. THANKS & APPRECIATION
      const isThanks =
        /\b(thanks|thank you|shukriya|jazakallah|bohot shukriya|great|awesome|zabardast|nice|good|theek|ok|acha|shukriyaa)\b/i.test(lower)

      // 3. DISCOUNT & PROMO CODE
      const isDiscount =
        /\b(discount|coupon|coupons|promo|voucher|vouchers|code|promo code|coupon code|offer|sale|riayat|bachat|kam karo|concession)\b/i.test(lower)

      // 4. SHIPPING & DELIVERY
      const isDelivery =
        /\b(delivery|shipping|courier|trax|tcs|leopards|charges|kitne din|kab tak|dispatch|free delivery|postage)\b/i.test(lower)

      // 5. PAYMENT METHODS (Word boundaries prevent 'cod' matching 'code')
      const isPayment =
        /\b(payment|payments|pay|cod|cash on delivery|jazzcash|easypaisa|bank transfer|meezan|card|credit card|debit card|visa|mastercard|paisay)\b/i.test(lower)

      // 6. RETURN & EXCHANGE
      const isReturn =
        /\b(return|exchange|refund|wapsi|policy|kharab|size change|fault|badalna|change)\b/i.test(lower)

      // 7. LOCATION & STORE VISIT
      const isLocation =
        /\b(store|shop|location|address|kahan hai|lahore|gulberg|outlet|visit|studio)\b/i.test(lower)

      // 8. CONTACT & WHATSAPP
      const isContact =
        /\b(contact|phone|number|whatsapp|call|help|rabta|email|support|helpline)\b/i.test(lower)

      // 9. BESPOKE & MASTER TAILORING
      const isBespoke =
        /\b(bespoke|tailor|darzi|stitching|silaai|silai|custom size|stitch|stitching charges|darzi rate)\b/i.test(lower)

      // 10. SIZE & MEASUREMENTS
      const isSize =
        /\b(size|sizing|measurement|chart|fit|fitting|chhota|bara|large|small|medium|xl|xs|chest|waist)\b/i.test(lower)

      // 11. SPECIFIC FABRICS
      const isBoski = /\b(boski)\b/i.test(lower)
      const isLatha = /\b(latha)\b/i.test(lower)
      const isLawn = /\b(lawn)\b/i.test(lower)
      const isVelvet = /\b(velvet)\b/i.test(lower)
      const isChiffon = /\b(chiffon)\b/i.test(lower)
      const isSilk = /\b(silk|raw silk|jamawar)\b/i.test(lower)
      const isKarandi = /\b(karandi|khaddar)\b/i.test(lower)

      // 12. MEN / WOMEN
      const isMen = /\b(men|mens|male|mardana|boy|larka|gent|gents|sherwani|kurta)\b/i.test(lower)
      const isWomen = /\b(women|womens|female|zenana|ladies|girl|larki|pret|frock|kurti|gharara|peshwas)\b/i.test(lower)

      // 13. FESTIVE / EID
      const isFestive = /\b(eid|festive|wedding|shaadi|party|barat|valima|mehndi|formal)\b/i.test(lower)

      // 14. BUDGET & PRICE
      const isBudget = /\b(budget|cheap|sasta|affordable|price|under 5000|under 7000|under 10000|kam qeemat)\b/i.test(lower)

      // Check for direct product name match
      const directMatch = products.find((p) => {
        const pName = p.name.toLowerCase()
        const pTokens = pName.split(' ').filter((w) => w.length > 3)
        return lower.includes(pName) || pTokens.some((t) => lower.includes(t))
      })

      if (isGreeting) {
        reply =
          'Walaikum Assalam! Hello & welcome to Jiya Collections. Main aapki personal AI Stylist & Shopping Assistant hoon. Main aapko perfect Pakistani jora muntakhib karne, size aur fitting guide karne, ya custom stitching mein madad kar sakti hoon. Aaj aap kis tarah ka outfit talash kar rahay hain?'
      } else if (isThanks) {
        reply =
          'Aap ka bohot shukriya! Agar aapko mazeed kisi collection, fabric detail, ya order placement mein help chahiye ho, tou zaroor batayein. Jiya Collections mein shopping ka lutf uthaiye!'
      } else if (isDelivery) {
        reply =
          'Delivery Policy: Jiya Collections poore Pakistan mein 2–4 working days ke andar insured doorstep delivery provide karta hai. Rs. 8,000 se zayed ke tamam orders par FREE DELIVERY hai (standard delivery fee sirf Rs. 250 hai). Courier partners: Trax & Leopards.'
      } else if (isPayment) {
        reply =
          'Payment Methods: Aap 4 aasan tareeqon se payment kar saktay hain: 1) Cash on Delivery (COD) poore Pakistan mein, 2) JazzCash / EasyPaisa Mobile Wallet, 3) Direct Bank Transfer (Meezan Bank IBFT), aur 4) Visa / Mastercard Debit & Credit Cards (Stripe 256-Bit SSL encrypted).'
      } else if (isReturn) {
        reply =
          'Exchange & Return: Hum 3-Day Doorstep Exchange policy offer kartay hain. Agar size ka masla ho ya fitting adjust karwani ho, tou hamari support team 48 ghanton ke andar exchange courier arrange kar deti hai. WhatsApp: +92 301 8472910.'
      } else if (isDiscount) {
        reply =
          "Exclusive Discount: Aap hamara Eid special promo code 'EID2026' use kar saktay hain jis se aapko instant 15% OFF milay ga! Yeh code checkout page ya cart drawer mein apply karein."
      } else if (isLocation) {
        reply =
          'Hamara Flagship Studio Lahore mein waqay hai: 📍 24-C Main Boulevard, Gulberg III, Lahore. Studio Timings: Peer ta Hafta (Mon–Sat) 11:00 AM – 9:00 PM PKT. Fitting consultation ke liye aap studio visit kar saktay hain.'
      } else if (isContact) {
        reply =
          'Customer Support: Aap hamari Lahore team se direct rabta kar saktay hain: 📱 WhatsApp & Helpline: +92 301 8472910 | ✉ Email: care@jiyacollections.pk. Hum Monday se Saturday 11 AM – 9 PM active hotay hain.'
      } else if (isBespoke) {
        reply =
          "Custom Stitching & Tailoring: Hamare Lahore flagship studio mein master darzi custom stitching kartay hain. Unstitched fabric ke sath 'Custom Size' select karein ya Custom Stitching form fill karein."
        match = products.find((p) => p.name.includes('Boski') || p.id === 22 || p.category.includes('Unstitched'))
      } else if (isSize) {
        reply =
          'Sizing & Fit: Hamare Pret pieces standard sizes (XS, S, M, L, XL) mein available hain jin mein generous 2-inch side margins hotay hain. Standard sizes (XS–M) par zero surcharge hai, jabke L (+Rs. 450) aur XL (+Rs. 850) fabric yardage ke mutabiq adjust hotay hain. Unstitched suits par bespoke darzi stitching Rs. 1,500 mein available hai.'
      } else if (isBoski) {
        reply =
          'Mughal 6-Pound Luxury Boski: Yeh 100% authentic Chinese spun silk se tayar karda 4.5 meters unstitched box pack hai. Classic cream sheen aur breathable texture ke sath formal gatherings ke liye behtareen hai.'
        match = products.find((p) => p.name.toLowerCase().includes('boski') || p.fabric.toLowerCase().includes('boski'))
      } else if (isLatha) {
        reply =
          'Shehroz Royal White Latha: 100% Egyptian Giza Cotton se tayar karda luxury white shalwar kameez. Crisp starch finish, pure white tone, aur generational darzi stitching ke sath ready-to-wear.'
        match = products.find((p) => p.name.toLowerCase().includes('latha') || p.fabric.toLowerCase().includes('latha'))
      } else if (isVelvet) {
        reply =
          'Luxury Velvet Ensembles: Hamari Velvet collection mein Mahira Handcrafted Velvet Gharara aur embroidered velvet pret shawls shamil hain jo winter weddings aur festive occasions ke liye royal look deti hain.'
        match = products.find((p) => p.fabric.toLowerCase().includes('velvet') || p.id === 31)
      } else if (isLawn) {
        reply =
          'Premium Supima Lawn: Hamari Supima Lawn collection pure breathable natural fibres par tayar ki gayi hai. Check out the Noor Supima Lawn Stitched Shalwar Kameez aur Kashmir Rose 3-Piece unstitched suite.'
        match = products.find((p) => p.name.toLowerCase().includes('lawn') || p.fabric.toLowerCase().includes('lawn'))
      } else if (isChiffon) {
        reply =
          'Mehtab Luxury Chiffon: Hamari Chiffon line mein intricate zardozi, gota, aur thread work ensembles dastiyab hain jo semi-formal aur wedding celebrations ke liye graceful drape deti hain.'
        match = products.find((p) => p.fabric.toLowerCase().includes('chiffon') || p.id === 16)
      } else if (isSilk) {
        reply =
          'Pure Silk & Raw Silk: Hamari Silk collection mein pure Banarsi Raw Silk aur Chinese Spun Silk pieces dastiyab hain. Classic rich texture aur sheen formal wear ke liye zabardast choice hai.'
        match = products.find((p) => p.fabric.toLowerCase().includes('silk') || p.id === 22)
      } else if (isKarandi) {
        reply =
          'Handloom Karandi & Khaddar: Natural textured yarns se buni gayi yeh collection transitional aur festive modest wear ke liye timeless elegance provide karti hai.'
        match = products.find((p) => p.fabric.toLowerCase().includes('karandi') || p.fabric.toLowerCase().includes('khaddar') || p.id === 17)
      } else if (isFestive) {
        reply =
          'Eid & Festive Wear: Jiya Collections mein Maharaja Royal Brocade Sherwani, Soraya Zardozi Peshwas, aur Mahira Velvet Gharara jese luxury outfits dastiyab hain jo grand weddings aur Eid ke liye ideal hain.'
        match = products.find((p) => p.category === 'Festive Wear') || products[0]
      } else if (isMen) {
        reply =
          "Men's Eastern Collection: Hamare paas Men's Stitched Shalwar Kameez (Wash & Wear, Latha, Cotton) aur Unstitched Luxury Boski mojood hain. Har piece dignified cuts aur supreme comfort ke sath tayar kiya gaya hai."
        match = products.find((p) => p.gender === 'Men')
      } else if (isWomen) {
        reply =
          "Women's Collection: Hamare paas Supima Lawn Pret Suits, Embroidered 3-Piece Unstitched Lawn, Organza Luxury Pret, aur Velvet Ghararas mojood hain. Modest silhouettes aur intricate hand-embroidery hamara signature hain."
        match = products.find((p) => p.gender === 'Women')
      } else if (directMatch) {
        reply = `${directMatch.name}: Yeh piece ${directMatch.fabric} fabric se tayar kiya gaya hai (${directMatch.stitchType}). Price: ${formatPrice(directMatch.price)}. Aap isay direct cart mein add kar saktay hain ya sizing check kar saktay hain.`
        match = directMatch
      } else if (isBudget) {
        const budgetPiece = products.filter((p) => p.price < 8000).sort((a, b) => a.price - b.price)[0]
        reply = `Budget-Friendly Luxury: Hamare paas bohot se premium pieces affordable prices mein dastiyab hain starting from Rs. 4,500. For example, ${budgetPiece ? budgetPiece.name : 'our Pret pieces'} offer exceptional cultural craftsmanship at great value.`
        match = budgetPiece || products[0]
      } else {
        reply = `Aap ne "${q}" ke baray mein daryaft kiya hai. Jiya Collections authentic Pakistani Eastern attire (Men’s & Women’s Pret, Luxury Unstitched Fabrics, Boski, Latha) aur Bespoke Master Tailoring offer karta hai. Aap Men's collection, Women's suits, ya delivery & sizing rates ke baray mein mazeed kya janna chahtay hain?`
        match = products[0]
      }

      // Word-by-word streaming generation
      const words = reply.split(' ')

      // Add initial assistant bubble with empty text & isStreaming
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: '',
          isStreaming: true,
        },
      ])

      let wordIndex = 0
      streamIntervalRef.current = window.setInterval(() => {
        wordIndex++
        if (wordIndex <= words.length) {
          const currentChunk = words.slice(0, wordIndex).join(' ')
          setMessages((prev) => {
            const next = [...prev]
            const lastIdx = next.length - 1
            if (lastIdx >= 0 && next[lastIdx].sender === 'assistant') {
              next[lastIdx] = {
                ...next[lastIdx],
                text: currentChunk,
                isStreaming: wordIndex < words.length,
              }
            }
            return next
          })
        } else {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current)
            streamIntervalRef.current = null
          }
          // Streaming completed! Attach productMatch and mark finished
          setMessages((prev) => {
            const next = [...prev]
            const lastIdx = next.length - 1
            if (lastIdx >= 0 && next[lastIdx].sender === 'assistant') {
              next[lastIdx] = {
                ...next[lastIdx],
                text: reply,
                productMatch: match,
                isStreaming: false,
              }
            }
            return next
          })
          setIsTyping(false)
        }
      }, 30) // 30ms per word: ultra-smooth, responsive typewriter flow
    }, 350)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  return (
    <div className="floating-assistant-container">
      {/* Floating Cart Button stacked directly above AI Stylist */}
      {onOpenCart && (
        <button
          type="button"
          className="floating-cart-pill"
          onClick={onOpenCart}
          aria-label={`View Shopping Cart (${cartCount} items)`}
          title="Open Shopping Cart"
        >
          <span className="fc-icon">🛒</span>
          <span className="fc-label">Cart</span>
          {cartCount > 0 && <span className="fc-badge">{cartCount}</span>}
        </button>
      )}

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
                  <p>
                    {msg.text}
                    {msg.isStreaming && <span className="ai-typing-cursor">▌</span>}
                  </p>
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

            {/* Thinking indicator before first word starts streaming */}
            {isTyping && messages[messages.length - 1]?.sender === 'user' && (
              <div className="chat-bubble-wrap assistant">
                <div className="chat-bubble typing-bubble" aria-label="AI Stylist is thinking...">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="chat-quick-prompts">
            <button
              type="button"
              disabled={isTyping}
              onClick={() => handleSend("Show Men's Shalwar Kameez & Boski")}
            >
              Men's Shalwar Kameez
            </button>
            <button
              type="button"
              disabled={isTyping}
              onClick={() => handleSend("Women's Unstitched 3-Piece Lawn")}
            >
              Unstitched 3-Piece
            </button>
            <button
              type="button"
              disabled={isTyping}
              onClick={() => handleSend('Festive Sherwani & Party Wear')}
            >
              Sherwani & Festive Wear
            </button>
            <button
              type="button"
              disabled={isTyping}
              onClick={() => handleSend('Find my size and tailoring rates')}
            >
              Size Rates & Tailoring
            </button>
          </div>

          {/* Chat Input */}
          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={isTyping ? 'AI Stylist is composing answer...' : 'Ask our assistant about outfits, fabrics, sizing...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              aria-label="Ask AI Stylist"
            />
            <button type="submit" aria-label="Send message" disabled={isTyping || !input.trim()}>
              {isTyping ? '···' : 'Send ↗'}
            </button>
          </form>
        </aside>
      )}
    </div>
  )
}
