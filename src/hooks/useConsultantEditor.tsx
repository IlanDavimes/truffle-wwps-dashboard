import { useCallback, useEffect, useState } from 'react'
import type { Consultant } from '../data/types'

const STORAGE_PREFIX = 'truffle-app-draft-'

type Path = (string | number)[]

function getAt(obj: any, path: Path): any {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

function setAt<T>(obj: T, path: Path, value: any): T {
  if (path.length === 0) return value
  const [head, ...rest] = path
  const isArrayIndex = typeof head === 'number'
  const clone: any = isArrayIndex ? [...(obj as any)] : { ...(obj as any) }
  clone[head] = setAt(clone[head], rest, value)
  return clone as T
}

export function useConsultantEditor(initial: Consultant) {
  const storageKey = STORAGE_PREFIX + initial.id
  const [data, setData] = useState<Consultant>(() => {
    if (typeof window === 'undefined') return initial
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return initial
    try {
      return JSON.parse(stored) as Consultant
    } catch {
      return initial
    }
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
  }, [data, storageKey])

  const update = useCallback((path: Path, value: any) => {
    setData((prev) => setAt(prev, path, value))
  }, [])

  const reset = useCallback(() => {
    window.localStorage.removeItem(storageKey)
    setData(initial)
  }, [initial, storageKey])

  const get = useCallback((path: Path) => getAt(data, path), [data])

  return { data, update, reset, get }
}
