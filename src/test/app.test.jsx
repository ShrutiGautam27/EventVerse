import { act, fireEvent, renderHook, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { events } from '../data/events'
import { useHeroSlider } from '../hooks/useHeroSlider'
import { loginAs, mockWeather, renderApp, setToday } from './helpers'

const count = () => document.getElementById('resultsCount').textContent
const cardTitles = () => [...document.querySelectorAll('#allEvents .event-card h3')].map((h) => h.textContent)

describe('data & routes', () => {
  it('keeps all 22 original events with unique ids', () => {
    expect(events).toHaveLength(22)
    expect(new Set(events.map((e) => e.id)).size).toBe(22)
  })

  it.each([['/'], ['/events'], ['/calendar'], ['/about'], ['/login'], ['/events/5']])('opens %s without a blank page', (path) => {
    mockWeather()
    renderApp(path)
    expect(document.querySelector('main section.page.active')).toBeTruthy()
  })

  it('redirects a logged-out visitor from the root page to login/signup', () => {
    renderApp('/')
    expect(screen.getByText(/Login to manage your event passes/i)).toBeTruthy()
    expect(document.querySelector('#homePage')).toBeNull()
  })

  it('shows Home at the root when a user is already logged in', () => {
    loginAs('Asha Verma')
    renderApp('/')
    expect(document.querySelector('#homePage')).toBeTruthy()
  })

  it('shows 404 for an unknown route and an unknown event', () => {
    renderApp('/nope')
    expect(screen.getByText('Event not found')).toBeTruthy()
    renderApp('/events/999')
    expect(screen.getAllByText('Event not found').length).toBeGreaterThan(1)
  })
})

describe('discover: search + filters + sort', () => {
  it('combines search, category and location', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/events')
    expect(count()).toBe('22 events')

    await user.type(screen.getByPlaceholderText(/Search events/), 'music')
    expect(count()).toBe('2 events')
    await user.selectOptions(screen.getByLabelText('Location'), 'Chandigarh')
    expect(count()).toBe('1 event')
    expect(cardTitles()).toEqual(['Neon Nights Festival'])

    await user.clear(screen.getByPlaceholderText(/Search events/))
    await user.selectOptions(screen.getByLabelText('Category'), 'Cultural')
    await user.selectOptions(screen.getByLabelText('Location'), 'Panchkula')
    expect(cardTitles()).toEqual(['Punjab Heritage Utsav'])
  })

  it('shows the empty state and sorts by price / rating', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/events')
    await user.selectOptions(screen.getByLabelText('Sort'), 'price')
    expect(cardTitles()[0]).toBe('AI & Innovation Summit')
    await user.selectOptions(screen.getByLabelText('Sort'), 'rating')
    expect(['Neon Nights Festival', 'FutureTech Hackathon', 'AI & Innovation Summit', 'Festival of Indian Traditions', 'FutureTech Summit']).toContain(cardTitles()[0])
    await user.type(screen.getByPlaceholderText(/Search events/), 'zzzz')
    expect(screen.getByText('No events found')).toBeTruthy()
    expect(count()).toBe('0 events')
  })

  it('applies a category preset coming from the home page', () => {
    mockWeather()
    renderApp('/events?category=Music')
    expect(screen.getByLabelText('Category').value).toBe('Music')
    expect(count()).toBe('2 events')
  })

  it('home category card navigates to the filtered list', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: /Gaming/ }))
    expect(screen.getByLabelText('Category').value).toBe('Gaming')
    expect(count()).toBe('2 events')
  })
})

