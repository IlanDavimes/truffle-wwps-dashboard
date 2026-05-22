const KEY = 'truffle-app-shortlist'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function write(ids: string[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(ids))
}

export function getShortlist(): string[] {
  return read()
}

export function isShortlisted(id: string): boolean {
  return read().includes(id)
}

export function toggleShortlist(id: string): boolean {
  const list = read()
  const idx = list.indexOf(id)
  if (idx === -1) {
    list.push(id)
    write(list)
    return true
  }
  list.splice(idx, 1)
  write(list)
  return false
}
