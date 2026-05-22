import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconArrowLeft, IconPencil, IconRefresh } from '@tabler/icons-react'
import { getConsultant } from '../data/consultants'
import { getImportedConsultants } from '../lib/draftStore'
import ConsultantDetail from '../components/ConsultantDetail'
import { useConsultantEditor } from '../hooks/useConsultantEditor'
import { useReveal } from '../hooks/useReveal'
import { useDownload } from '../hooks/useDownload'
import { exportConsultantDocx } from '../lib/exportDocx'

export default function ConsultantPage() {
  const { id } = useParams<{ id: string }>()
  const seed = id ? getConsultant(id) : undefined

  if (!seed) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-medium mb-2" style={{ color: 'var(--brand-text)' }}>
          Consultant not found
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--brand-text-muted)' }}>
          Check the URL or head back to the directory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white no-underline"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <IconArrowLeft size={14} />
          Back to directory
        </Link>
      </main>
    )
  }

  return <ConsultantPageInner seed={seed} />
}

function ConsultantPageInner({ seed }: { seed: ReturnType<typeof getConsultant> & object }) {
  const isDraft = seed.status === 'draft'
  const isImported = getImportedConsultants().some((c) => c.id === seed.id)
  const editable = isDraft || isImported
  const { data, update, reset } = useConsultantEditor(seed)
  const { isRevealed } = useReveal()
  const { setHandler } = useDownload()

  useEffect(() => {
    setHandler(() => exportConsultantDocx({ consultant: data, revealed: isRevealed }))
    return () => setHandler(null)
  }, [data, isRevealed, setHandler])

  return (
    <main className="py-6">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-4 flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs no-underline transition hover:opacity-80"
          style={{ color: 'var(--brand-text-muted)' }}
        >
          <IconArrowLeft size={13} />
          Back to directory
        </Link>
        {editable && (
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                background: 'var(--brand-bg-soft)',
                color: 'var(--brand-accent-strong)',
                border: '0.5px solid var(--brand-accent)',
              }}
            >
              <IconPencil size={12} />
              Edit mode — click any field (including the avatar) to edit. Edits autosave to your browser.
            </span>
            {isDraft && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border transition hover:opacity-80"
                style={{
                  color: 'var(--brand-text-muted)',
                  borderColor: 'rgba(0,0,0,0.15)',
                }}
              >
                <IconRefresh size={12} />
                Reset template
              </button>
            )}
          </div>
        )}
      </div>
      <ConsultantDetail consultant={data} editable={editable} onUpdate={update} />
    </main>
  )
}