describe('wishlist, auth & protected pages', () => {
  it('redirects the dashboard to login when logged out', () => {
    renderApp('/dashboard')
    expect(screen.getByText(/Demo mode/)).toBeTruthy()
  })

  it('wishlist toggles, persists, and appears on the dashboard', async () => {
    mockWeather()
    loginAs()
    const user = userEvent.setup()
    const first = renderApp('/events')
    await user.click(screen.getAllByLabelText('Save event')[0])
    expect(JSON.parse(localStorage.getItem('eventverseWishlist'))).toEqual([1])
    first.unmount()

    renderApp('/dashboard')
    expect(document.getElementById('savedCount').textContent).toBe('1')
    expect(within(document.getElementById('wishlistEvents')).getByText('Neon Nights Festival')).toBeTruthy()
    await user.click(within(document.getElementById('wishlistEvents')).getByLabelText('Save event'))
    expect(screen.getByText(/wishlist is empty/)).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('eventverseWishlist'))).toEqual([])
  })

  it('signs up, logs out, rejects a wrong password and logs in again', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await user.type(screen.getByLabelText('Full Name'), 'Asha Verma')
    await user.type(screen.getByLabelText('Email'), 'asha@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret1')
    await user.type(screen.getByLabelText('Confirm Password'), 'secret1')
    await user.click(screen.getByRole('button', { name: /Create Account/ }))
    expect(JSON.parse(localStorage.getItem('eventverseUser')).name).toBe('Asha Verma')
    expect(document.querySelector('.login-btn span').textContent).toBe('Asha')

    await user.click(screen.getByText('My Passes', { selector: '.nav-links a' }))
    await user.click(screen.getByRole('button', { name: /Logout/ }))
    expect(localStorage.getItem('eventverseUser')).toBeNull()
    expect(document.querySelector('.login-btn span').textContent).toBe('Login')

    await user.click(document.querySelector('.login-btn'))
    await user.type(screen.getByLabelText('Email'), 'asha@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong!')
    await user.click(document.querySelector('#loginForm .primary-btn'))
    expect(screen.getByText('Invalid login details.')).toBeTruthy()
    await user.clear(screen.getByLabelText('Password'))
    await user.type(screen.getByLabelText('Password'), 'secret1')
    await user.click(document.querySelector('#loginForm .primary-btn'))
    expect(JSON.parse(localStorage.getItem('eventverseUser')).email).toBe('asha@example.com')
  })

  it('rejects mismatched signup passwords', async () => {
    const user = userEvent.setup()
    renderApp('/login')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await user.type(screen.getByLabelText('Full Name'), 'A B')
    await user.type(screen.getByLabelText('Email'), 'a@b.co')
    await user.type(screen.getByLabelText('Password'), 'secret1')
    await user.type(screen.getByLabelText('Confirm Password'), 'secret2')
    await user.click(screen.getByRole('button', { name: /Create Account/ }))
    expect(screen.getByText('Passwords do not match.')).toBeTruthy()
    expect(localStorage.getItem('eventverseAccount')).toBeNull()
  })

  it('survives malformed localStorage', () => {
    localStorage.setItem('eventverseUser', '{"x":')
    localStorage.setItem('eventverseWishlist', 'not json')
    localStorage.setItem('eventverseBookings', '{"a":1}')
    mockWeather()
    renderApp('/events')
    expect(count()).toBe('22 events')
    renderApp('/dashboard')
    expect(screen.getAllByText(/Demo mode/).length).toBeGreaterThan(0)
  })
})

