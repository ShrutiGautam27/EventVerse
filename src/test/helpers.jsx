import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { vi } from 'vitest'
import App from '../App'

export const renderApp = (path = '/') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  )

export const loginAs = (name = 'Test User') =>
  localStorage.setItem('eventverseUser', JSON.stringify({ name, email: 'test@example.com' }))

// Fake only the Date so React/testing-library timers keep working
export const setToday = (iso) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(iso))
}

export const mockWeather = (impl) => {
  const fn = vi.fn(
    impl ||
      (async () => ({
        ok: true,
        json: async () => ({
          daily: { time: ['x'], weather_code: [1], temperature_2m_max: [31.5], temperature_2m_min: [22.1], precipitation_probability_max: [20] },
        }),
      }))
  )
  vi.stubGlobal('fetch', fn)
  return fn
}
