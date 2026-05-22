import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconArrowLeft, IconLoader2, IconPencil } from '@tabler/icons-react'
import { fetchConsultant, upsertConsultant } from '../lib/consultantRepo'
import type { Consultant } from '../data/types'
import ConsultantDetail from '../components/ConsultantDetail'
import { useReveal } from '../hooks/useReveal'
import { useDownload } from '../hooks/useDownload'
import { exportConsultantDocx } from '../lib/exportDocx'

export default function ConsultantPage() {
  const { id } = useParams<{ id: string }>()
  const [seed, setSeed] = useState<Consultant | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    if (!id) {
      setSeed(null)
      return
    }
    fetchConsultant(id)
      .then((c) => {
        if (!cancelled) setSeed(c)
      })
      .catch(() => {
        if (!cancelled) setSeed(null)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (seed === undefined) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12 flex items-center gap-2 text-sm" style={{ color: 'var(--brand-text-muted)' }}>
        <IconLoader2 size={16} className="animate-spin" />
        Loading consultant...
      </main>
    )
  }

  if (seed === null) {
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

function ConsultantPageInner({ seed }: { seed: Consultant }) {
  const isTemplate = seed.id === 'template-consultant'
  const editable = seed.status === 'draft' || !isTemplate
  const [data, setData] = useState<Consultant>(seed)
  const { isRevealed } = useReveal()
  const { setHandler } = useDownload()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string>('')

  useEffect(() => {
    setHandler(() => exportConsultantDocx({ consultant: data, revealed: isRevealed }))
    return () => setHandler(null)
  }, [data, isRevealed, setHandler])

  const update = (path: (string | number)[], value: string) => {
    setData((prev) => setAt(prev, path, value))
  }

  const onSave = async () => {
    setSaveStatus('saving')
    setSaveError('')
    try {
      await upsertConsultant(data)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1800)
    } catch (err) {
      setSaveStatus('error')
      setSaveError(err instanceof Error ? err.message : String(err))
    }
  }

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
        {editable && !isTemplate && (
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
              Edit mode — click any field. Save when done.
            </span>
            <button
              type="button"
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--brand-gradient)' }}
            >
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                  ? 'Saved!'
                  : 'Save to database'}
            </button>
          </div>
        )}
        {isTemplate && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: 'var(--brand-bg-soft)',
              color: 'var(--brand-text-muted)',
              border: '0.5px solid rgba(0,0,0,0.12)',
            }}
          >
            <IconPencil size={12} />
            Template preview — edits don't persist. Use Import CV to add a real consultant.
          </span>
        )}
      </div>
      {saveStatus === 'error' && (
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-3">
          <div className="rounded-lg p-3 text-xs" style={{ background: 'rgba(239,68,68,0.08)', color: '#991B1B' }}>
            Save failed: {saveError}
          </div>
        </div>
      )}
      <ConsultantDetail consultant={data} editable={editable} onUpdate={update} />
    </main>
  )
}

function setAt<T>(obj: T, path: (string | number)[], value: any): T {
  if (path.length === 0) return value as T
  const [head, ...rest] = path
  const isArr = typeof head === 'number'
  const clone: any = isArr ? [...(obj as any)] : { ...(obj as any) }
  clone[head] = setAt(clone[head], rest, value)
  return clone as T
}
