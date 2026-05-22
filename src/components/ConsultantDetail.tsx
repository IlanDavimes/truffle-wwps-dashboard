import {
  IconBriefcase,
  IconBrandLinkedin,
  IconBuilding,
  IconCheck,
  IconDatabase,
  IconFileDescription,
  IconId,
  IconLayersIntersect,
  IconLock,
  IconMail,
  IconMap2,
  IconMapPin,
  IconPhone,
  IconPlayerPlay,
  IconSchool,
  IconShieldCheck,
  IconTarget,
  IconUsers,
} from '@tabler/icons-react'
import type { Consultant } from '../data/types'
import { useReveal } from '../hooks/useReveal'
import { useTheme } from '../themes/ThemeContext'
import MaskedChip from './MaskedChip'
import EditableText from './EditableText'

type Path = (string | number)[]
type Setter = (path: Path, value: string) => void

interface Props {
  consultant: Consultant
  editable?: boolean
  onUpdate?: Setter
}

export default function ConsultantDetail({ consultant, editable = false, onUpdate }: Props) {
  const { isRevealed } = useReveal()
  const initials = consultant.firstName
    .split(' ')
    .map((s) => s[0])
    .join('')
    .replace(/[^A-Za-z]/g, '')
    .substring(0, 2)
    .toUpperCase()

  const isTemplate = consultant.status === 'draft'
  const concealedCount = 5

  const set = (path: Path) => (v: string) => onUpdate && onUpdate(path, v)
  const update = (path: Path, v: string) => onUpdate && onUpdate(path, v)

  return (
    <article className="max-w-5xl mx-auto" style={{ color: 'var(--brand-text)' }}>
      <Hero consultant={consultant} initials={initials} editable={editable} set={set} />

      <div className="px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
          <div className="space-y-7">
            <Section icon={<IconFileDescription size={13} />} title="Professional summary">
              <div
                className="text-sm leading-relaxed"
                style={{ color: 'var(--brand-text)' }}
              >
                <EditableText
                  value={consultant.summary}
                  editable={editable}
                  multiline
                  placeholder="Professional summary..."
                  onChange={set(['summary'])}
                />
              </div>
            </Section>

            <Section icon={<IconBriefcase size={13} />} title="Work history">
              <div className="space-y-4">
                {consultant.experience.map((job, idx) => (
                  <Job
                    key={idx}
                    job={job}
                    jobIndex={idx}
                    isTemplate={isTemplate && !editable}
                    editable={editable}
                    update={update}
                  />
                ))}
              </div>
              {editable && (
                <p className="text-xs mt-3" style={{ color: 'var(--brand-text-muted)' }}>
                  All existing fields edit inline. Adding / removing whole jobs lands in step 2 (the full CV editor).
                </p>
              )}
            </Section>

            <Section icon={<IconLayersIntersect size={13} />} title="Skills matrix">
              <div className="space-y-2">
                {consultant.skills.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-[140px_1fr] gap-3 items-start">
                    <div
                      className="text-xs font-medium pt-1"
                      style={{ color: 'var(--brand-text-muted)' }}
                    >
                      <EditableText
                        value={s.category}
                        editable={editable}
                        onChange={(v) => update(['skills', idx, 'category'], v)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.items.map((item, j) => (
                        <span
                          key={j}
                          className="text-xs px-2 py-1 rounded-md border"
                          style={{
                            background: 'var(--brand-bg-soft)',
                            borderColor: 'rgba(0,0,0,0.06)',
                            color: 'var(--brand-text)',
                          }}
                        >
                          <EditableText
                            value={item}
                            editable={editable}
                            onChange={(v) => update(['skills', idx, 'items', j], v)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<IconSchool size={13} />} title="Education & designations">
              <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                {consultant.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-3 py-2.5 text-sm">
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: 'var(--brand-text)' }}>
                        <EditableText
                          value={edu.degree}
                          editable={editable}
                          onChange={(v) => update(['education', idx, 'degree'], v)}
                        />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                        <EditableText
                          value={edu.institution}
                          editable={editable}
                          onChange={(v) => update(['education', idx, 'institution'], v)}
                        />
                        {edu.highlight !== undefined && (
                          <>
                            {' · '}
                            <EditableText
                              value={edu.highlight ?? ''}
                              editable={editable}
                              placeholder="Highlight (optional)"
                              onChange={(v) => update(['education', idx, 'highlight'], v)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                      <EditableText
                        value={edu.year}
                        editable={editable}
                        onChange={(v) => update(['education', idx, 'year'], v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section icon={<IconUsers size={13} />} title="References">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {consultant.references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg text-xs"
                    style={{ background: 'var(--brand-bg-soft)' }}
                  >
                    <div className="font-medium text-sm" style={{ color: 'var(--brand-text)' }}>
                      <EditableText
                        value={ref.name}
                        editable={editable}
                        onChange={(v) => update(['references', idx, 'name'], v)}
                      />
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--brand-accent-strong)' }}
                    >
                      <EditableText
                        value={ref.role}
                        editable={editable}
                        onChange={(v) => update(['references', idx, 'role'], v)}
                      />
                      {' · '}
                      <EditableText
                        value={ref.company}
                        editable={editable}
                        onChange={(v) => update(['references', idx, 'company'], v)}
                      />
                    </div>
                    <div
                      className="mt-2 pt-2 border-t flex items-center gap-2 text-xs"
                      style={{
                        borderColor: 'rgba(0,0,0,0.12)',
                        borderStyle: 'dashed',
                        color: 'var(--brand-text-muted)',
                      }}
                    >
                      {editable ? (
                        <>
                          <IconLock size={11} style={{ color: 'var(--brand-pink)' }} />
                          <EditableText
                            value={ref.contact}
                            editable={editable}
                            placeholder="Reference contact (concealed until reveal)"
                            className="flex-1"
                            onChange={(v) => update(['references', idx, 'contact'], v)}
                          />
                        </>
                      ) : isRevealed ? (
                        <span>{ref.contact}</span>
                      ) : (
                        <>
                          <IconLock size={11} style={{ color: 'var(--brand-pink)' }} />
                          <span className="masked-blob flex-1">{ref.contact}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <aside className="space-y-4">
            <div
              className="p-4 rounded-xl text-white"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <div className="text-[11px] font-medium uppercase tracking-wider opacity-85">
                <EditableText
                  value={consultant.availability.status}
                  editable={editable}
                  onChange={set(['availability', 'status'])}
                />
              </div>
              <div className="text-sm font-medium mt-1">
                <EditableText
                  value={consultant.availability.details}
                  editable={editable}
                  onChange={set(['availability', 'details'])}
                />
              </div>
            </div>

            <SideCard title="Key qualifications">
              <ul className="space-y-1.5 text-xs">
                {consultant.readiness.map((r, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 items-start"
                    style={{ color: 'var(--brand-text)' }}
                  >
                    <IconCheck
                      size={13}
                      style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 1 }}
                    />
                    <span className={isTemplate && !editable ? 'placeholder-text' : ''}>
                      <EditableText
                        value={r}
                        editable={editable}
                        onChange={(v) => update(['readiness', idx], v)}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </SideCard>

            <SideCard title="Focus industries">
              <ul className="space-y-1.5 text-xs">
                {consultant.industries.map((ind, idx) => {
                  const lower = ind.toLowerCase()
                  const icon = lower.includes('construct') ? (
                    <IconBuilding size={13} />
                  ) : lower.includes('urban') || lower.includes('plan') ? (
                    <IconMap2 size={13} />
                  ) : (
                    <IconDatabase size={13} />
                  )
                  return (
                    <li
                      key={idx}
                      className="flex gap-2 items-start"
                      style={{ color: 'var(--brand-text)' }}
                    >
                      <span
                        style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 1 }}
                      >
                        {icon}
                      </span>
                      <span className={isTemplate && !editable ? 'placeholder-text' : ''}>
                        <EditableText
                          value={ind}
                          editable={editable}
                          onChange={(v) => update(['industries', idx], v)}
                        />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </SideCard>
          </aside>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-6 lg:px-10 py-3 border-t text-xs"
        style={{
          background: 'var(--brand-bg-soft)',
          borderColor: 'rgba(0,0,0,0.06)',
          color: 'var(--brand-text-muted)',
        }}
      >
        <span className="flex items-center gap-1.5">
          <IconShieldCheck size={13} />
          {isRevealed
            ? 'All fields revealed for this session. Downloads will include full details.'
            : `${concealedCount} fields concealed — enter the access password to unseal and download with full details.`}
        </span>
        <span>© 2026 Truffle Consulting</span>
      </div>
    </article>
  )
}

function Hero({
  consultant,
  initials,
  editable,
  set,
}: {
  consultant: Consultant
  initials: string
  editable: boolean
  set: (path: Path) => (v: string) => void
}) {
  const { isRevealed, openModal } = useReveal()
  const { theme } = useTheme()
  const logoSrc = theme === 'truffle' ? '/truffle-logo-white.png' : '/wwps-logo.png'
  const logoAlt = theme === 'truffle' ? 'Truffle' : 'WWPS'

  return (
    <div
      className="px-6 lg:px-10 py-8 lg:py-10 text-white"
      style={{ background: 'var(--brand-hero-bg)' }}
    >
      <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
        <div className="min-w-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mb-3 border"
            style={{
              background: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          >
            <IconTarget size={12} />
            <span>Truffle suggests for </span>
            <span style={{ color: 'var(--brand-pink)', fontWeight: 500 }}>
              <EditableText
                value={consultant.suggestedRole}
                editable={editable}
                placeholder="click to add — e.g. Senior Project Planner"
                onChange={set(['suggestedRole'])}
              />
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-2 text-[28px] font-medium leading-tight tracking-tight"
            style={{ color: '#fff' }}
          >
            <span>
              <EditableText
                value={consultant.firstName}
                editable={editable}
                onChange={set(['firstName'])}
              />
            </span>
            {isRevealed || editable ? (
              <span>
                <EditableText
                  value={consultant.surname}
                  editable={editable}
                  onChange={set(['surname'])}
                />
              </span>
            ) : (
              <button
                type="button"
                onClick={openModal}
                title="Click to reveal"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-sm font-normal transition hover:opacity-90"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '0.5px dashed rgba(255,255,255,0.35)',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.3em',
                }}
              >
                <IconLock size={12} />
                <span>•••••••</span>
              </button>
            )}
          </div>

          <p className="text-sm mt-1 mb-4" style={{ color: 'rgba(255,255,255,0.78)' }}>
            <EditableText
              value={consultant.currentRole}
              editable={editable}
              onChange={set(['currentRole'])}
            />
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              <IconMapPin size={12} />
              <span>
                <EditableText
                  value={consultant.contact.location}
                  editable={editable}
                  onChange={set(['contact', 'location'])}
                />
              </span>
            </span>
            <MaskedChip
              icon={<IconMail size={12} />}
              value={consultant.contact.email}
              maskPattern="••••••@•••"
              onHero
            />
            <MaskedChip
              icon={<IconPhone size={12} />}
              value={consultant.contact.phone}
              maskPattern="+•• •• ••• ••••"
              onHero
            />
            <MaskedChip
              icon={<IconBrandLinkedin size={12} />}
              value={consultant.contact.linkedin}
              maskPattern="linkedin.com/in/•••"
              onHero
            />
            <MaskedChip
              icon={<IconId size={12} />}
              value={`Permit ${consultant.contact.permitNumber}`}
              maskPattern="Permit ••••••"
              onHero
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {consultant.badges.map((b, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={
                  b.style === 'premium'
                    ? { background: 'var(--brand-pink)', color: '#131A30' }
                    : { background: 'rgba(255,255,255,0.18)', color: '#fff' }
                }
              >
                <EditableText
                  value={b.label}
                  editable={editable}
                  onChange={set(['badges', idx, 'label'])}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div className="flex items-center justify-center">
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{
                height: theme === 'truffle' ? 56 : 90,
                width: 'auto',
                display: 'block',
                mixBlendMode: 'screen',
              }}
            />
          </div>
          <div
            onClick={
              editable
                ? () => {
                    const current = consultant.avatar ?? ''
                    const next = window.prompt(
                      'Photo URL (e.g. /avatars/Alix Trublet De Nermont.jpg). Leave empty to remove the photo.',
                      current,
                    )
                    if (next !== null) set(['avatar'])(next.trim())
                  }
                : undefined
            }
            title={editable ? 'Click to set photo URL' : undefined}
            className={`relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center font-medium text-3xl text-white ${editable ? 'cursor-pointer ring-2 ring-white/30 hover:ring-white/70 transition' : ''}`}
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
            {consultant.videoEnabled && consultant.videoUrl && (
              <span
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                style={{
                  border: `2px solid var(--brand-hero-bg)`,
                  color: 'var(--brand-text)',
                }}
              >
                <IconPlayerPlay size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider mb-3"
        style={{ color: 'var(--brand-text-muted)' }}
      >
        <span style={{ color: 'var(--brand-accent)' }}>{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Job({
  job,
  jobIndex,
  isTemplate,
  editable,
  update,
}: {
  job: Consultant['experience'][number]
  jobIndex: number
  isTemplate: boolean
  editable: boolean
  update: Setter
}) {
  return (
    <div className="pl-3.5 py-0.5" style={{ borderLeft: '2px solid var(--brand-accent)' }}>
      <div className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
        <span className={isTemplate ? 'placeholder-text' : ''}>
          <EditableText
            value={job.title}
            editable={editable}
            onChange={(v) => update(['experience', jobIndex, 'title'], v)}
          />
        </span>
        {job.isCurrent && (
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium align-middle"
            style={{ background: 'var(--brand-pink)', color: '#131A30' }}
          >
            Current
          </span>
        )}
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
        <span className={isTemplate ? 'placeholder-text' : ''}>
          <EditableText
            value={job.company}
            editable={editable}
            onChange={(v) => update(['experience', jobIndex, 'company'], v)}
          />
        </span>
        {' · '}
        <span className={isTemplate ? 'placeholder-text' : ''}>
          <EditableText
            value={job.location}
            editable={editable}
            onChange={(v) => update(['experience', jobIndex, 'location'], v)}
          />
        </span>
        {' · '}
        <span className={isTemplate ? 'placeholder-text' : ''}>
          <EditableText
            value={job.period}
            editable={editable}
            onChange={(v) => update(['experience', jobIndex, 'period'], v)}
          />
        </span>
      </div>
      <ul
        className="mt-2 pl-4 list-disc space-y-1 text-xs leading-relaxed"
        style={{ color: 'var(--brand-text)' }}
      >
        {job.bullets.map((b, idx) => (
          <li key={idx} className={isTemplate ? 'placeholder-text' : ''}>
            <EditableText
              value={b}
              editable={editable}
              multiline
              onChange={(v) => update(['experience', jobIndex, 'bullets', idx], v)}
            />
          </li>
        ))}
      </ul>
      {job.achievement && (
        <div
          className="mt-2 px-3 py-2 rounded-md text-xs flex items-start gap-2"
          style={{ background: 'var(--brand-bg-soft)', color: 'var(--brand-text)' }}
        >
          <IconShieldCheck
            size={13}
            style={{ color: 'var(--brand-accent)', flexShrink: 0, marginTop: 1 }}
          />
          <span className={isTemplate ? 'placeholder-text' : ''}>
            <EditableText
              value={job.achievement}
              editable={editable}
              multiline
              onChange={(v) => update(['experience', jobIndex, 'achievement'], v)}
            />
          </span>
        </div>
      )}
    </div>
  )
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-3.5 rounded-xl" style={{ background: 'var(--brand-bg-soft)' }}>
      <h4
        className="text-[11px] font-medium uppercase tracking-wider mb-2"
        style={{ color: 'var(--brand-text-muted)' }}
      >
        {title}
      </h4>
      {children}
    </div>
  )
}
