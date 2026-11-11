import { Link } from 'react-router-dom'
import { useUI } from '../context/UIContext'

const ITEMS = [
  ['/', 'fa-solid fa-house', 'Home'],
  ['/events', 'fa-solid fa-compass', 'Discover'],
  ['/calendar', 'fa-regular fa-calendar', 'Calendar'], // added (missing in original mobile menu)
  ['/map', 'fa-solid fa-map-location-dot', 'Explore Map'],
  ['/dashboard', 'fa-solid fa-ticket', 'My Passes'],
  ['/about', 'fa-solid fa-circle-info', 'About'], // added (missing in original mobile menu)
  ['/login', 'fa-regular fa-user', 'Login'],
]

export default function MobileMenu() {
  const { menuOpen, closeMenu } = useUI()
  return (
    <div className={`mobile-menu ${menuOpen ? 'show' : ''}`} id="mobileMenu">
      {ITEMS.map(([to, icon, label]) => (
        <Link key={to} to={to} onClick={closeMenu}>
          <i className={icon}></i> {label}
        </Link>
      ))}
    </div>
  )
}
