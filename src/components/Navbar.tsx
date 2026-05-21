import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconDownload, IconEye, IconLockOpen, IconMessage, IconStar } from '@tabler/icons-react'
import { useTheme } from '../themes/ThemeContext'
import { useReveal } from '../hooks/useReveal'
import { useDownload } from '../hooks/useDownload'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { isRevealed, openModal, lock } = useReveal()
  const { handler } = useDownload()
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/consultants/')
  const [downloading, setDownloading] = useState(false)

  const onDownload = async () => {
    if (!handler) return
    setDownloading(true)
    try {
      await handler()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b backdrop-blur"
      style={{
        background: 'rgba(255,255,255,0.92)',
        borderColor: 'rgba(0,0,0,0.08)',
      }}
    >
      <Link to="/" className="flex items-center gap-3 no-underline">
        {theme === 'truffle' ? (
          <img src="/truffle-logo-dark.png" alt="Truffle" style={{ height: 30, width: 'auto' }} />
        ) : (
          <img src="/wwps-logo.png" alt="WWPS" style={{ height: 34, width: 'auto' }} />
        )}
        <span className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
          {theme === 'truffle' ? 'Consultants' : 'Talent Portal'}
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 p-0.5 rounded-md text-xs font-medium"
          style={{ background: '#E5E7EB' }}
          role="tablist"
          aria-label="Theme"
        >
          <button
            type="button"
            onClick={() => setTheme('truffle')}
            className="px-2.5 py-1 rounded transition"
            style={{
              background: theme === 'truffle' ? '#fff' : 'transparent',
              color: theme === 'truffle' ? '#131A30' : '#4B5563',
              boxShadow: theme === 'truffle' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Truffle
          </button>
          <button
            type="button"
            onClick={() => setTheme('wwps')}
            className="px-2.5 py-1 rounded transition"
            style={{
              background: theme === 'wwps' ? '#fff' : 'transparent',
              color: theme === 'wwps' ? '#131A30' : '#4B5563',
              boxShadow: theme === 'wwps' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            WWPS
          </button>
        </div>

        {isDetail && (
          <>
            <NavBtn icon={<IconStar size={14} />} label="Shortlist" />
            <NavBtn icon={<IconMessage size={14} />} label="Comment" />
            {isRevealed ? (
              <NavBtn icon={<IconLockOpen size={14} />} label="Re-seal" onClick={lock} accent />
            ) : (
              <NavBtn icon={<IconEye size={14} />} label="Reveal" onClick={openModal} />
            )}
            <NavBtn
              icon={<IconDownload size={14} />}
              label={downloading ? 'Preparing...' : 'Download .docx'}
              onClick={onDownload}
              primary
              disabled={!handler || downloading}
            />
          </>
        )}
      </div>
    </header>
  )
}

function NavBtn({
  icon,
  label,
  onClick,
  primary,
  accent,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  primary?: boolean
  accent?: boolean
  disabled?: boolean
}) {
  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'var(--brand-gradient)' }}
      >
        {icon}
        {label}
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80 disabled:opacity-50"
      style={{
        color: accent ? 'var(--brand-accent-strong)' : 'var(--brand-text)',
        borderColor: accent ? 'var(--brand-accent-strong)' : 'rgba(0,0,0,0.15)',
        background: 'transparent',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
