import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  IconArrowRight,
  IconCircleDot,
  IconClock,
  IconLoader2,
  IconSearch,
  IconShieldCheck,
  IconStar,
  IconStarFilled,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import { fetchAllConsultants } from '../lib/consultantRepo'
import type { Consultant } from '../data/types'
import { useReveal } from '../hooks/useReveal'
import { getShortlist, toggleShortlist } from '../lib/shortlist'

export default function DirectoryPage() {
  const { isRevealed } = useReveal()
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('admin') === '1'
  const [all, setAll] = useState<Consultant[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => getShortlist())
  const [onlyShortlist, setOnlyShortlist] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchAllConsultants()
      .then((rows) => {
        if (!cancelled) setAll(rows)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const baseList = useMemo(() => {
    if (!all) return [] as Consultant[]
    return isAdmin ? all : all.filter((c) => c.status === 'active')
  }, [all, isAdmin])

  const topBadges = useMemo(() => {
    const counts = new Map<string, number>()
    baseList.forEach((c) => {
      c.badges?.forEach((b) => {
        const key = normalizeLabel(b.label)
        if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
      })
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label]) => label)
  }, [baseList])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return baseList.filter((c) => {
      if (onlyShortlist && !shortlistedIds.includes(c.id)) return false
      const haystack = consultantHaystack(c)
      if (activeChips.length > 0) {
        const ok = activeChips.every((chip) => haystack.includes(chip.toLowerCase()))
        if (!ok) return false
      }
      if (q && !haystack.includes(q)) return false
      return true
    })
  }, [baseList, query, activeChips, onlyShortlist, shortlistedIds])

  const toggleChip = (label: string) => {
    setActiveChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    )
  }

  const onStar = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleShortlist(id)
    setShortlistedIds((prev) => (next ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const clearFilters = () => {
    setQuery('')
    setActiveChips([])
    setOnlyShortlist(false)
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <p className="text-sm" style={{ color: '#B91C1C' }}>
          Could not load consultants: {error}
        </p>
      </main>
    )
  }

  if (all === null) {
    return (
      <main
        className="max-w-5xl mx-auto px-6 lg:px-10 py-10 flex items-center gap-2 text-sm"
        style={{ color: 'var(--brand-text-muted)' }}
      >
        <IconLoader2 size={16} className="animate-spin" />
        Loading consultants...
      </main>
    )
  }

  const draftCount = isAdmin ? baseList.length - all.filter((c) => c.status === 'active' && (isAdmin || c.status === 'active')).length : 0
  const filtersOn = query.trim() !== '' || activeChips.length > 0 || onlyShortlist

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="text-3xl font-medium tracking-tight mb-2"
            style={{ color: 'var(--brand-text)' }}
          >
            Consultant directory
            {isAdmin && (
              <span
                className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium align-middle"
                style={{ background: 'var(--brand-bg-soft)', color: 'var(--brand-accent-strong)', border: '0.5px solid var(--brand-accent)' }}
              >
                <IconShieldCheck size={11} />
                Admin view
              </span>
            )}
          </h1>
          <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
            Showing {visible.length} of {baseList.length}
            {isAdmin && draftCount > 0 ? ` (${draftCount} draft hidden from clients)` : ''}.
          </p>
        </div>
        <Link
          to="/import"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white no-underline transition hover:opacity-90"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <IconUpload size={14} />
          Import CV
        </Link>
      </div>

      {/* Search + shortlist toggle */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch
            size={14}
            className="absolute"
            style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search by name, role, skill, sector..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-full outline-none focus:ring-2"
            style={{
              background: 'var(--brand-bg)',
              borderColor: 'rgba(0,0,0,0.15)',
              color: 'var(--brand-text)',
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => setOnlyShortlist((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition hover:opacity-80"
          style={
            onlyShortlist
              ? { background: 'var(--brand-accent-strong)', color: '#fff', borderColor: 'var(--brand-accent-strong)' }
              : { background: 'transparent', color: 'var(--brand-text)', borderColor: 'rgba(0,0,0,0.15)' }
          }
        >
          {onlyShortlist ? <IconStarFilled size={13} /> : <IconStar size={13} />}
          My shortlist ({shortlistedIds.length})
        </button>
        {filtersOn && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition hover:opacity-80"
            style={{ background: 'transparent', color: 'var(--brand-text-muted)' }}
          >
            <IconX size={13} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filter chips */}
      {topBadges.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {topBadges.map((label) => {
            const on = activeChips.includes(label)
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleChip(label)}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition hover:opacity-80"
                style={
                  on
                    ? { background: 'var(--brand-accent)', color: '#fff' }
                    : {
                        background: 'var(--brand-bg-soft)',
                        color: 'var(--brand-text-muted)',
                        border: '0.5px solid rgba(0,0,0,0.08)',
                      }
                }
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      <div className="space-y-2">
        {visible.length === 0 && (
          <div
            className="p-8 rounded-xl text-center text-sm"
            style={{ background: 'var(--brand-bg-soft)', color: 'var(--brand-text-muted)' }}
          >
            No consultants match your filters. Try clearing them.
          </div>
        )}
        {visible.map((c) => {
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
          const starred = shortlistedIds.includes(c.id)

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
                className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-medium text-sm shrink-0"
                style={{ background: 'var(--brand-gradient)' }}
              >
                {c.avatar ? (
                  <img
                    src={c.avatar}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials || '••'
                )}
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
              <button
                type="button"
                onClick={(e) => onStar(e, c.id)}
                title={starred ? 'Remove from shortlist' : 'Add to shortlist'}
                className="p-1.5 rounded-full transition hover:bg-black/5"
                style={{ color: starred ? '#F59E0B' : 'var(--brand-text-muted)' }}
              >
                {starred ? <IconStarFilled size={18} /> : <IconStar size={18} />}
              </button>
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

function normalizeLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim()
}

function consultantHaystack(c: Consultant): string {
  return [
    c.firstName,
    c.surname,
    c.currentRole,
    c.suggestedRole,
    c.summary,
    c.contact?.location,
    ...(c.badges ?? []).map((b) => b.label),
    ...(c.industries ?? []),
    ...(c.readiness ?? []),
    ...(c.skills ?? []).flatMap((s) => [s.category, ...s.items]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function StatusBadge({ status }: { status: 'draft' | 'active' | 'archived' }) {
  const map = {
    active: { icon: <IconCircleDot size={11} />, label: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    draft: { icon: <IconClock size={11} />, label: 'Draft', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
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
