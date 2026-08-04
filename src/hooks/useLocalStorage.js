import { useEffect, useState } from 'react'

/**
 * Small localStorage-backed useState. Reads once on mount, writes on every
 * change. JSON.parse/stringify failures fall back to the initial value
 * rather than throwing, so a corrupted or pre-existing key never crashes
 * the app on load.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently,
      // the app still works for the current session.
    }
  }, [key, value])

  return [value, setValue]
}