describe('seat selection, booking and ticket', () => {
  const seat = (n) => screen.getByRole('button', { name: String(n) })

  it('calculates totals, caps at 6 seats and blocks reserved seats', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/events/1')
    expect(document.getElementById('seatTotal').textContent).toBe('₹0')
    expect(seat(3).disabled).toBe(true)
    await user.click(seat(1))
    await user.click(seat(2))
    expect(document.getElementById('seatTotal').textContent).toBe('₹998')
    expect(document.getElementById('seatCount').textContent).toBe('2 seats selected')
    await user.click(seat(2))
    expect(document.getElementById('seatCount').textContent).toBe('1 seat selected')
    for (const n of [2, 4, 5, 6, 8]) await user.click(seat(n))
    await user.click(seat(9))
    expect(screen.getByText('You can select up to 6 seats.')).toBeTruthy()
    expect(document.getElementById('seatCount').textContent).toBe('6 seats selected')
    expect(document.getElementById('seatTotal').textContent).toBe('₹2994')
  })

  it('shows FREE for free events', async () => {
    const user = userEvent.setup()
    renderApp('/events/10')
    await user.click(seat(1))
    expect(document.getElementById('seatTotal').textContent).toBe('FREE')
  })

  it('requires seats, then login, before registering', async () => {
    const user = userEvent.setup()
    renderApp('/events/1')
    await user.click(screen.getByRole('button', { name: /Continue/ }))
    expect(screen.getByText('Please select at least one seat.')).toBeTruthy()
    await user.click(seat(1))
    await user.click(screen.getByRole('button', { name: /Continue/ }))
    expect(screen.getByText('Please login before registering.')).toBeTruthy()
    expect(screen.getByText(/Demo mode/)).toBeTruthy()
  })

  it('sends /register without a seat selection back to the event', () => {
    loginAs()
    renderApp('/events/1/register')
    expect(screen.getByText('Select your seats')).toBeTruthy()
  })

  it('completes booking, shows the ticket, stores it and lists it in My Passes', async () => {
    loginAs()
    const user = userEvent.setup()
    renderApp('/events/1')
    await user.click(seat(1))
    await user.click(seat(2))
    await user.click(screen.getByRole('button', { name: /Continue/ }))
    expect(document.getElementById('bookingSummary').textContent).toContain('₹998')

    await user.type(screen.getByLabelText('Full Name'), 'Asha Verma')
    await user.type(screen.getByLabelText('Email Address'), 'asha@example.com')
    await user.type(screen.getByLabelText('Phone Number'), '9876543210')
    await user.type(screen.getByLabelText('City'), 'Mohali')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /Confirm Registration/ }))

    expect(screen.getByText("You're going!")).toBeTruthy()
    const stored = JSON.parse(localStorage.getItem('eventverseBookings'))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ eventId: 1, seats: [1, 2], total: 998, attendee: 'Asha Verma' })
    expect(stored[0].id).toMatch(/^EV-\d{7}$/)
    expect(document.querySelectorAll('.qr span')).toHaveLength(100)
    expect(document.getElementById('ticketPage')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /Print Pass/ }))
    expect(window.print).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /View My Passes/ }))
    expect(document.getElementById('passCount').textContent).toBe('1')
    await user.click(screen.getByRole('button', { name: /View Pass/ }))
    expect(screen.getByText('DIGITAL EVENT PASS')).toBeTruthy()
  })

  it('escapes HTML typed into the booking form', async () => {
    loginAs()
    localStorage.setItem(
      'eventverseBookings',
      JSON.stringify([{ id: 'EV-1234567', eventId: 1, eventTitle: 'T', date: 'd', time: 't', venue: 'v', seats: [1], attendee: '<img src=x onerror=alert(1)>' }])
    )
    renderApp('/ticket/EV-1234567')
    expect(document.querySelector('#ticket img')).toBeNull()
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
  })
})

describe('calendar', () => {
  it('marks event dates and lists events for a clicked day', async () => {
    setToday('2026-10-10T10:00:00')
    const user = userEvent.setup()
    renderApp('/calendar')
    expect(document.getElementById('calendarMonthTitle').textContent).toBe('October 2026')
    const marked = [...document.querySelectorAll('.calendar-day.has-events')].map((b) => b.dataset.date)
    const expected = events.filter((e) => e.date.startsWith('2026-10')).map((e) => e.date)
    expect(marked.sort()).toEqual([...new Set(expected)].sort())

    const day = document.querySelector('[data-date="2026-10-10"]')
    expect(day.textContent).toContain('2 events')
    await user.click(day)
    expect(screen.getByText('Indie Beats Live')).toBeTruthy()
    expect(screen.getByText('Tricity Gaming Arena')).toBeTruthy()

    await user.click(screen.getByLabelText('Next month'))
    expect(document.getElementById('calendarMonthTitle').textContent).toBe('November 2026')
    await user.click(screen.getByRole('button', { name: 'Today' }))
    expect(document.getElementById('calendarMonthTitle').textContent).toBe('October 2026')
    await user.click(document.querySelector('[data-date="2026-10-11"]'))
    expect(screen.getByText('No events on this date')).toBeTruthy()
  })

  it('does not skip a month when today is the 31st', async () => {
    setToday('2026-01-31T10:00:00')
    const user = userEvent.setup()
    renderApp('/calendar')
    await user.click(screen.getByLabelText('Next month'))
    expect(document.getElementById('calendarMonthTitle').textContent).toBe('February 2026')
  })

  it('opens an event from the calendar list', async () => {
    setToday('2026-09-01T10:00:00')
    const user = userEvent.setup()
    renderApp('/calendar')
    await user.click(document.querySelector('[data-date="2026-09-12"]'))
    await user.click(screen.getByText('Neon Nights Festival'))
    expect(screen.getByText('Select your seats')).toBeTruthy()
  })
})

