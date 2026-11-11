import { useEffect, useState } from 'react'
import { events as demoEvents } from '../data/events'
import { getUpcomingEvents } from '../utils/eventDates'

const REFRESH_MS = 10 * 60 * 1000
const FILTER_TICK_MS = 60 * 1000
const CACHE_KEY = 'eventverse.remote-events.v1'
let inFlight = null

function normalizeEvent(raw) {
  if (!raw || !raw.id || !raw.title || !(raw.date || raw.startDate) || !raw.venue || !raw.city) return null
  const date = raw.date || raw.startDate
  const title = String(raw.title).trim()
  if (!title) return null
  return {
    ...raw,
    id: raw.id,
    title,
    date,
    displayDate: raw.displayDate || new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: raw.category || 'Community',
    zone: raw.zone || raw.city,
    time: raw.time || 'Time to be announced',
    description: raw.description || 'See the official event page for details.',
    image: raw.image || '',
    sourceUrl: raw.sourceUrl || '',
    registrationUrl: raw.registrationUrl || raw.ticketUrl || '',
  }
}

export function dedupeEvents(list) {
  const seen = new Set()
  return list.filter((event) => {
    const key = `${event.title.toLowerCase()}|${event.date}|${String(event.venue).toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function fetchRemoteEvents() {
  if (inFlight) return inFlight
  inFlight = (async () => {
    try {
      const response = await fetch('/api/events', { headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(`Event provider returned ${response.status}`)
      const payload = await response.json()
      const items = Array.isArray(payload.events) ? payload.events : []
      const remote = items.map(normalizeEvent).filter(Boolean)
      const combined = dedupeEvents([...demoEvents.map(normalizeEvent).filter(Boolean), ...remote])
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), events: remote })) } catch { /* storage optional */ }
      return { events: getUpcomingEvents(combined), source: payload.source || 'configured provider', updatedAt: new Date().toISOString(), warning: null }
    } catch (error) {
      let cached = []
      try {
        const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
        if (Array.isArray(saved?.events)) cached = saved.events.map(normalizeEvent).filter(Boolean)
      } catch { /* invalid cache is ignored */ }
      return {
        events: getUpcomingEvents(dedupeEvents([...demoEvents.map(normalizeEvent).filter(Boolean), ...cached])),
        source: cached.length ? 'cached provider data + demo events' : 'demo events',
        updatedAt: null,
        warning: 'Live event feed is not configured or currently unavailable. Showing available demo/cached events.',
      }
    } finally { inFlight = null }
  })()
  return inFlight
}

export function useEventFeed() {
  const [state, setState] = useState(() => ({ events: getUpcomingEvents(demoEvents), source: 'demo events', updatedAt: null, warning: null, loading: true }))
  useEffect(() => {
    let active = true
    const refresh = async () => {
      const result = await fetchRemoteEvents()
      if (active) setState({ ...result, loading: false })
    }
    refresh()
    const timer = window.setInterval(refresh, REFRESH_MS)
    const filterTimer = window.setInterval(() => setState((current) => ({ ...current, events: getUpcomingEvents(current.events) })), FILTER_TICK_MS)
    const onFocus = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', onFocus)
    return () => { active = false; window.clearInterval(timer); window.clearInterval(filterTimer); document.removeEventListener('visibilitychange', onFocus) }
  }, [])
  return state
}

