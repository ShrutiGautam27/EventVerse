import { useEffect, useState } from 'react'
import { readJSON, removeKey, writeJSON } from '../utils/storage'

// State that is read safely from, and mirrored to, localStorage.
export function useLocalStorage(key, fallback, validate) {
  const [value, setValue] = useState(() => readJSON(key, fallback, validate))
  useEffect(() => {
    if (value === null || value === undefined) removeKey(key)
    else writeJSON(key, value)
  }, [key, value])
  return [value, setValue]
}
