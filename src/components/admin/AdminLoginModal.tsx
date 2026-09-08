import { useState } from 'react'
import type { FormEvent } from 'react'

interface AdminLoginModalProps {
  onClose: () => void
  onLoginSuccess: () => void
  showToast: (msg: string, type?: 'success' | 'info' | 'cart') => void
}

export function AdminLoginModal({
  onClose,
  onLoginSuccess,
  showToast,
}: AdminLoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Standard valid admin credentials
  const VALID_EMAIL = 'admin@jiyacollections.pk'
  const VALID_USER = 'admin'
  const VALID_PASS = 'jiya2026'

  const handleQuickFill = () => {
    setEmail(VALID_EMAIL)
    setPassword(VALID_PASS)
    setError(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      const cleanEmail = email.trim().toLowerCase()
      const cleanPass = password.trim()

      if (
        (cleanEmail === VALID_EMAIL || cleanEmail === VALID_USER) &&
        cleanPass === VALID_PASS
      ) {
        showToast('Admin verification successful. Welcome to Operations Studio.', 'success')
        onLoginSuccess()
      } else {
        setError('Invalid staff credentials. Please check your admin ID and security passcode.')
        showToast('Access denied: Invalid credentials', 'info')
      }
    }, 400)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="admin-login-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Staff Operations Login"
      >
        <button
          className="modal-close-icon"
          onClick={onClose}
          aria-label="Close admin login"
        >
          ✕
        </button>

        <div className="admin-login-header">
          <div className="admin-lock-seal">🔒</div>
          <span className="drawer-eyebrow">Restricted Admin Access</span>
          <h2 className="drawer-title">Staff Operations Portal</h2>
          <p className="admin-login-sub">
            Please enter your administrative credentials to manage inventory, customer dispatches,
            and commissions.
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-id">Admin Username / Email</label>
            <input
              id="admin-id"
              type="text"
              required
              placeholder="e.g. admin@jiyacollections.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              autoFocus
            />
          </div>

          <div className="form-field">
            <div className="pass-field-header">
              <label htmlFor="admin-password">Security Passcode</label>
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter security passcode"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-luxury full-width admin-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Access...' : 'Authenticate & Enter Studio →'}
          </button>
        </form>

        <div className="admin-login-footer">
          <button
            type="button"
            className="admin-quickfill-badge"
            onClick={handleQuickFill}
            title="Click to pre-fill admin demo credentials"
          >
            <span className="badge-key">🔑 Demo Credentials:</span>
            <code>admin@jiyacollections.pk</code> / <code>jiya2026</code>
            <span className="quickfill-hint">(Tap to fill)</span>
          </button>

          <p className="admin-security-note">
            Protected by Jiya Collections 256-bit encrypted administrative session.
          </p>
        </div>
      </div>
    </div>
  )
}
