import { afterEach, beforeEach, vi } from 'vitest'
import { clearWeatherCache } from '../utils/weather'

beforeEach(() => {
  localStorage.clear()
  document.body.className = ''
  clearWeatherCache()
  window.scrollTo = vi.fn()
  window.print = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
