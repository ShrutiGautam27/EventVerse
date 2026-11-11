import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)
export const useUI = () => useContext(UIContext)

export function UIProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <UIContext.Provider
      value={{
        menuOpen,
        toggleMenu: () => setMenuOpen((o) => !o),
        closeMenu: () => setMenuOpen(false),
        chatOpen,
        openChat: () => setChatOpen(true),
        closeChat: () => setChatOpen(false),
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
