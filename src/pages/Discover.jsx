import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEventFeed } from '../services/eventFeed'
import EventCard from '../components/EventCard'

const CATEGORIES = ['Music', 'Comedy', 'Sports', 'Food', 'Technology', 'College', 'Workshops', 'Gaming', 'Cultural', 'Education']
const ZONES = ['Tricity', 'Panchkula', 'Mohali', 'Chandigarh']

export default function Discover() {
  // Home category cards / About location pills pre-set a filter via the URL (?category= / ?zone=)
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES.includes(params.get('category')) ? params.get('category') : 'All')
  const [zone, setZone] = useState(ZONES.includes(params.get('zone')) ? params.get('zone') : 'All')
  const [sort, setSort] = useState('date')
  const { events } = useEventFeed()

  // Re-apply presets if the URL changes while this page is already open
  useEffect(() => {
    const c = params.get('category')
    const z = params.get('zone')
    setCategory(CATEGORIES.includes(c) ? c : 'All')
    setZone(ZONES.includes(z) ? z : 'All')
  }, [params])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const list = events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      return matchesSearch && (category === 'All' || e.category === category) && (zone === 'All' || e.zone === zone)
    })
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'price') list.sort((a, b) => a.price - b.price)
    else list.sort((a, b) => new Date(a.date) - new Date(b.date))
    return list
  }, [search, category, zone, sort])

  return (
    <section id="eventsPage" className="page active">
      <div className="page-header">
        <div>
          <span className="eyebrow">DISCOVER</span>
          <h1>Find your next experience</h1>
          <p>Explore events happening across the district.</p>
        </div>
        <div className="results-count" id="resultsCount">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            id="searchInput"
            placeholder="Search events, artists, venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select id="categoryFilter" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select id="zoneFilter" value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Location">
          <option value="All">All Locations</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <select id="sortFilter" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="date">Upcoming</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      <div className="events-grid" id="allEvents">
        
        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '15px' }}></i>
            <h3>No events found</h3>
            <p>Try changing your search or filters, or check back when new events are announced.</p>
          </div>
        ) : (
          filtered.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </section>
  )
}
