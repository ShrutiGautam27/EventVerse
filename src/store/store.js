import { configureStore } from '@reduxjs/toolkit'
import eventVerseReducer from './eventVerseSlice'
import { KEYS, writeJSON } from '../utils/storage'

export const store = configureStore({
  reducer: { eventVerse: eventVerseReducer },
})

// Keep the existing EventVerse localStorage keys for backwards compatibility.
let previousWishlist = store.getState().eventVerse.wishlist
let previousBookings = store.getState().eventVerse.bookings
store.subscribe(() => {
  const { wishlist, bookings } = store.getState().eventVerse
  if (wishlist !== previousWishlist) {
    writeJSON(KEYS.wishlist, wishlist)
    previousWishlist = wishlist
  }
  if (bookings !== previousBookings) {
    writeJSON(KEYS.bookings, bookings)
    previousBookings = bookings
  }
})
