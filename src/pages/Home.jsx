import { useNavigate } from 'react-router-dom'
import { useEventFeed } from '../services/eventFeed'
import { eventTimingLabel } from '../utils/eventDates'
import { useUI } from '../context/UIContext'
import { useHeroSlider } from '../hooks/useHeroSlider'
import EventCard from '../components/EventCard'

const CATEGORIES = [
  ['Music', 'music', 'fa-music', 'Concerts & live shows'],
  ['Comedy', 'comedy', 'fa-face-laugh', 'Laughs & entertainment'],
  ['Sports', 'sports', 'fa-trophy', 'Matches & tournaments'],
  ['Food', 'food', 'fa-utensils', 'Food & culinary experiences'],
  ['Technology', 'technology', 'fa-code', 'Tech & innovation events'],
  ['College', 'college', 'fa-graduation-cap', 'Campus & student events'],
  ['Workshops', 'workshops', 'fa-lightbulb', 'Workshops & seminars'],
  ['Gaming', 'gaming', 'fa-gamepad', 'Gaming & competitions'],
]

export default function Home() {
  const navigate = useNavigate()
  const { openChat } = useUI()
  const { events, warning } = useEventFeed()
  const { index, fading } = useHeroSlider(events.length)
  const hero = events.length ? events[index % events.length] : null
  const goEvents = () => navigate('/events')

  if (!hero) return <section id="homePage" className="page active"><div className="empty-state"><h2>No upcoming events right now</h2><p>Check back soon for new events across the Tricity.</p>{warning && <small>{warning}</small>}</div></section>

  const trending = [...events].sort((a, b) => { const dateDiff = new Date(a.date) - new Date(b.date); return dateDiff || (Number(b.rating || 0) - Number(a.rating || 0)) }).slice(0, 3)

  return (
    <section id="homePage" className="page active">
      {/* HERO */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-circle circle-one"></div>
          <div className="hero-circle circle-two"></div>
          <div className="hero-circle circle-three"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            DISTRICT EVENTS 2026
          </div>

          <h1>
            Discover. <span>Experience.</span> Remember.
          </h1>

          <p>
            Your one-stop platform to discover concerts, college fests, cultural celebrations, sports, workshops and
            unforgettable events across your district.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={goEvents}>
              Explore Events <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button className="secondary-btn" onClick={openChat}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Ask Eve
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>120+</strong>
              <span>Events</span>
            </div>
            <div>
              <strong>25+</strong>
              <span>Venues</span>
            </div>
            <div>
              <strong>15K+</strong>
              <span>Students</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">
          <div className="event-preview-card">
            <div className="preview-image">
              <img
                id="heroEventImage"
                src={hero.image}
                alt={hero.title}
                style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}
              />
              <span className="preview-live">
                <i className="fa-solid fa-circle"></i> LIVE EVENTS
              </span>
            </div>

            <div className="preview-content">
              <span className="event-category" id="heroEventCategory">
                {hero.category.toUpperCase()}
              </span>
              <h3 id="heroEventTitle">{hero.title}</h3>
              <p>
                <i className="fa-solid fa-location-dot"></i> <span id="heroEventVenue">{hero.venue}</span>
              </p>
              <div className="preview-bottom">
                <span>
                  <i className="fa-regular fa-calendar"></i> <span id="heroEventDate">{hero.displayDate}</span>
                </span>
                <span className="rating" id="heroEventRating">
                  ★ {hero.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="floating-card floating-one">
            <i className="fa-solid fa-users"></i>
            <div>
              <strong>2.4K+</strong>
              <small>Joined recently</small>
            </div>
          </div>

          <div className="floating-card floating-two">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <strong>25+</strong>
              <small>Venues nearby</small>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES (the original HTML nests the sections below inside this one – kept for identical spacing) */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <h2>Find your kind of experience</h2>
          </div>
          <button className="text-btn" onClick={goEvents}>
            View all <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="category-grid">
          {CATEGORIES.map(([name, cls, icon, text]) => (
            <button key={name} className="category-card" onClick={() => navigate(`/events?category=${name}`)}>
              <div className={`category-icon ${cls}`}>
                <i className={`fa-solid ${icon}`}></i>
              </div>
              <div>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            </button>
          ))}
        </div>

        {/* FEATURED EVENTS */}
        <section className="section light-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DON'T MISS OUT</span>
              <h2>Trending this week</h2>
            </div>
            <button className="text-btn" onClick={goEvents}>
              Explore all <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {warning && <p className="event-feed-note" role="status">{warning}</p>}
          <div className="events-grid" id="featuredEvents">
            {trending.map((event) => (
              <div className="event-card-wrap" key={event.id}><span className="event-timing-label">{eventTimingLabel(event)}</span><EventCard event={event} /></div>
            ))}
            {trending.length === 0 && <p>No upcoming events yet. Please check back soon.</p>}
          </div>
        </section>

        {/* DISTRICT EXPERIENCE */}
        <section className="district-section">
          <div className="district-content">
            <span className="eyebrow">YOUR DISTRICT</span>
            <h2>
              Events are closer
              <br />
              than you think.
            </h2>
            <p>From university campuses to city arenas, discover experiences happening around you.</p>

            <div className="district-points">
              <div>
                <i className="fa-solid fa-location-dot"></i>
                <span>Local venues</span>
              </div>
              <div>
                <i className="fa-solid fa-calendar-check"></i>
                <span>Real-time event discovery</span>
              </div>
              <div>
                <i className="fa-solid fa-ticket"></i>
                <span>Digital event passes</span>
              </div>
            </div>

            <div className="district-actions">
              <button className="primary-btn" onClick={goEvents}>
                Explore my district <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="secondary-btn district-map-link" onClick={() => navigate('/map')}>
                <i className="fa-solid fa-map-location-dot"></i> Open interactive map
              </button>
            </div>
          </div>

          <button type="button" className="district-map district-map-clickable" onClick={() => navigate('/map')} aria-label="Open interactive Tricity event map">
            <span className="district-map-open-label"><i className="fa-solid fa-up-right-from-square"></i> EXPLORE MAP</span>
            <div className="map-grid"></div>
            <div className="map-road road-one"></div>
            <div className="map-road road-two"></div>
            <div className="map-road road-three"></div>
            <div className="map-marker marker-one">
              <i className="fa-solid fa-music"></i>
            </div>
            <div className="map-marker marker-two">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div className="map-marker marker-three">
              <i className="fa-solid fa-masks-theater"></i>
            </div>
            <div className="map-center">
              <i className="fa-solid fa-location-dot"></i>
              <strong>CHITKARA</strong>
              <small>Event Zone</small>
            </div>
          </button>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div>
            <span className="eyebrow">READY?</span>
            <h2>
              Your next great memory
              <br />
              starts here.
            </h2>
            <p>Find an event. Pick your seat. Make it unforgettable.</p>
          </div>
          <button className="white-btn" onClick={goEvents}>
            Find an event <i className="fa-solid fa-arrow-right"></i>
          </button>
        </section>
      </section>
    </section>
  )
}
