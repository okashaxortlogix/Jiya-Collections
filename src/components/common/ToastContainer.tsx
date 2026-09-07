import type { Toast } from '../../types'

interface ToastContainerProps {
  toasts: Toast[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type || 'info'}`}>
          <span className="toast-dot" />
          <span className="toast-text">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
