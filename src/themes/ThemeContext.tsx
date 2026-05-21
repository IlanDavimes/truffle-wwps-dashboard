import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeName = 'truffle' | 'wwps'

interface ThemeContextValue {
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'truffle-app-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') return 'truffle'
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'wwps' ? 'wwps' : 'truffle'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (t: ThemeName) => setThemeState(t)
  const toggle = () => setThemeState((prev) => (prev === 'truffle' ? 'wwps' : 'truffle'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
