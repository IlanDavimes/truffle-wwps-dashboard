import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const REVEAL_KEY = 'truffle-app-reveal'
const SESSION_MINUTES = 30
const LOCAL_PASSWORD = 'WWPS2026'

interface RevealContextValue {
  isRevealed: boolean
  showModal: boolean
  openModal: () => void
  closeModal: () => void
  submitPassword: (password: string) => boolean
  lock: () => void
}

const RevealContext = createContext<RevealContextValue | null>(null)

interface StoredReveal {
  expiresAt: number
}

function readStoredReveal(): StoredReveal | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(REVEAL_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredReveal
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(REVEAL_KEY)
      return null
    }
    return parsed
  } catch {
    window.localStorage.removeItem(REVEAL_KEY)
    return null
  }
}

export function RevealProvider({ children }: { children: ReactNode }) {
  const [isRevealed, setIsRevealed] = useState<boolean>(() => !!readStoredReveal())
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = readStoredReveal()
    if (!stored) {
      setIsRevealed(false)
      return
    }
    const timeUntilExpiry = stored.expiresAt - Date.now()
    if (timeUntilExpiry <= 0) {
      setIsRevealed(false)
      return
    }
    const timer = window.setTimeout(() => setIsRevealed(false), timeUntilExpiry)
    return () => window.clearTimeout(timer)
  }, [isRevealed])

  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => setShowModal(false), [])

  const submitPassword = useCallback((password: string) => {
    if (password === LOCAL_PASSWORD) {
      const expiresAt = Date.now() + SESSION_MINUTES * 60 * 1000
      window.localStorage.setItem(REVEAL_KEY, JSON.stringify({ expiresAt }))
      setIsRevealed(true)
      setShowModal(false)
      return true
    }
    return false
  }, [])

  const lock = useCallback(() => {
    window.localStorage.removeItem(REVEAL_KEY)
    setIsRevealed(false)
  }, [])

  return (
    <RevealContext.Provider
      value={{ isRevealed, showModal, openModal, closeModal, submitPassword, lock }}
    >
      {children}
    </RevealContext.Provider>
  )
}

export function useReveal() {
  const ctx = useContext(RevealContext)
  if (!ctx) throw new Error('useReveal must be used within RevealProvider')
  return ctx
}
