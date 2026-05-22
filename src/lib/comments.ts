import { supabase, supabaseConfigured } from './supabase'

export interface Comment {
  id: string
  consultant_id: string
  author_name: string
  body: string
  created_at: string
}

const AUTHOR_KEY = 'truffle-app-comment-author'

export function getStoredAuthorName(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(AUTHOR_KEY) ?? ''
}

export function setStoredAuthorName(name: string): void {
  if (name.trim()) {
    window.localStorage.setItem(AUTHOR_KEY, name.trim())
  }
}

export async function fetchComments(consultantId: string): Promise<Comment[]> {
  if (!supabaseConfigured || !supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('consultant_id', consultantId)
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[comments] fetch failed:', error.message)
    return []
  }
  return (data ?? []) as Comment[]
}

export async function postComment(
  consultantId: string,
  authorName: string,
  body: string,
): Promise<Comment | null> {
  if (!supabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('comments')
    .insert({
      consultant_id: consultantId,
      author_name: authorName.trim() || 'Anonymous',
      body: body.trim(),
    })
    .select()
    .maybeSingle()
  if (error) {
    throw new Error(`Comment post failed: ${error.message}`)
  }
  return (data as Comment) ?? null
}

export async function deleteComment(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) return
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const sec = Math.round((now - then) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const yr = Math.round(mo / 12)
  return `${yr} year${yr === 1 ? '' : 's'} ago`
}
