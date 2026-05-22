import { useEffect, useState } from 'react'
import { IconLoader2, IconMessageCircle, IconSend, IconTrash } from '@tabler/icons-react'
import {
  fetchComments,
  postComment,
  deleteComment,
  getStoredAuthorName,
  setStoredAuthorName,
  timeAgo,
  type Comment,
} from '../lib/comments'

export default function Comments({ consultantId }: { consultantId: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null)
  const [author, setAuthor] = useState<string>(() => getStoredAuthorName())
  const [body, setBody] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    fetchComments(consultantId)
      .then((c) => {
        if (!cancelled) setComments(c)
      })
      .catch(() => {
        if (!cancelled) setComments([])
      })
    return () => {
      cancelled = true
    }
  }, [consultantId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return
    setPosting(true)
    setError('')
    try {
      const newComment = await postComment(consultantId, author || 'Anonymous', body)
      setStoredAuthorName(author)
      if (newComment) {
        setComments((prev) => (prev ? [newComment, ...prev] : [newComment]))
      }
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setPosting(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(id)
      setComments((prev) => (prev ? prev.filter((c) => c.id !== id) : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const count = comments?.length ?? 0

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-10 py-6">
      <h3
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider mb-4"
        style={{ color: 'var(--brand-text-muted)' }}
      >
        <IconMessageCircle size={13} style={{ color: 'var(--brand-accent)' }} />
        Comments {count > 0 && <span style={{ opacity: 0.7 }}>· {count}</span>}
      </h3>

      <form
        onSubmit={submit}
        className="rounded-xl p-4 mb-4 border space-y-3"
        style={{
          background: 'var(--brand-bg-soft)',
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        <input
          type="text"
          placeholder="Your name (so others know who said this)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded outline-none"
          style={{
            background: 'var(--brand-bg)',
            borderColor: 'rgba(0,0,0,0.12)',
            color: 'var(--brand-text)',
          }}
        />
        <textarea
          placeholder="Leave a comment about this consultant — fit, follow-up notes, interview interest..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded outline-none resize-y"
          style={{
            background: 'var(--brand-bg)',
            borderColor: 'rgba(0,0,0,0.12)',
            color: 'var(--brand-text)',
          }}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
            Posted publicly. Truffle staff will see your comment.
          </span>
          <button
            type="submit"
            disabled={!body.trim() || posting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand-gradient)' }}
          >
            {posting ? <IconLoader2 size={12} className="animate-spin" /> : <IconSend size={12} />}
            {posting ? 'Posting...' : 'Post comment'}
          </button>
        </div>
        {error && (
          <p className="text-xs" style={{ color: '#B91C1C' }}>
            {error}
          </p>
        )}
      </form>

      {comments === null ? (
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
          <IconLoader2 size={13} className="animate-spin" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs italic" style={{ color: 'var(--brand-text-muted)' }}>
          No comments yet. Be the first.
        </p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg p-3 border group"
              style={{
                background: 'var(--brand-bg)',
                borderColor: 'rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: 'var(--brand-text)' }}>
                    {c.author_name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                    {timeAgo(c.created_at)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  title="Delete comment"
                  className="opacity-0 group-hover:opacity-100 transition text-xs"
                  style={{ color: 'var(--brand-text-muted)' }}
                >
                  <IconTrash size={13} />
                </button>
              </div>
              <p
                className="text-sm whitespace-pre-wrap"
                style={{ color: 'var(--brand-text)', lineHeight: 1.55 }}
              >
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
