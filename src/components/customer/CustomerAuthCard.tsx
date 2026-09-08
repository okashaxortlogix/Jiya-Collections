import { useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types'
import { initialUserProfile } from '../../data/initialData'

interface CustomerAuthCardProps {
  onLoginSuccess: (user: UserProfile) => void
  showToast: (msg: string, type?: 'success' | 'info' | 'cart') => void
  onBackToStore?: () => void
}

export function CustomerAuthCard({
  onLoginSuccess,
  showToast,
  onBackToStore,
}: CustomerAuthCardProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin')

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Register State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lahore',
    password: '',
  })

  // Quick Demo Login Handler
  const handleQuickDemoLogin = () => {
    onLoginSuccess(initialUserProfile)
    showToast(`Welcome back, ${initialUserProfile.name}!`, 'success')
  }

  const handleSignInSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!signInIdentifier.trim()) {
      showToast('Please enter your mobile number or email address', 'info')
      return
    }

    // Determine user name from identifier or fallback
    const trimmedId = signInIdentifier.trim()
    let loggedUser: UserProfile = { ...initialUserProfile }

    if (trimmedId.includes('@')) {
      const extractedName = trimmedId.split('@')[0]
      const capitalized = extractedName.charAt(0).toUpperCase() + extractedName.slice(1)
      loggedUser = {
        ...initialUserProfile,
        name: capitalized,
        email: trimmedId,
        avatarInitial: capitalized.charAt(0),
      }
    } else {
      loggedUser = {
        ...initialUserProfile,
        phone: trimmedId,
      }
    }

    onLoginSuccess(loggedUser)
    showToast(`Signed in successfully as ${loggedUser.name}!`, 'success')
  }

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!regForm.name.trim() || !regForm.phone.trim() || !regForm.email.trim()) {
      showToast('Please fill all required profile fields', 'info')
      return
    }

    const trimmedName = regForm.name.trim()
    const newUser: UserProfile = {
      name: trimmedName,
      email: regForm.email.trim(),
      phone: regForm.phone.trim(),
      city: regForm.city,
      avatarInitial: trimmedName.charAt(0).toUpperCase() || 'J',
      tier: 'Silver VIP Member',
      points: 500, // 500 Welcome bonus coins
      walletBalance: 500, // Rs. 500 welcome credit
      memberSince: 'September 2026',
    }

    onLoginSuccess(newUser)
    showToast(`Welcome to Jiya Collections, ${trimmedName}! Rs. 500 welcome credit added.`, 'success')
  }

  return (
    <div className="customer-auth-container">
      <div className="customer-auth-card">
        {/* Brand Header */}
        <div className="auth-brand-badge">
          <span className="auth-seal">👑</span>
          <span className="auth-brand-name">JIYA COLLECTIONS</span>
          <span className="auth-brand-sub">Client Portal & VIP Lounge</span>
        </div>

        <h2 className="auth-card-title">
          {authMode === 'signin' ? 'Sign In to Your Account' : 'Create VIP Client Account'}
        </h2>
        <p className="auth-card-sub">
          {authMode === 'signin'
            ? 'Access your saved sizing profiles, live Trax tracking, and reward points.'
            : 'Join Jiya Collections to enjoy doorstep exchange, custom stitching, and exclusive Eid discounts.'}
        </p>

        {/* Tab Switcher */}
        <div className="auth-tabs-header">
          <button
            type="button"
            className={`auth-tab-pill ${authMode === 'signin' ? 'active' : ''}`}
            onClick={() => setAuthMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-pill ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Sign In View */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="auth-form-body">
            <div className="auth-field">
              <label>Mobile Number or Email *</label>
              <input
                type="text"
                required
                placeholder="e.g. 0301 8472910 or ayesha@gmail.com"
                value={signInIdentifier}
                onChange={(e) => setSignInIdentifier(e.target.value)}
                className="luxury-input"
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label>Password or SMS Passcode *</label>
                <button
                  type="button"
                  className="auth-show-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="luxury-input"
              />
            </div>

            <button type="submit" className="btn-primary-luxury auth-submit-btn">
              Sign In to Account →
            </button>

            {/* Quick Demo Login Option for instant testing */}
            <div className="demo-login-divider">
              <span>OR TEST INSTANTLY</span>
            </div>

            <button
              type="button"
              className="btn-demo-quick-login"
              onClick={handleQuickDemoLogin}
            >
              ⚡ Quick Demo Login as Hira Ahmed (VIP Member)
            </button>
          </form>
        )}

        {/* Register View */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form-body">
            <div className="auth-field">
              <label>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fatima Ali"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                className="luxury-input"
              />
            </div>

            <div className="form-grid-2" style={{ marginBottom: 0 }}>
              <div className="auth-field">
                <label>Mobile Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0300 1234567"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="luxury-input"
                />
              </div>

              <div className="auth-field">
                <label>City *</label>
                <select
                  value={regForm.city}
                  onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                  className="luxury-select"
                >
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Faisalabad</option>
                  <option>Multan</option>
                  <option>Peshawar</option>
                  <option>Quetta</option>
                  <option>Sialkot</option>
                  <option>Gujranwala</option>
                  <option>Other City</option>
                </select>
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. fatima@gmail.com"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                className="luxury-input"
              />
            </div>

            <div className="auth-field">
              <label>Create Password *</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="luxury-input"
              />
            </div>

            <button type="submit" className="btn-primary-luxury auth-submit-btn">
              Create VIP Account & Claim Rs. 500 Credit →
            </button>
          </form>
        )}

        {/* VIP Perks Bar */}
        <div className="auth-perks-strip">
          <div className="auth-perk-item">
            <span>🚚</span>
            <div>
              <strong>Live Trax Tracking</strong>
              <small>SMS & WhatsApp real-time updates</small>
            </div>
          </div>
          <div className="auth-perk-item">
            <span>✂</span>
            <div>
              <strong>Custom Tailoring</strong>
              <small>Saved body measurements profile</small>
            </div>
          </div>
          <div className="auth-perk-item">
            <span>🪙</span>
            <div>
              <strong>Reward Points</strong>
              <small>Redeem coins for cash discounts</small>
            </div>
          </div>
        </div>

        {onBackToStore && (
          <button type="button" className="auth-back-store-btn" onClick={onBackToStore}>
            ← Return to Store Catalog
          </button>
        )}
      </div>
    </div>
  )
}
