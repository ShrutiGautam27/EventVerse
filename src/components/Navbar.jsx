import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useUI } from '../context/UIContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { toggleMenu } = useUI()

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <i className="fa-solid fa-ticket"></i>
          </span>
          <span>
            Event<span>Verse</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/events">Discover</Link>
          <Link to="/calendar">
            <i className="fa-regular fa-calendar"></i> Calendar
          </Link>
          <Link to="/map">
            <i className="fa-solid fa-map-location-dot"></i> Map
          </Link>
          <Link to="/dashboard">My Passes</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="nav-actions">
          <button className="theme-btn" onClick={toggleTheme} title="Change Theme" aria-label="Change theme">
            <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
          </button>

          <button
            className="login-btn"
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            title={user ? `Logged in as ${user.name}` : 'Login'}
          >
            <i className="fa-regular fa-user"></i>
            <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
          </button>

          <button className="menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  )
}
