const INDIA_TIME_ZONE = 'Asia/Kolkata'

function parseDateTime(date, time) {
  if (!date) return null
  const normalizedDate = String(date).trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    const parsed = new Date(normalizedDate)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (!time) return new Date(`${normalizedDate}T23:59:59+05:30`)
  const match = String(time).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i)
  if (!match) return new Date(`${normalizedDate}T23:59:59+05:30`)
  let hour = Number(match[1])
  const minute = Number(match[2] || 0)
  const meridiem = (match[3] || '').toUpperCase()
  if (meridiem === 'PM' && hour < 12) hour += 12
  if (meridiem === 'AM' && hour === 12) hour = 0
  if (hour > 23 || minute > 59) return new Date(`${normalizedDate}T23:59:59+05:30`)
  return new Date(`${normalizedDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`)
}

export function getEventEnd(event) {
  if (event.endDate) return parseDateTime(event.endDate, event.endTime || '11:59 PM')
  // Existing demo records only have a date and start time; keep them active through that local calendar day.
  return parseDateTime(event.date, '11:59 PM')
}

export function isEventUpcoming(event, now = new Date()) {
  const end = getEventEnd(event)
  return Boolean(end && end.getTime() >= now.getTime())
}

export function getUpcomingEvents(list, now = new Date()) {
  return list.filter((event) => isEventUpcoming(event, now))
}

export function eventTimingLabel(event, now = new Date()) {
  const date = event.date || event.startDate
  if (!date) return 'Upcoming'
  const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: INDIA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const parts = Object.fromEntries(todayParts.map((p) => [p.type, p.value]))
  const today = `${parts.year}-${parts.month}-${parts.day}`
  const tomorrowDate = new Date(`${today}T12:00:00+05:30`)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = new Intl.DateTimeFormat('en-CA', { timeZone: INDIA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrowDate)
  if (date === today) return 'Today'
  if (date === tomorrow) return 'Tomorrow'
  return 'Upcoming'
}
