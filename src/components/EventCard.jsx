import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { priceLabel } from '../utils/format'
import WeatherBadge from './WeatherBadge'

export default function EventCard({ event }) {
  const navigate = useNavigate()
  const { wishlist, toggleWishlist } = useStore()
  const isSaved = wishlist.includes(event.id)

  return (
    <article className="event-card">
      <div className="event-card-image">
        <img src={event.image} alt={event.title} />
        <span className="event-card-category">{event.category}</span>
        <button
          className={`wishlist-btn ${isSaved ? 'active' : ''}`}
          onClick={() => toggleWishlist(event.id)}
          aria-label="Save event"
          aria-pressed={isSaved}
        >
          <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>

      <div className="event-card-content">
        <span className="event-date">{event.displayDate}</span>
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-meta">
          <span>
            <i className="fa-solid fa-location-dot"></i> {event.venue}
          </span>
          <span>
            <i className="fa-regular fa-clock"></i> {event.time}
          </span>
          <WeatherBadge event={event} />
          <span>
            <i className="fa-solid fa-star"></i> {event.rating} rating
          </span>
        </div>

        <div className="event-card-footer">
          <span className="event-price">
            {priceLabel(event.price)}
            {event.price > 0 && <small> onwards</small>}
          </span>
          <button className="view-event-btn" onClick={() => navigate(`/events/${event.id}`)}>
            Explore <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  )
}
