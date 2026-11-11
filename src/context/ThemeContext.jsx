import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { KEYS } from '../utils/storage'

const ThemeContext = createContext(null)
export const useTheme = () => useContext(ThemeContext)

function savedTheme() {
  try {
    return localStorage.getItem(KEYS.theme) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(savedTheme)

  // useLayoutEffect => class is applied before first paint (no light flash)
  useLayoutEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(KEYS.theme, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
