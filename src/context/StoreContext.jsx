import { createContext, useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBooking as addBookingAction, setDraft as setDraftAction, toggleWishlistItem } from '../store/eventVerseSlice'
import { useToast } from './ToastContext'

// Compatibility adapter: existing components can keep using useStore() unchanged.
const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const dispatch = useDispatch()
  const { wishlist, bookings, draft } = useSelector((state) => state.eventVerse)
  const { showToast } = useToast()

  const toggleWishlist = useCallback((id) => {
    const wasSaved = wishlist.includes(id)
    dispatch(toggleWishlistItem(id))
    showToast(wasSaved ? 'Removed from wishlist.' : 'Event saved to wishlist ❤️')
  }, [dispatch, wishlist, showToast])

  const addBooking = useCallback((booking) => dispatch(addBookingAction(booking)), [dispatch])
  const setDraft = useCallback((value) => dispatch(setDraftAction(value)), [dispatch])

  return (
    <StoreContext.Provider value={{ wishlist, toggleWishlist, bookings, addBooking, draft, setDraft }}>
      {children}
    </StoreContext.Provider>
  )
}
