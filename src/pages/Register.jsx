import { useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { events } from '../data/events'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import NotFound from './NotFound'

export default function Register() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { draft, setDraft, addBooking } = useStore()
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', terms: false })
  const submitted = useRef(false)

  const event = events.find((e) => String(e.id) === id)
  if (!event) return <NotFound />
  // No seat selection (e.g. page refreshed) -> back to the event's seat page
  if (!submitted.current && (!draft || draft.eventId !== event.id)) return <Navigate to={`/events/${event.id}`} replace />

  const seats = draft ? draft.seats : []
  const total = seats.length * event.price
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const phone = form.phone.trim()
    if (name.length < 2 || phone.length !== 10) return showToast('Please enter valid details.')

    const booking = {
      id: 'EV-' + Date.now().toString().slice(-7),
      eventId: event.id,
      eventTitle: event.title,
      date: event.displayDate,
      time: event.time,
      venue: event.venue,
      seats: [...seats],
      attendee: name,
      email: form.email.trim(),
      phone,
      city: form.city.trim(),
      total,
    }
    submitted.current = true
    addBooking(booking)
    setDraft(null)
    navigate(`/ticket/${booking.id}`)
  }

  return (
    <section id="registerPage" className="page active">
      <div className="form-page">
        <div className="form-intro">
          <span className="eyebrow">COMPLETE YOUR BOOKING</span>
          <h1>Almost there!</h1>
          <p>Enter your details to generate your digital EventVerse pass.</p>

          <div className="booking-summary" id="bookingSummary">
            <strong>{event.title}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '7px' }}>
              {event.displayDate} · {event.time}
              <br />
              {event.venue}
            </p>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '.8rem' }}>
              <span>Seats: {seats.join(', ')}</span>
              <strong>{total === 0 ? 'FREE' : '₹' + total}</strong>
            </div>
          </div>
        </div>

        <form className="registration-form" id="registrationForm" onSubmit={submit}>
          <h2>Attendee details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="regName">Full Name</label>
              <input type="text" id="regName" required placeholder="Enter your name" value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label htmlFor="regEmail">Email Address</label>
              <input type="email" id="regEmail" required placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label htmlFor="regPhone">Phone Number</label>
              <input type="tel" id="regPhone" pattern="[0-9]{10}" required placeholder="10 digit number" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="form-group">
              <label htmlFor="regCity">City</label>
              <input type="text" id="regCity" required placeholder="Your city" value={form.city} onChange={set('city')} />
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" id="terms" required checked={form.terms} onChange={set('terms')} />
            <span>I agree to the EventVerse terms and event guidelines.</span>
          </label>

          <button className="primary-btn full-btn" type="submit">
            Confirm Registration <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </section>
  )
}
