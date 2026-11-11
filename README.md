# EventVerse — React + Vite

Migration of the original vanilla HTML/CSS/JS EventVerse project. The original `index.html`, `style.css`
and `script.js` are **not part of this folder and were never modified**.

## Run locally

```bash
cd eventverse-react
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build
npm test           # 34 automated tests (Vitest + jsdom)
```

Requires Node 18+ (built and tested with Node 22). Internet access is needed in the browser for Unsplash
images, Google Fonts, Font Awesome icons and the Open-Meteo weather API (same as the original).

## What was preserved

- `src/style.css` is a byte-for-byte copy of your `style.css` (same class names, dark mode on `body.dark`, breakpoints, animations, print rules).
- `src/data/events.js` holds your 22 events and weather locations, copied verbatim (verified deep-equal to `script.js`).
- localStorage keys and shapes are unchanged: `eventverseUser`, `eventverseAccount`, `eventverseWishlist`, `eventverseBookings`, `eventverseTheme`.
- Fonts/icons are loaded from the same CDN links (now in `index.html`).
- Routing uses `HashRouter`, so URLs look like `/#/events` and work on any static host. To use clean URLs, swap `HashRouter` for `BrowserRouter` in `src/main.jsx` (the host then needs an SPA fallback).

## Project layout

```
src/
  components/  Navbar, MobileMenu, Footer, EventCard, WeatherBadge, ChatBot, Ticket, Toast, ProtectedRoute, ScrollToTop
  pages/       Home, Discover, EventDetails, Register, TicketPage, Auth, Dashboard, Calendar, About, NotFound
  context/     Theme, Toast, Auth, Store (wishlist + bookings + seat draft), UI (menu/chat)
  hooks/       useLocalStorage, useEventWeather, useHeroSlider
  utils/       storage (safe JSON), weather (API + cache), format
  data/        events.js
  test/        automated tests
```

Routes: `/`, `/events`, `/events/:id`, `/events/:id/register` (login required), `/ticket/:bookingId` (login required),
`/login`, `/dashboard` (login required), `/calendar`, `/about`, anything else -> 404.

## Intentional differences from the original

Bug fixes:
1. Weather no longer gets stuck on "Checking weather…" (original updated only the first DOM element with a given id, so Discover cards for events 1–3 and all dashboard wishlist cards could stay stuck). Each card now has its own state; requests are cached so each event is fetched once.
2. Past events show "Forecast is not available for past events." instead of "available closer to the event".
3. User-entered text can no longer inject HTML (original put it into `innerHTML`).
4. Malformed localStorage no longer crashes the app; it falls back to empty data.
5. Calendar month navigation no longer skips a month when the current day is the 29th–31st.
6. Hero slider timer is cleaned up; dark theme is applied before first paint (no light flash).
7. The fake 200 ms `loadEvents()` delay was removed (it had no visible effect).

Small additions: Calendar and About links in the mobile menu; About-page location pills pre-select that location on Discover; the registration page sends you back to the event if there is no seat selection (e.g. after refresh); password reveal icon switches to eye-slash; reload now stays on the current page (original always went Home).

## Feature verification checklist

"Automated" = Vitest + jsdom with a mocked `fetch`. "Not tested" = needs a real browser/network, which was unavailable.

| Area | Status |
|---|---|
| Production build (`npm run build`) | PASS |
| Dev server serves index, main.jsx, App.jsx, style.css (HTTP 200) | PASS |
| All routes open, no blank page (/, /events, /events/:id, /calendar, /about, /login) | PASS (automated) |
| 404 for unknown route / unknown event id | PASS (automated) |
| Event data intact (22 events, deep-equal to original) | PASS |
| Search + category + location filters combined; sort; empty state; result count | PASS (automated) |
| Home category cards preset the Discover filter | PASS (automated) |
| Wishlist toggle, persistence, dashboard list and count | PASS (automated) |
| Signup, login, wrong password, logout, mismatched passwords | PASS (automated) |
| Protected pages redirect to login when logged out | PASS (automated) |
| Malformed localStorage handled | PASS (automated) |
| Seat selection, 6-seat limit, reserved seats, price total, FREE events | PASS (automated) |
| Registration -> ticket -> saved booking -> My Passes -> View Pass | PASS (automated) |
| HTML in form input is escaped | PASS (automated) |
| Calendar markers match event dates, day list, month nav, Today, 31st-of-month | PASS (automated) |
| Weather states: loading, forecast, past, far-future, API error; one request per event | PASS (automated, mocked API) |
| Eve chatbot: open/close (button, hero, footer), quick actions, typed keywords, View Event | PASS (automated) |
| Dark/light toggle and persistence | PASS (automated) |
| Mobile menu opens/closes (class toggled) | PASS (automated) |
| Hero slider timing and cleanup | PASS (automated) |
| Pixel-level visual match with the original | NOT TESTED (CSS is identical, but never viewed in a browser) |
| Responsive layout on mobile/tablet/desktop | NOT TESTED |
| Unsplash images, Font Awesome icons, Google Fonts loading | NOT TESTED (CDNs unreachable from build environment) |
| Real Open-Meteo responses | NOT TESTED (see issue 1 below) |
| Print layout of the ticket (`window.print`) | NOT TESTED (only that it is called) |
| Animations, smooth scrolling, hero fade appearance | NOT TESTED |

