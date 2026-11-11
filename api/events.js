// Vercel serverless endpoint. Configure TICKETMASTER_API_KEY in deployment environment variables.
const CITY_COORDINATES = { Chandigarh: '30.7333,76.7794', Panchkula: '30.6942,76.8606', Mohali: '30.7046,76.7179' }
const CATEGORY_MAP = { 'Music': 'Music', 'Arts & Theatre': 'Arts & Theatre', 'Sports': 'Sports', 'Miscellaneous': 'Community' }

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const apiKey = process.env.TICKETMASTER_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Event provider is not configured', events: [], source: 'unconfigured' })
  try {
    const groups = await Promise.all(Object.entries(CITY_COORDINATES).map(async ([city, coordinates]) => {
      const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json')
      url.search = new URLSearchParams({ apikey: apiKey, latlong: coordinates, radius: '35', unit: 'km', sort: 'date,asc', size: '50', startDateTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') }).toString()
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Ticketmaster request failed (${response.status})`)
      const data = await response.json()
      return (data._embedded?.events || []).map((item) => {
        const venue = item._embedded?.venues?.[0]
        const start = item.dates?.start?.dateTime || (item.dates?.start?.localDate ? `${item.dates.start.localDate}T23:59:00` : null)
        if (!start || !venue?.name) return null
        const date = item.dates?.start?.localDate || start.slice(0, 10)
        const cityName = venue.city?.name || city
        const time = item.dates?.start?.localTime ? new Date(`1970-01-01T${item.dates.start.localTime}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : 'Time to be announced'
        return {
          id: `tm-${item.id}`, title: item.name, description: item.info || item.pleaseNote || 'See the official event page for details.',
          category: CATEGORY_MAP[item.classifications?.[0]?.segment?.name] || item.classifications?.[0]?.segment?.name || 'Community',
          date, displayDate: new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          time, venue: venue.name, city: cityName, zone: city, lat: venue.location?.latitude ? Number(venue.location.latitude) : undefined,
          lng: venue.location?.longitude ? Number(venue.location.longitude) : undefined,
          image: item.images?.find((img) => img.ratio === '16_9')?.url || item.images?.[0]?.url || '',
          sourceUrl: item.url || '', registrationUrl: item.url || '',
          endDate: item.dates?.end?.localDate || item.dates?.end?.dateTime?.slice(0, 10) || undefined, endTime: item.dates?.end?.dateTime ? new Date(item.dates.end.dateTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : undefined,
        }
      }).filter(Boolean)
    }))
    const unique = new Map()
    groups.flat().forEach((event) => unique.set(event.id, event))
    return res.status(200).json({ events: [...unique.values()], source: 'Ticketmaster Discovery API', updatedAt: new Date().toISOString() })
  } catch (error) {
    return res.status(502).json({ error: 'Could not fetch events from provider', events: [], source: 'Ticketmaster Discovery API' })
  }
}
