import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { events } from '../data/events'
import { useUI } from '../context/UIContext'
import { priceLabel } from '../utils/format'

const EMOJIS = { Music: '🎵', Cultural: '🎭', Sports: '🏆', Education: '💡', Free: '🎟' }
const emojiFor = (category) => EMOJIS[category] || '🎭'

// Keyword rules, in the same order as the original sendChat()
const RULES = [
  [['music', 'concert', 'singer', 'musical'], { show: 'Music' }],
  [['cultural', 'culture', 'heritage', 'traditional'], { show: 'Cultural' }],
  [['sport', 'sports', 'match', 'tournament'], { show: 'Sports' }],
  [['education', 'workshop', 'seminar', 'summit', 'learning'], { show: 'Education' }],
  [['free', 'no cost', 'without cost'], { show: 'Free' }],
  [['event', 'events', 'show me', "what's happening"], { show: null }],
  [['seat', 'seats'], { text: '💺 Open any event card and click View Event to see available seats.' }],
  [['register', 'booking', 'book'], { text: '📝 Choose an event → View Event → select your seats → login → complete registration.' }],
]
const DEFAULT_REPLY =
  "✨ I'm Eve! Try asking me about Music, Cultural, Sports, Education, Free events or upcoming events."

const QUICK = [
  ['events', '🎭 Events'],
  ['music', '🎵 Music'],
  ['cultural', '🎭 Cultural'],
  ['sports', '🏆 Sports'],
  ['education', '💡 Education'],
  ['free', '🎟 Free'],
]

const WELCOME = { id: 0, role: 'bot', welcome: true }

// Builds a bot message listing events (all / by category / free)
function eventsMessage(category) {
  let list
  if (category === 'Free') list = events.filter((e) => e.price === 0)
  else if (category) list = events.filter((e) => e.category.toLowerCase() === category.toLowerCase())
  else list = [...events]

  if (list.length === 0) {
    return { role: 'bot', text: `Sorry, I couldn't find any ${category || ''} events right now.` }
  }
  let heading
  if (category === 'Free') heading = '🎟 Here are the free events:'
  else if (category) heading = `${emojiFor(category)} Here are the ${category.toLowerCase()} events:`
  else heading = '🎭 Here are some upcoming events:'
  return { role: 'bot', heading, list }
}

export default function ChatBot() {
  const navigate = useNavigate()
  const { chatOpen, openChat, closeChat } = useUI()
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const nextId = useRef(1)
  const timers = useRef([])
  const bottom = useRef(null)

  const push = (msg) => setMessages((m) => [...m, { id: nextId.current++, ...msg }])

  useEffect(() => {
    const el = bottom.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const askEve = (topic) => {
    const map = { music: 'Music', cultural: 'Cultural', sports: 'Sports', education: 'Education', free: 'Free' }
    if (topic === 'events') return push(eventsMessage())
    if (map[topic]) return push(eventsMessage(map[topic]))
    push({ role: 'bot', text: 'I can help you find Music, Cultural, Sports, Education or Free events. ✨' })
  }

  const reply = (message) => {
    const text = message.toLowerCase()
    for (const [words, action] of RULES) {
      if (words.some((w) => text.includes(w))) {
        if ('text' in action) return push({ role: 'bot', text: action.text })
        return push(eventsMessage(action.show))
      }
    }
    push({ role: 'bot', text: DEFAULT_REPLY })
  }

  const sendChat = (e) => {
    e.preventDefault()
    const message = input.trim()
    if (!message) return
    push({ role: 'user', text: message })
    setInput('')
    timers.current.push(setTimeout(() => reply(message), 500))
  }

  return (
    <>
      <button className="chat-button" onClick={openChat} aria-label="Open Eve AI">
        <i className="fa-solid fa-wand-magic-sparkles"></i>
        <span>Ask Eve</span>
      </button>

      <div className={`chatbot ${chatOpen ? 'show' : ''}`} id="chatbot">
        <div className="chat-header">
          <div className="eve-avatar">✦</div>
          <div>
            <strong>Eve AI</strong>
            <small>EventVerse Assistant</small>
          </div>
          <button onClick={closeChat} aria-label="Close chat">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="chat-messages" id="chatMessages" ref={bottom}>
          {messages.map((m) => {
            if (m.role === 'user') return <div key={m.id} className="user-message">{m.text}</div>
            if (m.welcome) {
              return (
                <div key={m.id} className="bot-message">
                  Hi! I'm Eve ✨
                  <br />
                  <br />
                  I can help you find events, choose seats or understand how EventVerse works.
                </div>
              )
            }
            if (m.list) {
              return (
                <div key={m.id} className="bot-message">
                  <div className="eve-event-response">
                    <strong>{m.heading}</strong>
                    {m.list.map((event) => (
                      <div className="eve-event-card" key={event.id}>
                        <img src={event.image} alt={event.title} className="eve-event-image" />
                        <div className="eve-event-info">
                          <h4>{event.title}</h4>
                          <p>
                            <i className="fa-solid fa-location-dot"></i> {event.venue}
                          </p>
                          <p>
                            <i className="fa-regular fa-calendar"></i> {event.displayDate}
                          </p>
                          <p className="eve-event-price">
                            <i className="fa-solid fa-ticket"></i> {priceLabel(event.price)}
                          </p>
                          <button className="eve-view-event" onClick={() => navigate(`/events/${event.id}`)}>
                            View Event
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return <div key={m.id} className="bot-message">{m.text}</div>
          })}
        </div>

        <div className="quick-actions">
          {QUICK.map(([topic, label]) => (
            <button key={topic} onClick={() => askEve(topic)}>
              {label}
            </button>
          ))}
        </div>

        <form className="chat-input" onSubmit={sendChat}>
          <input
            type="text"
            id="chatInput"
            placeholder="Ask Eve something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button aria-label="Send">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </>
  )
}
