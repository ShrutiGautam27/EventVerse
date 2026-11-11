import { useNavigate } from 'react-router-dom'
import { useEventFeed } from '../services/eventFeed'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import EventCard from '../components/EventCard'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { bookings, wishlist } = useStore()
  const { showToast } = useToast()
  const { events } = useEventFeed()
  const savedEvents = events.filter((e) => wishlist.includes(e.id))

  const onLogout = () => {
    logout()
    showToast('You have been logged out.')
    navigate('/')
  }

  return (
    <section id="dashboardPage" className="page active">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">MY EVENTVERSE</span>
          <h1 id="dashboardGreeting">Welcome back, {user.name} 👋</h1>
          <p>Manage your saved events and digital passes.</p>
        </div>
        <button className="secondary-btn" onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <i className="fa-solid fa-ticket"></i>
          <div>
            <strong id="passCount">{bookings.length}</strong>
            <span>My Passes</span>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-heart"></i>
          <div>
            <strong id="savedCount">{wishlist.length}</strong>
            <span>Saved Events</span>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-calendar-check"></i>
          <div>
            <strong>2026</strong>
            <span>Event Season</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR BOOKINGS</span>
            <h2>Digital Passes</h2>
          </div>
        </div>
        <div id="myPasses" className="passes-grid">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <h3>No passes yet 🎟</h3>
              <p>Register for an event to see your digital pass here.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div className="pass-card" key={b.id}>
                <span className="eyebrow">DIGITAL PASS</span>
                <h3>{b.eventTitle}</h3>
                <p>
                  {b.date} · {b.time}
                </p>
                <p>
                  <i className="fa-solid fa-location-dot"></i> {b.venue}
                </p>
                <div className="pass-card-footer">
                  <span>
                    Seats: <strong>{b.seats.join(', ')}</strong>
                  </span>
                  <button className="view-event-btn" onClick={() => navigate(`/ticket/${b.id}`)}>
                    View Pass
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SAVED FOR LATER</span>
            <h2>Wishlist</h2>
          </div>
        </div>
        <div id="wishlistEvents" className="events-grid">
          {savedEvents.length === 0 ? (
            <div className="empty-state">
              <h3>Your wishlist is empty ❤️</h3>
              <p>Save events you don't want to miss.</p>
            </div>
          ) : (
            savedEvents.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </div>
    </section>
  )
}
