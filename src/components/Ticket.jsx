// Digital pass. The "QR" is decorative (100 empty cells) exactly like the original – it is NOT scannable.
export default function Ticket({ booking }) {
  return (
    <div className="ticket" id="ticket">
      <div className="ticket-top">
        <div className="ticket-brand">
          <i className="fa-solid fa-ticket"></i> EventVerse
        </div>
        <div className="ticket-type">DIGITAL EVENT PASS</div>
      </div>

      <div className="ticket-main">
        <h2>{booking.eventTitle}</h2>
        <div className="ticket-details">
          <div>
            <span>Date</span>
            <strong>{booking.date}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>
          <div>
            <span>Venue</span>
            <strong>{booking.venue}</strong>
          </div>
          <div>
            <span>Seats</span>
            <strong>{booking.seats.join(', ')}</strong>
          </div>
        </div>
      </div>

      <div className="ticket-divider"></div>

      <div className="ticket-bottom">
        <div>
          <div className="ticket-details">
            <div>
              <span>Guest</span>
              <strong>{booking.attendee}</strong>
            </div>
            <div>
              <span>Pass ID</span>
              <strong>{booking.id}</strong>
            </div>
          </div>
        </div>
        <div className="qr">
          {Array.from({ length: 100 }, (_, i) => (
            <span key={i}></span>
          ))}
        </div>
      </div>
    </div>
  )
}
