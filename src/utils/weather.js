import { weatherLocations } from '../data/events'

const CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Light freezing drizzle', 57: 'Dense freezing drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  66: 'Light freezing rain', 67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
  85: 'Slight snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
}

export const getWeatherDescription = (code) => CODES[code] || 'Weather information unavailable'

export function getWeatherIcon(code) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '🌡️'
}

const CACHE_TTL = 15 * 60 * 1000
const forecastCache = new Map()
const eventCache = new Map()
export function clearWeatherCache() { forecastCache.clear(); eventCache.clear() }

function localDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export async function getLocationForecast(locationName) {
  const location = weatherLocations[locationName]
  if (!location) return { status: 'unavailable', message: 'Weather location unavailable.' }
  const key = `${location.latitude},${location.longitude}`
  const cached = forecastCache.get(key)
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) return cached.promise

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.search = new URLSearchParams({
    latitude: String(location.latitude), longitude: String(location.longitude),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '16', timezone: 'Asia/Kolkata',
  }).toString()

  const promise = (async () => {
    try {
      const response = await fetch(url.toString())
      if (!response.ok) throw new Error(`Weather API request failed (${response.status})`)
      const data = await response.json()
      if (!Array.isArray(data.daily?.time)) return { status: 'unavailable', message: 'Weather forecast is unavailable.' }
      const days = data.daily.time.map((date, index) => ({
        date, code: data.daily.weather_code?.[index],
        temperatureMax: data.daily.temperature_2m_max?.[index],
        temperatureMin: data.daily.temperature_2m_min?.[index],
        rainProbability: data.daily.precipitation_probability_max?.[index] ?? null,
        description: getWeatherDescription(data.daily.weather_code?.[index]),
        icon: getWeatherIcon(data.daily.weather_code?.[index]),
      }))
      return { status: 'ready', days, timezone: data.timezone || 'Asia/Kolkata' }
    } catch (error) {
      console.error('Weather Error:', error)
      return { status: 'error', message: 'Unable to load weather information.' }
    }
  })()
  forecastCache.set(key, { createdAt: Date.now(), promise })
  const result = await promise
  if (result.status === 'error') forecastCache.delete(key)
  return result
}

export async function getWeatherForDate(locationName, date) {
  const target = typeof date === 'string' ? date : localDateString(date)
  if (target < localDateString()) return { status: 'unavailable', message: 'Past-date forecast is not available.' }
  const forecast = await getLocationForecast(locationName)
  if (forecast.status !== 'ready') return forecast
  const day = forecast.days.find((item) => item.date === target)
  if (!day) return { status: 'unavailable', message: 'Forecast not available yet.' }
  return { status: 'ready', ...day }
}

export function getEventWeather(event) {
  const key = `${event.id}:${event.date}:${event.zone}`
  if (!eventCache.has(key)) {
    const promise = getWeatherForDate(event.zone, event.date).then((result) => {
      if (result.status === 'error') eventCache.delete(key)
      return result
    })
    eventCache.set(key, promise)
  }
  return eventCache.get(key)
}
