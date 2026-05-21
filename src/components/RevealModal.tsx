import { useEffect, useState } from 'react'
import { IconLock, IconX } from '@tabler/icons-react'
import { useReveal } from '../hooks/useReveal'

export default function RevealModal() {
  const { showModal, closeModal, submitPassword } = useReveal()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!showModal) {
      setValue('')
      setError(null)
    }
  }, [showModal])

  if (!showModal) return null

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = submitPassword(value)
    if (!ok) setError('Incorrect password. Try again.')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-brand-bg p-6 shadow-2xl"
        style={{ background: 'var(--brand-bg)' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-full"
              style={{ background: 'var(--brand-gradient)', color: '#fff' }}
            >
              <IconLock size={18} />
            </span>
            <h2 id="reveal-title" className="text-lg font-medium" style={{ color: 'var(--brand-text)' }}>
              Reveal contact details
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="text-brand-text-muted hover:opacity-70 transition"
          >
            <IconX size={20} />
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--brand-text-muted)' }}>
          Enter the client access password to unmask surname, email, phone, LinkedIn, permit number, and reference contacts for this session (~30 min).
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            autoFocus
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Client access password"
            className="w-full px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 transition"
            style={{
              background: 'var(--brand-bg-soft)',
              borderColor: error ? '#EF4444' : 'rgba(0,0,0,0.12)',
              borderRadius: '6px',
              color: 'var(--brand-text)',
            }}
          />
          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium rounded-full border transition hover:opacity-80"
              style={{
                color: 'var(--brand-text)',
                borderColor: 'rgba(0,0,0,0.15)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white rounded-full transition hover:opacity-90"
              style={{ background: 'var(--brand-gradient)' }}
            >
              Unlock
            </button>
          </div>
        </form>
        <p className="text-xs mt-4" style={{ color: 'var(--brand-text-muted)', opacity: 0.7 }}>
          Prototype password: <code>WWPS2026</code> — in production this is per-client, set by admin, stored hashed in Supabase.
        </p>
      </div>
    </div>
  )
}
