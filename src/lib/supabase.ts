import { createClient } from '@supabase/supabase-js'
import type { Consultant } from '../data/types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anon) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in .env.local locally and in Vercel project settings for production. App will fall back to local seed.',
  )
}

export const supabase = url && anon ? createClient(url, anon) : null
export const supabaseConfigured = supabase !== null

// Row shape in Postgres (snake_case)
interface ConsultantRow {
  id: string
  status: 'draft' | 'active' | 'archived'
  first_name: string
  surname: string
  suggested_role: string
  current_title: string
  summary: string
  avatar: string
  video_url: string
  video_enabled: boolean
  contact: Consultant['contact']
  badges: Consultant['badges']
  availability: Consultant['availability']
  readiness: string[]
  industries: string[]
  skills: Consultant['skills']
  experience: Consultant['experience']
  education: Consultant['education']
  references_list: Consultant['references']
  created_at?: string
  updated_at?: string
}

export function rowToConsultant(r: ConsultantRow): Consultant {
  return {
    id: r.id,
    status: r.status,
    firstName: r.first_name,
    surname: r.surname,
    suggestedRole: r.suggested_role,
    currentRole: r.current_title,
    summary: r.summary,
    avatar: r.avatar || undefined,
    videoUrl: r.video_url,
    videoEnabled: r.video_enabled,
    contact: r.contact,
    badges: r.badges ?? [],
    availability: r.availability ?? { status: '', details: '' },
    readiness: r.readiness ?? [],
    industries: r.industries ?? [],
    skills: r.skills ?? [],
    experience: r.experience ?? [],
    education: r.education ?? [],
    references: r.references_list ?? [],
  }
}

export function consultantToRow(c: Consultant): Omit<ConsultantRow, 'created_at' | 'updated_at'> {
  return {
    id: c.id,
    status: c.status,
    first_name: c.firstName,
    surname: c.surname,
    suggested_role: c.suggestedRole ?? '',
    current_title: c.currentRole ?? '',
    summary: c.summary ?? '',
    avatar: c.avatar ?? '',
    video_url: c.videoUrl ?? '',
    video_enabled: c.videoEnabled ?? false,
    contact: c.contact,
    badges: c.badges ?? [],
    availability: c.availability ?? { status: '', details: '' },
    readiness: c.readiness ?? [],
    industries: c.industries ?? [],
    skills: c.skills ?? [],
    experience: c.experience ?? [],
    education: c.education ?? [],
    references_list: c.references ?? [],
  }
}
