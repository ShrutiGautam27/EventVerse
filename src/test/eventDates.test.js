import { describe, expect, it } from 'vitest'
import { getEventEnd, getUpcomingEvents, isEventUpcoming } from '../utils/eventDates'
import { dedupeEvents } from '../services/eventFeed'

const now = new Date('2026-10-26T12:00:00+05:30')

describe('event date utilities', () => {
  it('filters events whose end date has passed', () => {
    const list = [
      { id: 1, date: '2026-10-25' },
      { id: 2, date: '2026-10-26' },
      { id: 3, date: '2026-10-27' },
    ]
    expect(getUpcomingEvents(list, now).map((event) => event.id)).toEqual([2, 3])
  })

  it('keeps a multi-day event active until its actual end datetime', () => {
    const event = { date: '2026-10-25', time: '9:00 AM', endDate: '2026-10-27', endTime: '5:00 PM' }
    expect(isEventUpcoming(event, now)).toBe(true)
    expect(getEventEnd(event).toISOString()).toContain('2026-10-27')
    expect(isEventUpcoming(event, new Date('2026-10-28T00:00:00+05:30'))).toBe(false)
  })

  it('keeps date-only demo events visible through the event date', () => {
    expect(isEventUpcoming({ date: '2026-10-26' }, now)).toBe(true)
    expect(isEventUpcoming({ date: '2026-10-25' }, now)).toBe(false)
  })

  it('prevents duplicates by title, date, and venue', () => {
    const list = [
      { id: 'a', title: 'Tech Fest', date: '2026-11-01', venue: 'Campus' },
      { id: 'b', title: 'tech fest', date: '2026-11-01', venue: 'Campus' },
      { id: 'c', title: 'Tech Fest', date: '2026-11-02', venue: 'Campus' },
    ]
    expect(dedupeEvents(list).map((event) => event.id)).toEqual(['a', 'c'])
  })
})
