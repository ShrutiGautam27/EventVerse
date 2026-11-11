// Safe localStorage helpers: never throw on missing / malformed data.
export function readJSON(key, fallback, validate = () => true) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const value = JSON.parse(raw)
    return validate(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full / blocked – ignore */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

// Original localStorage keys (unchanged)
export const KEYS = {
  user: 'eventverseUser',
  account: 'eventverseAccount',
  wishlist: 'eventverseWishlist',
  bookings: 'eventverseBookings',
  theme: 'eventverseTheme',
}
