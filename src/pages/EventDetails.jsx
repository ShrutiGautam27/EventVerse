import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { events } from '../data/events'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import NotFound from './NotFound'
import { useEventFeed } from '../services/eventFeed'
import WeatherBadge from '../components/WeatherBadge'

const SEAT_COUNT = 48
const RESERVED_SEATS = [3, 7, 14, 19, 25, 31, 38, 45]
const MAX_SEATS = 6

function Details({ event }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setDraft } = useStore()
  const { showToast } = useToast()
  const [seats, setSeats] = useState([])

  const total = seats.length * event.price

  const selectSeat = (n) => {
    if (seats.includes(n)) return setSeats(seats.filter((s) => s !== n))
    if (seats.length >= MAX_SEATS) return showToast('You can select up to 6 seats.')
    setSeats([...seats, n])
  }

  const proceed = () => {
    if (seats.length === 0) return showToast('Please select at least one seat.')
    if (!user) {
      showToast('Please login before registering.')
      return navigate('/login')
    }
    setDraft({ eventId: event.id, seats })
    navigate(`/events/${event.id}/register`)
  }

  const meta = [
    ['fa-regular fa-calendar', 'Date', event.displayDate],
    ['fa-regular fa-clock', 'Time', event.time],
    ['fa-solid fa-location-dot', 'Venue', event.venue],
    ['fa-solid fa-user-group', 'Organizer', event.organizer],
  ]

  return (
    <section id="detailsPage" className="page active">
      <div id="eventDetails">
        <div className="details-container">
          <div className="details-image">
            <img src={event.image} alt={event.title} />
          </div>

          <div className="details-info">
            <button className="back-btn" onClick={() => navigate('/events')}>
              <i className="fa-solid fa-arrow-left"></i> Back to events
            </button>

            <span className="details-category">
              {event.category} · {event.zone} ZONE
            </span>
            <h1>{event.title}</h1>
            <p className="details-description">{event.description}</p>

            <div className="details-meta">
              {meta.map(([icon, label, value]) => (
                <div className="detail-meta-card" key={label}>
                  <i className={icon}></i>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <section className="event-detail-weather" aria-label="Event weather forecast">
              <div className="event-weather-heading">
                <span className="section-eyebrow">WEATHER FORECAST</span>
                <h2>Weather for your event</h2>
                <p>Forecast for {event.city} on {event.displayDate}.</p>
              </div>
              <WeatherBadge event={event} />
            </section>

            <div className="seat-section">
              <h2>Select your seats</h2>
              <div className="stage">STAGE</div>

              <div className="seat-grid">
                {Array.from({ length: SEAT_COUNT }, (_, i) => i + 1).map((n) => {
                  const reserved = RESERVED_SEATS.includes(n)
                  const selected = seats.includes(n)
                  return (
                    <button
                      key={n}
                      className={`seat ${reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`.trim()}
                      disabled={reserved}
                      aria-pressed={selected}
                      onClick={() => selectSeat(n)}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>

              <div className="seat-summary">
                <div className="total-price">
                  <strong id="seatTotal">{event.price === 0 ? 'FREE' : `₹${total}`}</strong>
                  <span id="seatCount">
                    {seats.length === 0 ? 'No seats selected' : `${seats.length} ${seats.length === 1 ? 'seat' : 'seats'} selected`}
                  </span>
                </div>
                <button className="primary-btn" onClick={proceed}>
                  Continue <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function EventDetails() {
  const { id } = useParams()
  const { events: liveEvents } = useEventFeed()
  const event = liveEvents.find((e) => String(e.id) === id) || events.find((e) => String(e.id) === id)
  if (!event) return <NotFound />
  // key => seat selection resets when a different event is opened (as in original openEvent)
  return <Details key={event.id} event={event} />
}
