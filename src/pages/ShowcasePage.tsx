import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  IconArrowLeft,
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCheck,
  IconCloudCheck,
  IconDeviceFloppy,
  IconDownload,
  IconLoader2,
  IconMapPin,
  IconPencil,
  IconSchool,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconTrendingUp,
} from '@tabler/icons-react'
import { fetchAllConsultants } from '../lib/consultantRepo'
import {
  fetchShowcaseOverrides,
  mergeConsultantWithOverride,
  upsertShowcaseOverride,
} from '../lib/showcaseRepo'
import type { Consultant } from '../data/types'
import { useTheme } from '../themes/ThemeContext'
import { exportConsultantDocx } from '../lib/exportDocx'
import EditableText from '../components/EditableText'

type ShowcaseConsultant = Consultant & { rfpNotes?: string }

function maskedName(c: Consultant): string {
  const initial = c.surname?.trim()?.[0] ?? ''
  return initial ? `${c.firstName} ${initial}.` : c.firstName
}

function yearsFromExperience(c: Consultant): string {
  const years =
    c.experience
      ?.map((e) => {
        const m = (e.period ?? '').match(/(19|20)\d{2}/g)
        if (!m || m.length === 0) return null
        return parseInt(m[0], 10)
      })
      .filter((n): n is number => n != null) ?? []
  if (years.length === 0) return ''
  const earliest = Math.min(...years)
  const span = new Date().getFullYear() - earliest
  if (span < 1) return ''
  return `${span}+`
}

function deriveQualifiers(c: Consultant): { years: string; trained: string; qualified: string } {
  const yrs = yearsFromExperience(c)
  const companies = (c.experience ?? []).map((e) => e.company).filter(Boolean)
  const trained = companies[companies.length - 1] ?? companies[0] ?? ''
  const eduTop = (c.education ?? []).find((e) =>
    /(CA|PhD|MSc|MBA|PMP|certified|certificate|honours|primavera)/i.test(e.degree),
  )
  const qualified =
    eduTop?.degree
      ?.replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 4)
      .join(' ') ?? ''
  return { years: yrs, trained: trained, qualified: qualified }
}

function setAt<T>(obj: T, path: (string | number)[], value: any): T {
  if (path.length === 0) return value as T
  const [head, ...rest] = path
  const isArr = typeof head === 'number'
  const clone: any = isArr ? [...(obj as any)] : { ...(obj as any) }
  clone[head] = setAt(clone[head], rest, value)
  return clone as T
}

