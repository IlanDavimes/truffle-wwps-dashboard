import { Link } from 'react-router-dom'
import { IconArrowRight, IconCircleDot, IconClock } from '@tabler/icons-react'
import { consultants } from '../data/consultants'
import { useReveal } from '../hooks/useReveal'

export default function DirectoryPage() {
  const { isRevealed } = useReveal()

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-medium tracking-tight mb-2"
          style={{ color: 'var(--brand-text)' }}
        >
          Consultant directory
        </h1>
        <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
          Prototype seed — two profiles. Sidumisile is a fully-populated <em>active</em> consultant. The Template is the empty-state preview used when creating new profiles.
        </p>
      </div>

      <div className="space-y-2">
        {consultants.map((c) => {
          const initials = c.firstName
            .split(' ')
            .map((s) => s[0])
            .join('')
            .replace(/[^A-Za-z]/g, '')
            .substring(0, 2)
            .toUpperCase()
          const isTemplate = c.status === 'draft'
          const displayName = isTemplate
            ? `${c.firstName} ${c.surname}`
            : isRevealed
              ? `${c.firstName} ${c.surname}`
              : `${c.firstName} •••••••`

          return (
            <Link
              key={c.id}
              to={`/consultants/${c.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-sm no-underline"
              style={{
                background: 'var(--brand-bg)',
                borderColor: 'rgba(0,0,0,0.08)',
                color: 'var(--brand-text)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                style={{ background: 'var(--brand-gradient)' }}
              >
                {initials || '••'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${isTemplate ? 'placeholder-text' : ''}`}>
                    {displayName}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <div
                  className={`text-xs mt-0.5 ${isTemplate ? 'placeholder-text' : ''}`}
                  style={{ color: 'var(--brand-text-muted)' }}
                >
                  {c.currentRole}
                </div>
                <div
                  className="text-xs mt-1 line-clamp-1"
                  style={{ color: 'var(--brand-text-muted)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--brand-accent-strong)' }}>
                    Suggested:
                  </span>{' '}
                  <span className={isTemplate ? 'placeholder-text' : ''}>{c.suggestedRole}</span>
                </div>
              </div>
              <span
                className="text-xs flex items-center gap-1.5 shrink-0"
                style={{ color: 'var(--brand-accent-strong)' }}
              >
                View profile
                <IconArrowRight size={14} />
              </span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: 'draft' | 'active' | 'archived' }) {
  const map = {
    active: { icon: <IconCircleDot size={11} />, label: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    draft: { icon: <IconClock size={11} />, label: 'Draft template', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    archived: { icon: <IconCircleDot size={11} />, label: 'Archived', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  }
  const m = map[status]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: m.bg, color: m.color }}
    >
      {m.icon}
      {m.label}
    </span>
  )
}
