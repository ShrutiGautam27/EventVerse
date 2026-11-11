import { useEventWeather } from '../hooks/useEventWeather'

// Renders the weather block of an event card (loading / ready / unavailable / error)
export default function WeatherBadge({ event }) {
  const weather = useEventWeather(event)

  return (
    <div className="event-weather">
      {weather.status === 'loading' && <span className="weather-loading">🌤️ Checking weather...</span>}

      {(weather.status === 'unavailable' || weather.status === 'error') && (
        <span className="weather-unavailable">🌦️ {weather.message}</span>
      )}

      {weather.status === 'ready' && (
        <div className="weather-info">
          <span className="weather-icon">{weather.icon}</span>
          <div className="weather-details">
            <strong>
              {weather.temperatureMax}°C / {weather.temperatureMin}°C
            </strong>
            <span>{weather.description}</span>
          </div>
          <span className="weather-rain">🌧️ {weather.rainProbability}% rain</span>
        </div>
      )}
    </div>
  )
}
