import type { ReactNode } from 'react'
import { IconLock } from '@tabler/icons-react'
import { useReveal } from '../hooks/useReveal'

interface MaskedChipProps {
  icon: ReactNode
  value: string
  maskPattern: string
  onHero?: boolean
}

export default function MaskedChip({ icon, value, maskPattern, onHero }: MaskedChipProps) {
  const { isRevealed, openModal } = useReveal()

  const heroChipStyle = onHero
    ? {
        background: isRevealed ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.22)',
        color: isRevealed ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)',
        border: '0.5px solid rgba(255,255,255,0.14)',
      }
    : {
        background: 'var(--brand-bg-soft)',
        color: 'var(--brand-text-muted)',
        border: '0.5px solid rgba(0,0,0,0.06)',
      }

  return (
    <button
      type="button"
      onClick={isRevealed ? undefined : openModal}
      title={isRevealed ? value : 'Click to reveal'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition hover:opacity-90 disabled:cursor-default"
      disabled={isRevealed}
      style={heroChipStyle}
    >
      <span className="inline-flex items-center" style={{ color: onHero ? 'var(--brand-pink)' : 'var(--brand-accent)' }}>
        {isRevealed ? icon : <IconLock size={12} />}
      </span>
      {isRevealed ? (
        <span>{value}</span>
      ) : (
        <span className="masked-blob">{maskPattern}</span>
      )}
    </button>
  )
}