describe('weather', () => {
  it('fetches once per event, shows forecasts, and past/far-future messages', async () => {
    setToday('2026-10-20T10:00:00')
    const fetchMock = mockWeather()
    renderApp('/events')
    await waitFor(() => expect(screen.queryAllByText(/Checking weather/).length).toBe(0))
    const urls = fetchMock.mock.calls.map((c) => c[0])
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls.every((u) => u.includes('api.open-meteo.com') && u.includes('start_date='))).toBe(true)
    expect(screen.getAllByText(/31.5°C \/ 22.1°C/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Forecast is not available for past events/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/will be available closer to the event/).length).toBeGreaterThan(0)
  })

  it('does not stay on "Checking weather" for an event shown on both Home and Discover', async () => {
    setToday('2026-09-10T10:00:00')
    mockWeather()
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByText('Explore Events', { selector: '.hero-buttons button' }))
    await waitFor(() => expect(screen.queryAllByText(/Checking weather/).length).toBe(0))
  })

  it('shows an error state when the API fails', async () => {
    setToday('2026-10-20T10:00:00')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockWeather(async () => ({ ok: false }))
    renderApp('/events/8')
    renderApp('/events')
    await waitFor(() => expect(screen.getAllByText(/Unable to load weather information/).length).toBeGreaterThan(0))
  })
})

describe('Eve chatbot', () => {
  it('opens, answers quick actions and typed questions, and closes', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/')
    const bot = document.getElementById('chatbot')
    expect(bot.classList.contains('show')).toBe(false)
    await user.click(screen.getByLabelText('Open Eve AI'))
    expect(bot.classList.contains('show')).toBe(true)
    expect(screen.getByText(/I'm Eve/)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /🎟 Free/ }))
    expect(bot.querySelectorAll('.eve-event-card')).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: /🎭 Events/ }))
    expect(bot.querySelectorAll('.eve-event-card')).toHaveLength(26)

    await user.type(document.getElementById('chatInput'), 'any concert?')
    await user.click(screen.getByLabelText('Send'))
    expect(bot.querySelector('.user-message').textContent).toBe('any concert?')
    await waitFor(() => expect(bot.querySelectorAll('.eve-event-card')).toHaveLength(28), { timeout: 2000 })

    await user.type(document.getElementById('chatInput'), 'how do I book')
    await user.click(screen.getByLabelText('Send'))
    await waitFor(() => expect(screen.getByText(/complete registration/)).toBeTruthy(), { timeout: 2000 })
    await user.type(document.getElementById('chatInput'), 'blah')
    await user.click(screen.getByLabelText('Send'))
    await waitFor(() => expect(screen.getByText(/I'm Eve! Try asking me/)).toBeTruthy(), { timeout: 2000 })

    await user.click(bot.querySelectorAll('.eve-view-event')[0])
    expect(screen.getByText('Select your seats')).toBeTruthy()
    await user.click(screen.getByLabelText('Close chat'))
    expect(bot.classList.contains('show')).toBe(false)
  })

  it('opens from the hero and footer', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByText('Ask Eve', { selector: '.hero-buttons button' }))
    expect(document.getElementById('chatbot').classList.contains('show')).toBe(true)
    await user.click(screen.getByLabelText('Close chat'))
    await user.click(screen.getByText('Ask Eve', { selector: 'footer a' }))
    expect(document.getElementById('chatbot').classList.contains('show')).toBe(true)
  })
})

describe('theme, menu, hero slider', () => {
  it('toggles dark mode and persists it', async () => {
    mockWeather()
    const user = userEvent.setup()
    const first = renderApp('/')
    await user.click(screen.getByLabelText('Change theme'))
    expect(document.body.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('eventverseTheme')).toBe('dark')
    first.unmount()
    document.body.className = ''
    renderApp('/')
    expect(document.body.classList.contains('dark')).toBe(true)
    await user.click(screen.getByLabelText('Change theme'))
    expect(localStorage.getItem('eventverseTheme')).toBe('light')
  })

  it('opens and closes the mobile menu', async () => {
    mockWeather()
    const user = userEvent.setup()
    renderApp('/')
    const menu = document.getElementById('mobileMenu')
    await user.click(screen.getByLabelText('Toggle menu'))
    expect(menu.classList.contains('show')).toBe(true)
    await user.click(within(menu).getByText('Discover'))
    expect(menu.classList.contains('show')).toBe(false)
    expect(document.getElementById('eventsPage')).toBeTruthy()
  })

  it('hero slider advances every 4s and cleans up', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(() => useHeroSlider(3))
    expect(result.current.index).toBe(0)
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.fading).toBe(true)
    act(() => vi.advanceTimersByTime(350))
    expect(result.current).toEqual({ index: 1, fading: false })
    act(() => vi.advanceTimersByTime(8350))
    expect(result.current.index).toBe(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
