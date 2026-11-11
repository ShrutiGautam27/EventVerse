import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext'

export default function Footer() {
  const { openChat } = useUI()
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="logo" to="/">
            <span className="logo-icon">
              <i className="fa-solid fa-ticket"></i>
            </span>
            Event<span>Verse</span>
          </Link>
          <p>Making district events easier to discover, experience and remember.</p>
        </div>

        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <Link to="/events">Events</Link>
            <Link to="/dashboard">My Passes</Link>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <strong>EventVerse</strong>
            <Link to="/about">About</Link>
            <a
              href="#chat"
              onClick={(e) => {
                e.preventDefault()
                openChat()
              }}
            >
              Ask Eve
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 EventVerse District</span>
        <span>Designed for Tricity</span>
      </div>
    </footer>
  )
}
