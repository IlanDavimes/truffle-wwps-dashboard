import type { Consultant } from '../data/types'
import { consultantToRow, rowToConsultant, supabase, supabaseConfigured } from './supabase'
import { consultants as localSeed } from '../data/consultants'

let seedAttempted = false

async function autoSeedIfEmpty(): Promise<void> {
  if (seedAttempted || !supabase) return
  seedAttempted = true
  const { count, error } = await supabase
    .from('consultants')
    .select('id', { count: 'exact', head: true })
  if (error) {
    console.warn('[repo] count failed:', error.message)
    return
  }
  if ((count ?? 0) > 0) return
  const activeRows = localSeed.filter((c) => c.status !== 'draft').map(consultantToRow)
  if (activeRows.length === 0) return
  const { error: insertError } = await supabase
    .from('consultants')
    .upsert(activeRows, { onConflict: 'id', ignoreDuplicates: true })
  if (insertError) {
    console.warn('[repo] seed insert failed:', insertError.message)
  } else {
    console.log('[repo] auto-seeded', activeRows.length, 'consultants')
  }
}

export async function fetchAllConsultants(): Promise<Consultant[]> {
  if (!supabaseConfigured || !supabase) {
    return localSeed
  }
  await autoSeedIfEmpty()
  const { data, error } = await supabase
    .from('consultants')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    console.warn('[repo] fetchAll failed, falling back to local seed:', error.message)
    return localSeed
  }
  const fromDb = (data ?? []).map(rowToConsultant)
  // Always include the local Template Consultant for the admin editor preview
  const template = localSeed.find((c) => c.id === 'template-consultant')
  if (template && !fromDb.some((c) => c.id === template.id)) {
    return [...fromDb, template]
  }
  return fromDb
}

export async function fetchConsultant(id: string): Promise<Consultant | null> {
  if (!supabaseConfigured || !supabase) {
    return localSeed.find((c) => c.id === id) ?? null
  }
  if (id === 'template-consultant') {
    return localSeed.find((c) => c.id === 'template-consultant') ?? null
  }
  const { data, error } = await supabase
    .from('consultants')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.warn('[repo] fetchOne failed:', error.message)
    return localSeed.find((c) => c.id === id) ?? null
  }
  return data ? rowToConsultant(data) : null
}

export async function upsertConsultant(c: Consultant): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    console.warn('[repo] Supabase not configured; upsert is a no-op')
    return
  }
  const row = consultantToRow(c)
  const { error } = await supabase
    .from('consultants')
    .upsert(row, { onConflict: 'id' })
  if (error) {
    throw new Error(`Save failed: ${error.message}`)
  }
}

export async function deleteConsultant(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) return
  const { error } = await supabase.from('consultants').delete().eq('id', id)
  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}
