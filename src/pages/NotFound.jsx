import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <section id="notFoundPage" className="page active">
      <div className="not-found">
        <span>404</span>
        <h1>Event not found</h1>
        <p>Looks like this event has left the venue.</p>
        <button className="primary-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </section>
  )
}
