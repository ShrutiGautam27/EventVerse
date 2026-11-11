import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEventFeed } from '../services/eventFeed'

const AREAS = [
  { id: 'chandigarh', name: 'Chandigarh', kind: 'area', lat: 30.7333, lng: 76.7794, detail: 'City centre · Chandigarh' },
  { id: 'panchkula', name: 'Panchkula', kind: 'area', lat: 30.6942, lng: 76.8606, detail: 'Panchkula city centre' },
  { id: 'mohali', name: 'Mohali', kind: 'area', lat: 30.7046, lng: 76.7179, detail: 'SAS Nagar · Mohali' },
]

const CITY_CENTRES = {
  Chandigarh: [30.7333, 76.7794],
  Panchkula: [30.6942, 76.8606],
  Mohali: [30.7046, 76.7179],
  Tricity: [30.7333, 76.7794],
}

function venueCoordinates(event, index) {
  const venue = `${event.venue} ${event.city} ${event.zone}`.toLowerCase()
  // Use known local landmarks/sectors where the event data identifies one.
  if (venue.includes('chitkara')) return [30.5162, 76.6595] // Chitkara University, Rajpura campus area
  if (venue.includes('panjab university')) return [30.7617, 76.7680]
  if (venue.includes('sector 17')) return [30.7410, 76.7828]
  if (venue.includes('sector 35')) return [30.7185, 76.7505]
  if (venue.includes('sector 42')) return [30.7198, 76.7398]

  const city = event.city === 'Tricity' ? (event.zone === 'Panchkula' ? 'Panchkula' : event.zone === 'Mohali' ? 'Mohali' : 'Chandigarh') : event.city
  const [lat, lng] = CITY_CENTRES[city] || CITY_CENTRES.Chandigarh
  // Venue records don't include street addresses or coordinates. Keep unknown venues near their city centre,
  // with small deterministic offsets so pins remain selectable instead of stacking exactly on top of one another.
  const angle = (index * 137.5 * Math.PI) / 180
  const radius = 0.003 + (index % 4) * 0.002
  return [lat + Math.sin(angle) * radius, lng + Math.cos(angle) * radius * 1.25]
}


