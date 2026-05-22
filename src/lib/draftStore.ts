import type { Consultant } from '../data/types'

const STORAGE_KEY = 'truffle-app-imported-consultants'

export function getImportedConsultants(): Consultant[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Consultant[]
  } catch {
    return []
  }
}

export function saveImportedConsultant(consultant: Consultant): void {
  const all = getImportedConsultants()
  const idx = all.findIndex((c) => c.id === consultant.id)
  if (idx >= 0) all[idx] = consultant
  else all.push(consultant)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function deleteImportedConsultant(id: string): void {
  const all = getImportedConsultants().filter((c) => c.id !== id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

const API_KEY_STORAGE = 'truffle-app-anthropic-key'

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(API_KEY_STORAGE) ?? ''
}

export function setStoredApiKey(key: string): void {
  if (key) window.localStorage.setItem(API_KEY_STORAGE, key)
  else window.localStorage.removeItem(API_KEY_STORAGE)
}