Test runs print some React `act(...)` warnings from async weather updates; they are harmless and all tests pass.

## Known issues, quirks carried over, and backend needs

1. **Weather request not verified.** The request is unchanged from the original, including `forecast_days=16` together with `start_date/end_date`. Open-Meteo may reject that combination; if cards show "Unable to load weather information.", delete the `&forecast_days=16` line in `src/utils/weather.js`.
2. **Demo auth is not secure.** The account password is stored in plain text in localStorage, there is a single account, and signing up again overwrites it. Real authentication needs a backend (hashed passwords, sessions/tokens).
3. **Bookings are not tied to a user and not validated server-side.** Every logged-in user sees all bookings; booked seats are not marked taken; reserved seats are the same 8 for every event. Real booking/payment needs a backend.
4. **QR code is decorative** (100 empty cells), not scannable.
5. **"Eve AI" is a keyword matcher**, not an AI/API. Unrecognised words (e.g. "comedy") get the default reply.
6. **Dates:** today is 22 Oct 2026, so 14 of 22 events are already past but still listed, bookable and sorted under "Upcoming". "Trending" is simply the first 3 events.
7. **Static marketing numbers** (120+ events, 25+ venues, 15K+ students, 2.4K+) do not match the 22 events in the data.
8. Search only matches title, category and venue (not artist/organizer), despite the placeholder text.
9. Event weather appears on event cards only, not on the details page (same as original).
10. Footer and mobile-menu "Login" links still show when logged in (same as original).
11. Some events reuse the same image (ids 9/20 and 17/18).
12. No API secrets exist or are needed. Never put secrets in frontend code; a backend would be required for any keyed API.

## Calendar weather forecast

The Calendar page now displays Open-Meteo daily forecast emojis and high/low temperatures for dates where forecast data is available (up to the API's 16-day forecast horizon). Choose Chandigarh, Panchkula, Mohali, or Tricity from the location selector. Selecting a date opens its weather summary and any events scheduled that day. Event details also include a location/date-specific weather block.

Weather responses are cached in memory for 15 minutes and shared between calendar and event requests. Dates outside the forecast window and past dates are explicitly marked unavailable rather than displaying guessed weather. The free Open-Meteo forecast endpoint does not require an API key.

To verify locally, run `npm install`, `npm run dev`, open Calendar, select a location, and check the weather emoji/temperature on dates in the upcoming forecast range. Dates outside that range should show a placeholder. Click a date with an event, then open its event details to verify the event-specific weather block. Live API behaviour requires internet access.


## Interactive Tricity Map

The app now includes an interactive map at `#/map`, linked from the desktop/mobile navigation and the Home page district section. It uses Leaflet with OpenStreetMap tiles, city-area markers for Chandigarh, Panchkula and Mohali, clickable event-venue pins, search, layer toggles, popups and links to event details. The Leaflet library and map tiles load online from their public CDN/tile service.

**Location accuracy note:** the existing event records mostly contain a venue name and city, not street addresses or coordinates. Recognized locations such as Panjab University and the named Chandigarh sectors use approximate landmark coordinates; other fictional/sample venues are placed near their city/zone centre with small deterministic offsets. These pins are for discovery/demo purposes and should not be treated as verified navigation directions. For precise venue pins, add verified latitude/longitude or full addresses to each event record.


## Automatic event feed

The app filters past events locally and refreshes event data every 10 minutes. The included `/api/events` serverless endpoint uses the Ticketmaster Discovery API for events around Chandigarh, Panchkula, and Mohali. To enable live discovery, deploy this project on a platform that supports the included Vercel-style `api/events.js` function and add `TICKETMASTER_API_KEY` as a server-side environment variable (see `.env.example`). Do not put the API key in `VITE_*` variables or frontend code.

Without that key/provider endpoint, EventVerse continues to show valid upcoming demo events and displays a notice that the live feed is unavailable. The calendar weather uses Open-Meteo and shows forecasts only for dates returned by that provider; it does not fabricate long-range forecasts.


## Redux Toolkit state management

EventVerse now uses Redux Toolkit for shared wishlist, bookings, and temporary seat-selection draft state. Existing components can continue using the `useStore()` adapter, so the current UI API remains compatible. Wishlist and bookings continue to use the existing `eventverseWishlist` and `eventverseBookings` localStorage keys.

After extracting this ZIP, run `npm install` (not `npm ci`) to install the added `@reduxjs/toolkit` and `react-redux` dependencies and refresh the lockfile, then run `npm run dev`.