function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L)
  if (window.__eventVerseLeafletPromise) return window.__eventVerseLeafletPromise

  window.__eventVerseLeafletPromise = new Promise((resolve, reject) => {
    const cssHref = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    if (!document.querySelector('link[data-eventverse-leaflet]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssHref
      link.dataset.eventverseLeaflet = 'true'
      document.head.appendChild(link)
    }

    const existing = document.querySelector('script[data-eventverse-leaflet]')
    if (existing) {
      existing.addEventListener('load', () => window.L ? resolve(window.L) : reject(new Error('Map library did not initialize.')), { once: true })
      existing.addEventListener('error', () => reject(new Error('Could not load the map library. Check your internet connection.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.dataset.eventverseLeaflet = 'true'
    script.onload = () => window.L ? resolve(window.L) : reject(new Error('Map library did not initialize.'))
    script.onerror = () => reject(new Error('Could not load the map library. Check your internet connection.'))
    document.head.appendChild(script)
  }).catch((error) => {
    window.__eventVerseLeafletPromise = null
    throw error
  })

  return window.__eventVerseLeafletPromise
}

export default function MapPage() {
  const navigate = useNavigate()
  const { events } = useEventFeed()
  const eventPoints = useMemo(() => events.map((event, index) => {
    const coordinates = event.lat != null && event.lng != null ? [Number(event.lat), Number(event.lng)] : venueCoordinates(event, index)
    return { ...event, kind: 'event', lat: coordinates[0], lng: coordinates[1] }
  }), [events])
  const mapElement = useRef(null)
  const mapInstance = useRef(null)
  const layerGroup = useRef(null)
  const [showAreas, setShowAreas] = useState(true)
  const [showVenues, setShowVenues] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [mapStatus, setMapStatus] = useState('loading')
  const [mapError, setMapError] = useState('')
  const [retry, setRetry] = useState(0)

  const filteredEvents = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return eventPoints.filter((event) => !needle || `${event.title} ${event.venue} ${event.city} ${event.category}`.toLowerCase().includes(needle))
  }, [query, eventPoints])

  useEffect(() => {
    if (selected?.kind === 'event' && !eventPoints.some((event) => event.id === selected.id)) setSelected(null)
  }, [eventPoints, selected])

  useEffect(() => {
    let cancelled = false
    let resizeObserver
    loadLeaflet().then((L) => {
      if (cancelled || !mapElement.current) return
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapElement.current, { scrollWheelZoom: true, zoomControl: true }).setView([30.719, 76.779], 11)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current)
        layerGroup.current = L.layerGroup().addTo(mapInstance.current)
      }
      setMapStatus('ready')
      setMapError('')
      const map = mapInstance.current
      const layers = layerGroup.current
      layers.clearLayers()
      const visiblePoints = [
        ...(showAreas ? AREAS : []),
        ...(showVenues ? filteredEvents : []),
      ]
      const bounds = []

      AREAS.filter(() => showAreas).forEach((area) => {
        const marker = L.circleMarker([area.lat, area.lng], {
          radius: 10, color: '#ffffff', weight: 2, fillColor: '#7357ff', fillOpacity: 0.98,
        }).addTo(layers)
        marker.bindTooltip(area.name, { direction: 'top', offset: [0, -8] })
        marker.bindPopup(`<div class="ev-map-popup"><span class="ev-map-popup-kicker">TRICITY AREA</span><strong>${escapeHtml(area.name)}</strong><p>${escapeHtml(area.detail)}</p><span class="ev-map-popup-note">Explore nearby event venues on the map.</span></div>`)
        marker.on('click', () => setSelected({ ...area, coordinates: [area.lat, area.lng] }))
        bounds.push([area.lat, area.lng])
      })

      filteredEvents.filter(() => showVenues).forEach((event) => {
        const icon = L.divIcon({
          className: 'ev-map-marker-wrap',
          html: `<span class="ev-map-marker-pin" aria-hidden="true"><i class="fa-solid fa-ticket"></i></span>`,
          iconSize: [30, 36],
          iconAnchor: [15, 32],
        })
        const marker = L.marker([event.lat, event.lng], { icon }).addTo(layers)
        marker.bindTooltip(event.title, { direction: 'top', offset: [0, -28] })
        marker.bindPopup(`<div class="ev-map-popup"><span class="ev-map-popup-kicker">${escapeHtml(event.category.toUpperCase())} · EVENT VENUE</span><strong>${escapeHtml(event.title)}</strong><p><i class="fa-solid fa-location-dot"></i> ${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</p><p><i class="fa-regular fa-calendar"></i> ${escapeHtml(event.displayDate)} · ${escapeHtml(event.time)}</p><button type="button" class="ev-map-popup-button" data-event-id="${Number(event.id)}">View event details <span>→</span></button></div>`)
        marker.on('click', () => setSelected({ ...event, coordinates: [event.lat, event.lng] }))
        marker.on('popupopen', (popupEvent) => {
          const button = popupEvent.popup.getElement()?.querySelector('[data-event-id]')
          button?.addEventListener('click', () => navigate(`/events/${event.id}`), { once: true })
        })
        bounds.push([event.lat, event.lng])
      })

      if (bounds.length && !selected) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 })
      else if (selected?.coordinates) map.setView(selected.coordinates, Math.max(map.getZoom(), 13))
      window.setTimeout(() => map.invalidateSize(), 100)
      if (window.ResizeObserver && mapElement.current) {
        resizeObserver = new ResizeObserver(() => map.invalidateSize())
        resizeObserver.observe(mapElement.current)
      }
    }).catch((error) => {
      if (!cancelled) {
        setMapStatus('error')
        setMapError(error.message || 'The interactive map could not be loaded.')
      }
    })

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
    }
  }, [showAreas, showVenues, filteredEvents, retry]) // map instance/layers persist between filter changes

  useEffect(() => () => {
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
      layerGroup.current = null
    }
  }, [])

  const focusPoint = (point) => {
    setSelected({ ...point, coordinates: [point.lat, point.lng] })
    if (mapInstance.current) mapInstance.current.setView([point.lat, point.lng], 14, { animate: true })
  }

  return (
    <section className="page active ev-map-page">
      <header className="ev-map-header">
        <div>
          <span className="section-eyebrow">EXPLORE THE TRICITY</span>
          <h1>Find your next <span>experience.</span></h1>
          <p>Explore Chandigarh, Panchkula and Mohali, then tap a pin to discover event venues.</p>
        </div>
        <div className="ev-map-summary"><strong>{eventPoints.length}</strong><span>events mapped</span><i className="fa-solid fa-location-dot" /></div>
      </header>

      <div className="ev-map-toolbar">
        <label className="ev-map-search"><i className="fa-solid fa-magnifying-glass" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, venues or areas…" aria-label="Search map events" /><kbd>⌕</kbd></label>
        <div className="ev-map-filters" aria-label="Map layers">
          <label><input type="checkbox" checked={showAreas} onChange={(e) => setShowAreas(e.target.checked)} /><span className="ev-map-filter-dot area-dot" /> City areas</label>
          <label><input type="checkbox" checked={showVenues} onChange={(e) => setShowVenues(e.target.checked)} /><span className="ev-map-filter-dot venue-dot" /> Event venues</label>
        </div>
      </div>

      <div className="ev-map-layout">
        <div className="ev-map-frame">
          <div ref={mapElement} className="ev-leaflet-map" aria-label="Interactive map of Chandigarh, Panchkula, Mohali and event venues" />
          {mapStatus === 'loading' && <div className="ev-map-overlay"><span className="ev-map-loader" /><strong>Preparing your map…</strong><span>Loading the interactive Tricity map</span></div>}
          {mapStatus === 'error' && <div className="ev-map-overlay ev-map-error"><span>🗺️</span><strong>Map could not load</strong><span>{mapError}</span><button type="button" onClick={() => { setMapStatus('loading'); setRetry((value) => value + 1) }}>Try again</button><small>Check your internet connection; map tiles and the map library load online.</small></div>}
          <div className="ev-map-attribution-note">Map data © OpenStreetMap contributors</div>
        </div>

        <aside className="ev-map-sidebar">
          <div className="ev-map-sidebar-head"><div><span className="section-eyebrow">MAP DIRECTORY</span><h2>{query ? 'Search results' : 'Around the Tricity'}</h2></div><span className="ev-map-result-count">{(showVenues ? filteredEvents.length : 0) + (showAreas ? AREAS.length : 0)}</span></div>
          {showAreas && <div className="ev-map-area-list">
            {AREAS.filter((area) => !query || area.name.toLowerCase().includes(query.toLowerCase())).map((area) => <button type="button" className={`ev-map-list-item ev-map-area-item ${selected?.id === area.id ? 'is-active' : ''}`} key={area.id} onClick={() => focusPoint(area)}><span className="ev-map-area-symbol"><i className="fa-solid fa-city" /></span><span className="ev-map-list-copy"><strong>{area.name}</strong><small>{area.detail}</small></span><i className="fa-solid fa-arrow-up-right-from-square ev-map-list-arrow" /></button>)}
          </div>}
          {showVenues && <div className="ev-map-venue-list">
            {filteredEvents.length === 0 ? <div className="ev-map-no-results">No upcoming events match that search. Try another area or check back later.</div> : filteredEvents.map((event) => <button type="button" className={`ev-map-list-item ${selected?.id === event.id ? 'is-active' : ''}`} key={event.id} onClick={() => focusPoint(event)}><span className="ev-map-venue-symbol"><i className="fa-solid fa-ticket" /></span><span className="ev-map-list-copy"><strong>{event.title}</strong><small><i className="fa-solid fa-location-dot" /> {event.venue} · {event.city}</small><small><i className="fa-regular fa-calendar" /> {event.displayDate}</small></span><i className="fa-solid fa-chevron-right ev-map-list-arrow" /></button>)}
          </div>}
          {!showAreas && !showVenues && <div className="ev-map-no-results">Turn on a map layer to explore locations.</div>}
          <p className="ev-map-data-note"><i className="fa-solid fa-circle-info" /> Some event records contain only a venue name and city, not an exact street address. Those pins are approximate city/area locations.</p>
        </aside>
      </div>

      {selected && <section className="ev-map-selected-card" aria-live="polite"><div className="ev-map-selected-icon"><i className={`fa-solid ${selected.kind === 'area' ? 'fa-city' : 'fa-ticket'}`} /></div><div className="ev-map-selected-copy"><span>{selected.kind === 'area' ? 'TRICITY AREA' : `${selected.category} · EVENT VENUE`}</span><h2>{selected.name || selected.title}</h2><p><i className="fa-solid fa-location-dot" /> {selected.kind === 'area' ? selected.detail : `${selected.venue}, ${selected.city}`}</p>{selected.kind === 'event' && <p><i className="fa-regular fa-calendar" /> {selected.displayDate} · {selected.time}</p>}</div>{selected.kind === 'event' && <button type="button" className="primary-btn" onClick={() => navigate(`/events/${selected.id}`)}>View event <i className="fa-solid fa-arrow-right" /></button>}<button type="button" className="ev-map-clear-selection" onClick={() => setSelected(null)} aria-label="Clear selected map location"><i className="fa-solid fa-xmark" /></button></section>}
    </section>
  )
}
