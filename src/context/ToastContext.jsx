import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: 'Done!', show: false })
  const timer = useRef()

  const showToast = useCallback((message) => {
    setToast({ message, show: true })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>
}
