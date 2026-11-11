import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEventFeed } from '../services/eventFeed'
import { getUpcomingEvents } from '../utils/eventDates'
import WeatherBadge from '../components/WeatherBadge'
import { clearWeatherCache, getLocationForecast, getWeatherIcon } from '../utils/weather'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const LOCATIONS = ['Chandigarh', 'Panchkula', 'Mohali', 'Tricity']
const pad = (n) => String(n).padStart(2, '0')
const today = () => {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth() }
}
const dateString = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`

export default function Calendar() {
  const navigate = useNavigate()
  const { events } = useEventFeed()
  const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events])
  const [view, setView] = useState(today)
  const [selected, setSelected] = useState(null)
  const [location, setLocation] = useState('Chandigarh')
  const [forecast, setForecast] = useState({ status: 'loading' })
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let cancelled = false
    setForecast({ status: 'loading' })
    getLocationForecast(location).then((result) => {
      if (!cancelled) setForecast(result)
    })
    return () => { cancelled = true }
  }, [location, retry])

  const changeMonth = (dir) => {
    const d = new Date(view.year, view.month + dir, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }
  const title = new Date(view.year, view.month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const forecastByDate = useMemo(() => new Map((forecast.days || []).map((day) => [day.date, day])), [forecast])
  const selectedEvents = selected ? upcomingEvents.filter((e) => e.date === selected) : []
  const selectedWeather = selected ? forecastByDate.get(selected) : null
  const formattedDate = selected
    ? new Date(`${selected}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const retryWeather = () => {
    clearWeatherCache()
    setRetry((value) => value + 1)
  }

  return (
    <section id="calendarPage" className="page active">
      <div className="calendar-header">
        <div>
          <span className="section-eyebrow">EVENT CALENDAR · WEATHER</span>
          <h1>Events & Weather</h1>
          <p>Check the forecast at a glance and explore events by date.</p>
        </div>
        <label className="calendar-location-control">
          <span>Weather location</span>
          <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Choose weather location">
            {LOCATIONS.map((place) => <option value={place} key={place}>{place === 'Tricity' ? 'Tricity (Chandigarh)' : place}</option>)}
          </select>
        </label>
      </div>

      <div className="calendar-weather-status" aria-live="polite">
        {forecast.status === 'loading' && <span>🌤️ Loading live forecast for {location}…</span>}
        {forecast.status === 'error' && <span>Weather could not be loaded. <button type="button" onClick={retryWeather}>Try again</button></span>}
        {forecast.status === 'unavailable' && <span>{forecast.message || 'Weather forecast is unavailable.'} <button type="button" onClick={retryWeather}>Retry</button></span>}
        {forecast.status === 'ready' && <span>🌦️ Live forecast · {location} · Updated from Open-Meteo</span>}
      </div>

      <div className="calendar-wrapper">
        <div className="calendar-month-title" id="calendarMonthTitle">{title}</div>
        <div className="calendar-controls calendar-weather-controls">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><i className="fa-solid fa-chevron-left"></i></button>
          <button type="button" onClick={() => { setView(today()); setSelected(null) }}>Today</button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month"><i className="fa-solid fa-chevron-right"></i></button>
        </div>
        <div className="calendar-weekdays">{WEEKDAYS.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="calendar-grid" id="calendarGrid">
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} className="calendar-day empty" aria-hidden="true" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const date = dateString(view.year, view.month, day)
            const count = upcomingEvents.filter((event) => event.date === date).length
            const weather = forecastByDate.get(date)
            const isSelected = selected === date
            const isToday = date === dateString(today().year, today().month, new Date().getDate())
            return (
              <button
                type="button" key={date}
                className={`calendar-day ${count ? 'has-events' : ''} ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`.trim()}
                data-date={date} aria-pressed={isSelected}
                aria-label={`${date}${weather ? `, ${weather.description}, high ${weather.temperatureMax}, low ${weather.temperatureMin}` : ', forecast unavailable'}${count ? `, ${count} events` : ''}`}
                onClick={() => setSelected(date)}
              >
                <span className="calendar-number">{day}</span>
                {weather ? (
                  <span className="calendar-day-weather">
                    <span className="calendar-weather-emoji" aria-hidden="true">{getWeatherIcon(weather.code)}</span>
                    <span className="calendar-weather-temp">{Math.round(weather.temperatureMax)}° <span>/</span> {Math.round(weather.temperatureMin)}°</span>
                  </span>
                ) : <span className="calendar-weather-unavailable">{forecast.status === 'loading' ? '···' : '—'}</span>}
                {count > 0 && <span className="calendar-event-count">● {count} {count === 1 ? 'event' : 'events'}</span>}
              </button>
            )
          })}
        </div>
        <div className="calendar-legend"><span><i className="legend-event-dot" /> Event scheduled</span><span>High / low temperature</span><span>— Forecast unavailable</span></div>
      </div>

      <div className="calendar-events calendar-selected-panel" id="calendarEvents">
        {!selected && <div className="calendar-select-prompt"><span>📅</span><h2>Select a date</h2><p>Choose any date to see its weather forecast and scheduled events.</p></div>}
        {selected && (
          <>
            <div className="calendar-events-header">
              <span>YOUR DAY AT A GLANCE</span>
              <h2>{formattedDate}</h2>
            </div>
            <div className="calendar-selected-weather">
              {forecast.status === 'loading' && <p>🌤️ Loading weather details…</p>}
              {forecast.status === 'error' && <p>Weather details could not be loaded. <button type="button" onClick={retryWeather}>Retry</button></p>}
              {forecast.status === 'ready' && selectedWeather && (
                <div className="calendar-weather-detail">
                  <span className="calendar-detail-emoji" aria-hidden="true">{getWeatherIcon(selectedWeather.code)}</span>
                  <div className="calendar-detail-main"><strong>{selectedWeather.description}</strong><span>{location}</span></div>
                  <div className="calendar-detail-temp"><strong>{Math.round(selectedWeather.temperatureMax)}° / {Math.round(selectedWeather.temperatureMin)}°C</strong><span>High / Low</span></div>
                  {selectedWeather.rainProbability != null && <div className="calendar-detail-rain"><strong>🌧️ {selectedWeather.rainProbability}%</strong><span>Rain chance</span></div>}
                </div>
              )}
              {forecast.status === 'ready' && !selectedWeather && <p className="calendar-no-forecast">🌥️ Forecast not available for this date yet. Forecasts are limited to the next 16 days.</p>}
            </div>
            <div className="calendar-events-subheading"><h3>Events on this day</h3><span>{selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}</span></div>
            {selectedEvents.length === 0 ? (
              <div className="calendar-empty"><i className="fa-regular fa-calendar" /><h2>No events on this date</h2><p>Try another date to discover an event.</p></div>
            ) : (
              <div className="calendar-event-list">
                {selectedEvents.map((event) => (
                  <article key={event.id} className="calendar-event-card" role="link" tabIndex={0}
                    onClick={() => navigate(`/events/${event.id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/events/${event.id}`) } }}>
                    <img src={event.image} alt={event.title} />
                    <div><span>{event.category}</span><h3>{event.title}</h3>
                      <p><i className="fa-solid fa-location-dot" /> {event.venue}, {event.city}</p>
                      <p><i className="fa-regular fa-clock" /> {event.time}</p>
                      <WeatherBadge event={event} />
                      <span className="calendar-event-open">View event details <i className="fa-solid fa-arrow-right" /></span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
