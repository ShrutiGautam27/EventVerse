import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KEYS, readJSON, writeJSON } from '../utils/storage'

/*
 * DEMO AUTHENTICATION ONLY.
 * Like the original project, the account (including its password) is stored
 * in plain text in localStorage. This is NOT secure authentication.
 */
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const isUser = (v) => v && typeof v === 'object' && typeof v.name === 'string' && typeof v.email === 'string'

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(KEYS.user, null, isUser)

  const login = (email, password) => {
    const stored = readJSON(KEYS.account, null, isUser)
    if (!stored || stored.email !== email || stored.password !== password) return null
    const next = { name: stored.name, email: stored.email }
    setUser(next)
    return next
  }

  const signup = ({ name, email, password }) => {
    writeJSON(KEYS.account, { name, email, password })
    setUser({ name, email })
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}
