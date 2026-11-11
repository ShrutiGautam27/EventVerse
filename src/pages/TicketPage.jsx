import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import Ticket from '../components/Ticket'
import NotFound from './NotFound'

export default function TicketPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { bookings } = useStore()
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking) return <NotFound />

  return (
    <section id="ticketPage" className="page active">
      <div className="ticket-page">
        <div className="success-message">
          <div className="success-icon">
            <i className="fa-solid fa-check"></i>
          </div>
          <span className="eyebrow">REGISTRATION COMPLETE</span>
          <h1>You're going!</h1>
          <p>Your EventVerse digital pass is ready.</p>
        </div>

        <Ticket booking={booking} />

        <div className="ticket-actions">
          <button className="primary-btn" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> Print Pass
          </button>
          <button className="secondary-btn" onClick={() => navigate('/dashboard')}>
            View My Passes
          </button>
        </div>
      </div>
    </section>
  )
}
