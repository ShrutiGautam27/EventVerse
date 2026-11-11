import { createSlice } from '@reduxjs/toolkit'
import { KEYS, readJSON } from '../utils/storage'

const isIdList = (value) => Array.isArray(value) && value.every((id) => typeof id === 'number')
const isBookingList = (value) =>
  Array.isArray(value) && value.every((booking) => booking && typeof booking.id === 'string' && Array.isArray(booking.seats))

const eventVerseSlice = createSlice({
  name: 'eventVerse',
  initialState: {
    wishlist: readJSON(KEYS.wishlist, [], isIdList),
    bookings: readJSON(KEYS.bookings, [], isBookingList),
    // Selected seats are temporary and are intentionally not persisted.
    draft: null,
  },
  reducers: {
    toggleWishlistItem(state, action) {
      const id = action.payload
      const index = state.wishlist.indexOf(id)
      if (index >= 0) state.wishlist.splice(index, 1)
      else state.wishlist.push(id)
    },
    addBooking(state, action) {
      state.bookings.push(action.payload)
    },
    setDraft(state, action) {
      state.draft = action.payload
    },
  },
})

export const { toggleWishlistItem, addBooking, setDraft } = eventVerseSlice.actions
export default eventVerseSlice.reducer
