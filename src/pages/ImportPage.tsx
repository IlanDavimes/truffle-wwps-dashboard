import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconKey,
  IconLoader2,
  IconUpload,
} from '@tabler/icons-react'
import { extractTextFromFile } from '../lib/cvExtract'
import { parseCV } from '../lib/cvParse'
import type { Consultant } from '../data/types'
import ConsultantDetail from '../components/ConsultantDetail'
import {
  getStoredApiKey,
  setStoredApiKey,
  saveImportedConsultant,
  getImportedConsultants,
} from '../lib/draftStore'

type Phase = 'idle' | 'extracting' | 'parsing' | 'preview' | 'saved' | 'error'

export default function ImportPage() {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState<string>(() => getStoredApiKey())
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [filename, setFilename] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')
  const [draft, setDraft] = useState<Consultant | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (apiKey) setStoredApiKey(apiKey)
  }, [apiKey])

  const handleFile = async (file: File) => {
    setError('')
    setDraft(null)
    setFilename(file.name)

    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      setError('Paste your Anthropic API key first. It starts with sk-ant-.')
      setPhase('error')
      return
    }

    setPhase('extracting')
    setProgress(`Reading ${file.name}...`)
    try {
      const extracted = await extractTextFromFile(file)
      setRawText(extracted.text)
      if (!extracted.text.trim()) {
        throw new Error('No text found in the file. If this is a scanned PDF, it needs OCR first.')
      }

      setPhase('parsing')
      setProgress(`Claude is parsing ${extracted.text.length.toLocaleString()} characters...`)
      const parsed = await parseCV({ apiKey, rawText: extracted.text })
      const withUniqueId = ensureUniqueId(parsed)
      setDraft(withUniqueId)
      setPhase('preview')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      setPhase('error')
    }
  }

  const onPublish = () => {
    if (!draft) return
    saveImportedConsultant({ ...draft, status: 'active' })
    setPhase('saved')
    setTimeout(() => navigate(`/consultants/${draft.id}`), 800)
  }

  const onSaveDraft = () => {
    if (!draft) return
    saveImportedConsultant({ ...draft, status: 'draft' })
    setPhase('saved')
    setTimeout(() => navigate(`/consultants/${draft.id}`), 800)
  }

  const onUpdate = (path: (string | number)[], value: string) => {
    if (!draft) return
    setDraft((prev) => (prev ? setAt(prev, path, value) : prev))
  }

  const onReset = () => {
    setDraft(null)
    setRawText('')
    setFilename('')
    setError('')
    setPhase('idle')
  }

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-10 py-8" style={{ color: 'var(--brand-text)' }}>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs no-underline transition hover:opacity-80"
          style={{ color: 'var(--brand-text-muted)' }}
        >
          <IconArrowLeft size={13} />
          Back to directory
        </Link>
        <h1
          className="text-3xl font-medium tracking-tight mt-3 mb-1"
          style={{ color: 'var(--brand-text)' }}
        >
          Import a CV
        </h1>
        <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
          Drop a PDF or Word CV. Claude extracts the structured fields, you review, then publish.
        </p>
      </div>

      {/* API key panel */}
      <div
        className="rounded-xl p-4 mb-6 border"
        style={{
          background: 'var(--brand-bg-soft)',
          borderColor: apiKey ? 'rgba(0,0,0,0.08)' : 'rgba(161, 35, 231, 0.35)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <IconKey size={16} style={{ color: 'var(--brand-accent)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
            Anthropic API key
          </span>
          {apiKey && (
            <span
              className="text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}
            >
              <IconCheck size={11} />
              Stored in this browser only
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value.trim())}
          className="w-full px-3 py-2 text-sm border rounded outline-none focus:ring-2"
          style={{
            background: 'var(--brand-bg)',
            borderColor: 'rgba(0,0,0,0.12)',
            color: 'var(--brand-text)',
          }}
        />
        <p className="text-xs mt-2" style={{ color: 'var(--brand-text-muted)' }}>
          Key stays in your browser's localStorage; nothing is sent to Truffle's servers. Before
          public deploy we'll move this server-side so end users never need a key.
        </p>
      </div>

      {/* Drop zone */}
      {phase === 'idle' || phase === 'error' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) void handleFile(file)
          }}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl p-10 text-center cursor-pointer transition border-2 border-dashed"
          style={{
            borderColor: dragOver ? 'var(--brand-accent)' : 'rgba(0,0,0,0.15)',
            background: dragOver ? 'rgba(161, 35, 231, 0.04)' : 'var(--brand-bg)',
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--brand-gradient)', color: '#fff' }}
            >
              <IconUpload size={20} />
            </span>
            <div className="text-base font-medium" style={{ color: 'var(--brand-text)' }}>
              Drag a PDF or Word CV here, or click to browse
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              Accepted: .pdf, .docx, .txt
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Progress */}
      {(phase === 'extracting' || phase === 'parsing') && (
        <div
          className="rounded-xl p-5 mb-4 flex items-center gap-3"
          style={{ background: 'var(--brand-bg-soft)' }}
        >
          <IconLoader2 size={20} className="animate-spin" style={{ color: 'var(--brand-accent)' }} />
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
              {phase === 'extracting' ? 'Reading file...' : 'Parsing with Claude...'}
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
              {progress}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && error && (
        <div
          className="rounded-xl p-4 mb-4 flex items-start gap-3 border"
          style={{ background: 'rgba(239, 68, 68, 0.04)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <IconAlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <div className="text-sm" style={{ color: '#991B1B' }}>
            {error}
          </div>
        </div>
      )}

      {/* Preview */}
      {phase === 'preview' && draft && (
        <>
          <div
            className="rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3"
            style={{ background: 'var(--brand-bg-soft)' }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-text)' }}>
              <IconFileText size={16} style={{ color: 'var(--brand-accent)' }} />
              <span>Extracted from </span>
              <code
                className="px-1.5 py-0.5 rounded text-xs"
                style={{ background: 'var(--brand-bg)', color: 'var(--brand-text-muted)' }}
              >
                {filename}
              </code>
              <span style={{ color: 'var(--brand-text-muted)' }}>
                — {rawText.length.toLocaleString()} chars parsed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80"
                style={{ borderColor: 'rgba(0,0,0,0.15)', color: 'var(--brand-text)' }}
              >
                Start over
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                className="text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80"
                style={{
                  borderColor: 'var(--brand-accent-strong)',
                  color: 'var(--brand-accent-strong)',
                }}
              >
                Save as draft
              </button>
              <button
                type="button"
                onClick={onPublish}
                className="text-xs px-3 py-1.5 rounded-full font-medium text-white inline-flex items-center gap-1.5 transition hover:opacity-90"
                style={{ background: 'var(--brand-gradient)' }}
              >
                Publish to directory
                <IconArrowRight size={12} />
              </button>
            </div>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--brand-text-muted)' }}>
            Click any field below to edit before publishing. Same inline-edit pattern as the
            template — Claude will have made some guesses, especially around suggested role and
            references; review and tweak.
          </p>
          <ConsultantDetail consultant={draft} editable={true} onUpdate={onUpdate} />
        </>
      )}

      {/* Saved */}
      {phase === 'saved' && (
        <div
          className="rounded-xl p-5 flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.08)' }}
        >
          <IconCheck size={20} style={{ color: '#059669' }} />
          <div className="text-sm" style={{ color: '#065F46' }}>
            Saved. Redirecting to the consultant page...
          </div>
        </div>
      )}
    </main>
  )
}

function ensureUniqueId(c: Consultant): Consultant {
  const existing = getImportedConsultants().map((x) => x.id)
  if (!existing.includes(c.id) && c.id) return c
  const base = (c.id || `${c.firstName}-${c.surname}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')) || 'consultant'
  let candidate = base
  let n = 2
  while (existing.includes(candidate)) {
    candidate = `${base}-${n++}`
  }
  return { ...c, id: candidate }
}

function setAt<T>(obj: T, path: (string | number)[], value: any): T {
  if (path.length === 0) return value as T
  const [head, ...rest] = path
  const isArr = typeof head === 'number'
  const clone: any = isArr ? [...(obj as any)] : { ...(obj as any) }
  clone[head] = setAt(clone[head], rest, value)
  return clone as T
}
