import { supabase, supabaseConfigured } from './supabase'
import type { Consultant } from '../data/types'

interface OverrideRow {
  showcase_key: string
  consultant_id: string
  data: Partial<Consultant> & { rfpNotes?: string }
  updated_at?: string
}

export async function fetchShowcaseOverrides(
  showcaseKey: string,
): Promise<Map<string, Partial<Consultant> & { rfpNotes?: string }>> {
  const out = new Map<string, Partial<Consultant> & { rfpNotes?: string }>()
  if (!supabaseConfigured || !supabase) return out
  const { data, error } = await supabase
    .from('showcase_overrides')
    .select('consultant_id,data')
    .eq('showcase_key', showcaseKey)
  if (error) {
    console.warn('[showcaseRepo] fetch failed:', error.message)
    return out
  }
  ;(data ?? []).forEach((row: any) => {
    out.set(row.consultant_id as string, row.data ?? {})
  })
  return out
}

export async function upsertShowcaseOverride(
  showcaseKey: string,
  consultantId: string,
  data: Partial<Consultant> & { rfpNotes?: string },
): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }
  const row: OverrideRow = {
    showcase_key: showcaseKey,
    consultant_id: consultantId,
    data,
  }
  const { error } = await supabase
    .from('showcase_overrides')
    .upsert(row, { onConflict: 'showcase_key,consultant_id' })
  if (error) throw new Error(`Save failed: ${error.message}`)
}

export function mergeConsultantWithOverride(
  base: Consultant,
  override: (Partial<Consultant> & { rfpNotes?: string }) | undefined,
): Consultant & { rfpNotes?: string } {
  if (!override) return base
  return {
    ...base,
    ...override,
    contact: { ...base.contact, ...(override.contact ?? {}) },
    availability: { ...base.availability, ...(override.availability ?? {}) },
    badges: override.badges ?? base.badges,
    readiness: override.readiness ?? base.readiness,
    industries: override.industries ?? base.industries,
    skills: override.skills ?? base.skills,
    experience: override.experience ?? base.experience,
    education: override.education ?? base.education,
    references: override.references ?? base.references,
  }
}