export default function ShowcasePage() {
  const [searchParams] = useSearchParams()
  const idsParam = searchParams.get('ids')
  const showcaseKey = searchParams.get('key') ?? 'default'
  const isAdmin = searchParams.get('admin') === '1'
  const wantedIds = useMemo(
    () => (idsParam ? idsParam.split(',').map((s) => s.trim()).filter(Boolean) : []),
    [idsParam],
  )

  const { theme, setTheme } = useTheme()
  const [pool, setPool] = useState<ShowcaseConsultant[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchAllConsultants(), fetchShowcaseOverrides(showcaseKey)])
      .then(([rows, overrides]) => {
        if (cancelled) return
        const active = rows.filter((c) => c.status === 'active')
        let four: Consultant[]
        if (wantedIds.length > 0) {
          const byId = new Map(active.map((c) => [c.id, c]))
          four = wantedIds.map((id) => byId.get(id)).filter(Boolean) as Consultant[]
          if (four.length === 0) four = active.slice(0, 4)
        } else {
          four = active.slice(0, 4)
        }
        const merged: ShowcaseConsultant[] = four.map((c) =>
          mergeConsultantWithOverride(c, overrides.get(c.id)),
        )
        setPool(merged)
        setSelectedId(merged[0]?.id ?? null)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [wantedIds, showcaseKey])

  const selected = useMemo(
    () => pool?.find((c) => c.id === selectedId) ?? null,
    [pool, selectedId],
  )

  const updateField = (path: (string | number)[], value: string) => {
    if (!selected) return
    setPool((prev) => {
      if (!prev) return prev
      const idx = prev.findIndex((c) => c.id === selected.id)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = setAt(prev[idx], path, value) as ShowcaseConsultant
      return next
    })
    setDirty((prev) => new Set(prev).add(selected.id))
    setSaveStatus('idle')
  }

  const saveSelected = async () => {
    if (!selected) return
    setSaveStatus('saving')
    setSaveError('')
    try {
      await upsertShowcaseOverride(showcaseKey, selected.id, selected)
      setSaveStatus('saved')
      setDirty((prev) => {
        const next = new Set(prev)
        next.delete(selected.id)
        return next
      })
      setTimeout(() => setSaveStatus('idle'), 1500)
    } catch (err) {
      setSaveStatus('error')
      setSaveError(err instanceof Error ? err.message : String(err))
    }
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm" style={{ color: '#B91C1C' }}>
          Could not load showcase: {error}
        </p>
      </main>
    )
  }

  if (pool === null) {
    return (
      <main
        className="max-w-6xl mx-auto px-6 py-10 flex items-center gap-2 text-sm"
        style={{ color: 'var(--brand-text-muted)' }}
      >
        <IconLoader2 size={16} className="animate-spin" />
        Loading talent profiles...
      </main>
    )
  }

  if (pool.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
          No consultants found. Check the <code>?ids=</code> URL parameter.
        </p>
      </main>
    )
  }

  const onDownload = async () => {
    if (!selected) return
    setDownloading(true)
    try {
      await exportConsultantDocx({ consultant: selected, revealed: false, showcase: true })
    } finally {
      setDownloading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const isDirty = selected ? dirty.has(selected.id) : false

  return (
    <div style={{ background: 'var(--brand-bg-soft)', minHeight: '100vh' }}>
      <header
        className="px-6 lg:px-10 py-3 border-b flex items-center justify-between flex-wrap gap-3"
        style={{ background: 'var(--brand-bg)', borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img
              src={theme === 'truffle' ? '/truffle-logo-dark.png' : '/wwps-logo.png'}
              alt={theme === 'truffle' ? 'Truffle' : 'WWPS'}
              style={{ height: 26, width: 'auto' }}
            />
            <span
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: 'var(--brand-text-muted)', letterSpacing: '0.2em' }}
            >
              Talent profiles
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1 p-0.5 rounded-md text-xs font-medium"
            style={{ background: '#E5E7EB' }}
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
          <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
            Prepared for{' '}
            <span style={{ color: 'var(--brand-accent-strong)', fontWeight: 500 }}>WWPS</span> ·{' '}
            {today}
          </span>
        </div>
      </header>

      {isAdmin && (
        <div
          className="px-6 lg:px-10 py-2 border-b flex items-center justify-between gap-3 text-xs"
          style={{ background: 'var(--brand-bg-soft)', borderColor: 'rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--brand-text-muted)' }}>
            <IconPencil size={12} />
            Admin edit mode — click any text to change. Showcase edits don't affect the original profiles. WWPS sees the saved state, read-only.
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1" style={{ color: '#059669' }}>
                <IconCloudCheck size={12} />
                Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="inline-flex items-center gap-1" style={{ color: '#B91C1C' }}>
                Error: {saveError}
              </span>
            )}
            <button
              type="button"
              onClick={saveSelected}
              disabled={!isDirty || saveStatus === 'saving'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <IconDeviceFloppy size={12} />
              {saveStatus === 'saving' ? 'Saving...' : isDirty ? 'Save changes' : 'No changes'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside>
          <div className="lg:sticky lg:top-6 space-y-1">
            <p
              className="text-[10px] uppercase tracking-widest font-medium px-3 mb-2"
              style={{ color: 'var(--brand-text-muted)', letterSpacing: '0.18em' }}
            >
              Shortlist · {pool.length}
            </p>
            {pool.map((c) => {
              const active = c.id === selectedId
              const isCardDirty = dirty.has(c.id)
              const initials = c.firstName
                .split(' ')
                .map((s) => s[0])
                .join('')
                .replace(/[^A-Za-z]/g, '')
                .substring(0, 2)
                .toUpperCase()
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className="w-full text-left p-3 rounded-lg transition flex items-center gap-3"
                  style={
                    active
                      ? {
                          background: 'var(--brand-bg)',
                          boxShadow:
                            'inset 3px 0 0 var(--brand-pink), 0 1px 2px rgba(0,0,0,0.04)',
                        }
                      : { background: 'transparent' }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium shrink-0"
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
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm font-medium leading-tight flex items-center gap-1"
                      style={{ color: 'var(--brand-text)' }}
                    >
                      {maskedName(c)}
                      {isAdmin && isCardDirty && (
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ background: 'var(--brand-pink)' }}
                          title="Unsaved changes"
                        />
                      )}
                    </div>
                    <div
                      className="text-[11px] truncate"
                      style={{ color: 'var(--brand-text-muted)' }}
                    >
                      {c.suggestedRole || c.currentRole}
                    </div>
                  </div>
                </button>
              )
            })}
            <div
              className="px-3 pt-4 pb-1 text-[11px]"
              style={{ color: 'var(--brand-text-muted)' }}
            >
              Click a name to switch. Surnames are abbreviated until shortlisting.
            </div>
          </div>
        </aside>

        <main>
          {selected && (
            <ShowcaseDetail isAdmin={isAdmin}
              consultant={selected}
              onDownload={onDownload}
              downloading={downloading}
              onUpdate={updateField}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function ShowcaseDetail({
  isAdmin,
  consultant,
  onDownload,
  downloading,
  onUpdate,
}: {
  isAdmin: boolean
  consultant: ShowcaseConsultant
  onDownload: () => void
  downloading: boolean
  onUpdate: (path: (string | number)[], value: string) => void
}) {
  const initials = consultant.firstName
    .split(' ')
    .map((s) => s[0])
    .join('')
    .replace(/[^A-Za-z]/g, '')
    .substring(0, 2)
    .toUpperCase()
  const q = deriveQualifiers(consultant)
  const companies = (consultant.experience ?? [])
    .map((e) => e.company)
    .filter(Boolean)
    .slice(0, 3)
  const surnameInitial = consultant.surname?.trim()?.[0] ?? ''

  return (
    <div className="space-y-4">
      <section
        className="rounded-xl border p-6"
        style={{
          background: 'var(--brand-bg)',
          borderColor: 'rgba(0,0,0,0.06)',
          borderTop: '3px solid var(--brand-pink)',
        }}
      >
        {(isAdmin || (consultant.rfpNotes && consultant.rfpNotes.trim())) && (
          <div
            className="mb-4 rounded-md px-3 py-2 flex items-start gap-2 border"
            style={{
              background: 'rgba(255,106,161,0.06)',
              borderColor: 'rgba(255,106,161,0.25)',
            }}
          >
            <IconSparkles
              size={14}
              style={{ color: 'var(--brand-pink)', flexShrink: 0, marginTop: 2 }}
            />
            <div className="flex-1 text-xs" style={{ color: 'var(--brand-text)' }}>
              <span
                className="font-medium mr-1"
                style={{ color: 'var(--brand-accent-strong)' }}
              >
                RFP fit:
              </span>
              <EditableText
                value={consultant.rfpNotes ?? ''}
                editable={isAdmin}
                multiline
                placeholder="Add a one-line note on why this candidate fits the WWPS RFP..."
                onChange={(v) => onUpdate(['rfpNotes'], v)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-start">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-medium shrink-0"
            style={{ background: 'var(--brand-gradient)' }}
          >
            {consultant.avatar ? (
              <img
                src={consultant.avatar}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              initials || '••'
            )}
          </div>
          <div className="min-w-0">
            <h1
              className="text-2xl font-medium tracking-tight"
              style={{ color: 'var(--brand-text)' }}
            >
              <EditableText
                value={consultant.firstName}
                editable={isAdmin}
                onChange={(v) => onUpdate(['firstName'], v)}
              />{' '}
              {surnameInitial}.
            </h1>
            <div
              className="text-sm mt-0.5"
              style={{ color: 'var(--brand-accent-strong)', fontWeight: 500 }}
            >
              <EditableText
                value={consultant.suggestedRole || consultant.currentRole}
                editable={isAdmin}
                placeholder="Suggested role for this RFP"
                onChange={(v) => onUpdate(['suggestedRole'], v)}
              />
            </div>
            <div
              className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs"
              style={{ color: 'var(--brand-text-muted)' }}
            >
              <span className="inline-flex items-center gap-1">
                <IconMapPin size={12} />
                <EditableText
                  value={consultant.contact?.location ?? ''}
                  editable={isAdmin}
                  placeholder="Location"
                  onChange={(v) => onUpdate(['contact', 'location'], v)}
                />
              </span>
              {companies.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <IconBuildingSkyscraper size={12} />
                  {companies.join(' · ')}
                </span>
              )}
              {consultant.education?.[0]?.institution && (
                <span className="inline-flex items-center gap-1">
                  <IconSchool size={12} />
                  {consultant.education[0].institution}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(consultant.badges ?? []).slice(0, 5).map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{
                    background: 'rgba(255, 106, 161, 0.12)',
                    color: 'var(--brand-accent-strong)',
                  }}
                >
                  <EditableText
                    value={b.label}
                    editable={isAdmin}
                    onChange={(v) => onUpdate(['badges', i, 'label'], v)}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="text-right space-y-3 min-w-[120px]">
            {q.years && (
              <div>
                <div
                  className="text-2xl font-medium"
                  style={{ color: 'var(--brand-accent-strong)' }}
                >
                  {q.years}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--brand-text-muted)', letterSpacing: '0.16em' }}
                >
                  Years exp
                </div>
              </div>
            )}
            {q.trained && (
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: 'var(--brand-text)' }}
                >
                  {q.trained}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--brand-text-muted)', letterSpacing: '0.16em' }}
                >
                  Most recent
                </div>
              </div>
            )}
            {q.qualified && (
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: 'var(--brand-text)' }}
                >
                  {q.qualified}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: 'var(--brand-text-muted)', letterSpacing: '0.16em' }}
                >
                  Qualified
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={onDownload}
              disabled={downloading}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <IconDownload size={12} />
              {downloading ? 'Preparing...' : 'Download .docx'}
            </button>
          </div>
        </div>
        <p
          className="mt-5 text-sm leading-relaxed"
          style={{ color: 'var(--brand-text)' }}
        >
          <EditableText
            value={consultant.summary}
            editable={isAdmin}
            multiline
            placeholder="Professional summary"
            onChange={(v) => onUpdate(['summary'], v)}
          />
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
        <div className="space-y-4">
          <Card title="Experience" icon={<IconBriefcase size={13} />}>
            <ul className="space-y-4">
              {(consultant.experience ?? []).map((job, idx) => (
                <li key={idx} className="relative pl-4">
                  <span
                    className="absolute left-0 top-2 w-2 h-2 rounded-full"
                    style={{
                      background: job.isCurrent ? 'var(--brand-pink)' : 'var(--brand-accent)',
                    }}
                  />
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                      <EditableText
                        value={job.title}
                        editable={isAdmin}
                        onChange={(v) => onUpdate(['experience', idx, 'title'], v)}
                      />
                      {job.isCurrent && (
                        <span
                          className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium align-middle"
                          style={{
                            background: 'rgba(255,106,161,0.16)',
                            color: 'var(--brand-accent-strong)',
                          }}
                        >
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--brand-text-muted)' }}>
                      <EditableText
                        value={job.period}
                        editable={isAdmin}
                        onChange={(v) => onUpdate(['experience', idx, 'period'], v)}
                      />
                    </div>
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--brand-accent-strong)', fontWeight: 500 }}
                  >
                    <EditableText
                      value={job.company}
                      editable={isAdmin}
                      onChange={(v) => onUpdate(['experience', idx, 'company'], v)}
                    />
                    {job.location && (
                      <>
                        {' · '}
                        <EditableText
                          value={job.location}
                          editable={isAdmin}
                          onChange={(v) => onUpdate(['experience', idx, 'location'], v)}
                        />
                      </>
                    )}
                  </div>
                  {job.bullets?.length > 0 && (
                    <ul
                      className="text-[13px] mt-1.5 leading-relaxed list-disc pl-4"
                      style={{ color: 'var(--brand-text)' }}
                    >
                      {job.bullets.map((b, bi) => (
                        <li key={bi}>
                          <EditableText
                            value={b}
                            editable={isAdmin}
                            multiline
                            onChange={(v) =>
                              onUpdate(['experience', idx, 'bullets', bi], v)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.achievement && (
                    <div
                      className="mt-2 px-3 py-2 rounded-md text-xs flex items-start gap-2"
                      style={{ background: 'var(--brand-bg-soft)', color: 'var(--brand-text)' }}
                    >
                      <IconStar
                        size={12}
                        style={{ color: 'var(--brand-pink)', flexShrink: 0, marginTop: 2 }}
                      />
                      <span>
                        <EditableText
                          value={job.achievement}
                          editable={isAdmin}
                          multiline
                          onChange={(v) => onUpdate(['experience', idx, 'achievement'], v)}
                        />
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {consultant.education?.length > 0 && (
            <Card title="Education" icon={<IconSchool size={13} />}>
              <ul className="space-y-2">
                {consultant.education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: 'var(--brand-bg-soft)',
                        color: 'var(--brand-accent-strong)',
                      }}
                    >
                      <IconSchool size={13} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                        <EditableText
                          value={edu.degree}
                          editable={isAdmin}
                          onChange={(v) => onUpdate(['education', idx, 'degree'], v)}
                        />
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: 'var(--brand-accent-strong)', fontWeight: 500 }}
                      >
                        <EditableText
                          value={edu.institution}
                          editable={isAdmin}
                          onChange={(v) => onUpdate(['education', idx, 'institution'], v)}
                        />
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--brand-text-muted)' }}>
                        <EditableText
                          value={edu.year}
                          editable={isAdmin}
                          onChange={(v) => onUpdate(['education', idx, 'year'], v)}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {consultant.readiness?.length > 0 && (
            <Card title="Readiness" icon={<IconShieldCheck size={13} />}>
              <ul className="space-y-1.5">
                {consultant.readiness.map((r, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: 'var(--brand-text)' }}
                  >
                    <IconCheck
                      size={12}
                      style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 2 }}
                    />
                    <EditableText
                      value={r}
                      editable={isAdmin}
                      onChange={(v) => onUpdate(['readiness', idx], v)}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {consultant.skills?.length > 0 && (
            <Card title="Core skills" icon={<IconTrendingUp size={13} />}>
              <div className="space-y-3">
                {consultant.skills.map((s, idx) => (
                  <div key={idx}>
                    <div
                      className="text-[10px] uppercase tracking-widest font-medium mb-1.5"
                      style={{
                        color: 'var(--brand-accent-strong)',
                        letterSpacing: '0.14em',
                      }}
                    >
                      <EditableText
                        value={s.category}
                        editable={isAdmin}
                        onChange={(v) => onUpdate(['skills', idx, 'category'], v)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.items.map((item, j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded text-[11px]"
                          style={{
                            background: 'var(--brand-bg-soft)',
                            color: 'var(--brand-text)',
                            border: '0.5px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          <EditableText
                            value={item}
                            editable={isAdmin}
                            onChange={(v) => onUpdate(['skills', idx, 'items', j], v)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {consultant.industries?.length > 0 && (
            <Card title="Industries" icon={<IconBuildingSkyscraper size={13} />}>
              <ul className="space-y-1.5">
                {consultant.industries.map((ind, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: 'var(--brand-text)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: 'var(--brand-pink)' }}
                    />
                    <EditableText
                      value={ind}
                      editable={isAdmin}
                      onChange={(v) => onUpdate(['industries', idx], v)}
                    />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div
            className="text-[11px] text-center pt-2"
            style={{ color: 'var(--brand-text-muted)' }}
          >
            Surname and contact details disclosed on shortlisting.
          </div>
          <Link
            to="/"
            className="block text-center text-[11px] no-underline transition hover:opacity-80"
            style={{ color: 'var(--brand-text-muted)' }}
          >
            <IconArrowLeft size={11} style={{ display: 'inline', marginRight: 4 }} />
            Truffle admin directory
          </Link>
        </div>
      </div>
    </div>
  )
}

function Card({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      className="rounded-xl border p-5"
      style={{ background: 'var(--brand-bg)', borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <h3
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium mb-3"
        style={{ color: 'var(--brand-accent-strong)', letterSpacing: '0.18em' }}
      >
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: 'rgba(255,106,161,0.16)' }}
        >
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}
