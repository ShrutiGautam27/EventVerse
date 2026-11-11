import { useNavigate } from 'react-router-dom'

const STATS = [
  ['fa-calendar-days', '22+', 'Events'],
  ['fa-layer-group', '10', 'Categories'],
  ['fa-location-dot', '4', 'Locations'],
  ['fa-bolt', '1', 'Platform'],
]

const FEATURES = [
  ['fa-solid fa-compass', 'Smart Discovery', 'Explore events by category, location and your interests without endless searching.'],
  ['fa-solid fa-location-crosshairs', 'Tricity Focused', "Discover what's happening across Chandigarh, Panchkula, Mohali and the Tricity."],
  ['fa-solid fa-ticket', 'Digital Passes', 'Keep your registered events and digital passes organized in one convenient place.'],
  [
    'fa-solid fa-calendar-days',
    'Event Calendar',
    'View upcoming events on a simple calendar, spot event dates instantly and explore everything happening across the Tricity.',
    true,
  ],
  ['fa-regular fa-heart', 'Save for Later', "Wishlist the events you're interested in and come back whenever you're ready."],
  ['fa-solid fa-cloud-sun', 'Event-Day Weather', 'Check the expected weather for your event location whenever a forecast is available.'],
  ['fa-solid fa-wand-magic-sparkles', 'Easy Experience', 'Less searching, less confusion and more time enjoying the events you love.'],
]

const STEPS = [
  ['01', 'fa-compass', 'Discover', 'Browse events by category, location and interests.'],
  ['02', 'fa-magnifying-glass', 'Explore', 'Check event details, venue, date, price and rating.'],
  ['03', 'fa-ticket', 'Register', 'Choose your event and complete your registration.'],
  ['04', 'fa-face-smile', 'Experience', 'Use your digital pass and enjoy the event.'],
]

const INTERESTS = [
  ['music', 'fa-music', 'Music'],
  ['comedy', 'fa-face-laugh', 'Comedy'],
  ['sports', 'fa-futbol', 'Sports'],
  ['food', 'fa-utensils', 'Food'],
  ['tech', 'fa-microchip', 'Technology'],
  ['college', 'fa-graduation-cap', 'College'],
  ['workshop', 'fa-lightbulb', 'Workshops'],
  ['gaming', 'fa-gamepad', 'Gaming'],
  ['cultural', 'fa-palette', 'Cultural'],
  ['education', 'fa-book-open', 'Education'],
]

const PILLS = ['Chandigarh', 'Panchkula', 'Mohali', 'Tricity']

export default function About() {
  const navigate = useNavigate()
  const goEvents = () => navigate('/events')

  return (
    <section id="aboutPage" className="page active">
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">THE EVENTVERSE EXPERIENCE</span>
          <h1>
            Discover. <span>Experience.</span> Remember.
          </h1>
          <p>
            EventVerse brings events, experiences and communities across Chandigarh, Panchkula, Mohali and the Tricity
            together in one simple platform.
          </p>
          <button className="about-primary-btn" onClick={goEvents}>
            Explore Events <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <section className="about-stats">
        {STATS.map(([icon, value, label]) => (
          <div className="about-stat-card" key={label}>
            <i className={`fa-solid ${icon}`}></i>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="about-section">
        <div className="about-heading">
          <span>WHY EVENTVERSE?</span>
          <h2>
            Everything you need
            <br />
            to find your next experience.
          </h2>
          <p>
            From discovering something exciting nearby to keeping your digital passes organized, EventVerse keeps the
            entire event journey in one place.
          </p>
        </div>

        <div className="about-feature-grid">
          {FEATURES.map(([icon, title, text, calendar]) => (
            <article className="about-feature-card" key={title}>
              <div className="about-feature-icon">
                <i className={icon}></i>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              {calendar && (
                <button className="about-feature-link" type="button" onClick={() => navigate('/calendar')}>
                  Open Calendar <i className="fa-solid fa-arrow-right"></i>
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-how-section">
        <div className="about-heading center-heading">
          <span>HOW IT WORKS</span>
          <h2>
            Four steps.
            <br />
            One unforgettable experience.
          </h2>
        </div>

        <div className="about-steps">
          {STEPS.map(([num, icon, title, text], i) => (
            <div key={num} style={{ display: 'contents' }}>
              {i > 0 && <div className="step-line"></div>}
              <div className="about-step">
                <div className="step-number">{num}</div>
                <i className={`fa-solid ${icon}`}></i>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-heading">
          <span>BUILT AROUND YOU</span>
          <h2>
            Whatever you're into,
            <br />
            there's something waiting.
          </h2>
        </div>
        <div className="interest-grid">
          {INTERESTS.map(([cls, icon, label]) => (
            <div className={`interest-card ${cls}`} key={cls}>
              <i className={`fa-solid ${icon}`}></i>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-location-section">
        <div className="about-location-content">
          <span>EVENTS AROUND YOUR CITY</span>
          <h2>
            Your city.
            <br />
            Your scene.
          </h2>
          <p>From weekend plans to college events, discover experiences happening around the Tricity.</p>

          <div className="location-pills">
            {PILLS.map((zone) => (
              <button key={zone} onClick={() => navigate(`/events?zone=${zone}`)}>
                <i className="fa-solid fa-location-dot"></i> {zone}
              </button>
            ))}
          </div>
        </div>

        <div className="location-visual">
          <div className="location-orbit orbit-one"></div>
          <div className="location-orbit orbit-two"></div>
          <div className="location-center">
            <i className="fa-solid fa-location-dot"></i>
            <strong>TRICITY</strong>
            <span>Chandigarh • Panchkula • Mohali</span>
          </div>
          <span className="location-dot dot-chandigarh">Chandigarh</span>
          <span className="location-dot dot-panchkula">Panchkula</span>
          <span className="location-dot dot-mohali">Mohali</span>
        </div>
      </section>

      <section className="about-promise">
        <div className="promise-inner">
          <span>THE EVENTVERSE PROMISE</span>
          <h2>
            Finding an event
            <br />
            should be an event itself.
          </h2>
          <p>No endless searching. No scattered information. No guessing what's happening nearby.</p>
          <strong>Just discover → choose → experience.</strong>
          <button onClick={goEvents} className="about-primary-btn">
            Start Exploring <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </section>
  )
}
