import { useEffect, useState } from 'react'
import { getEventWeather } from '../utils/weather'

export function useEventWeather(event) {
  const [weather, setWeather] = useState({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setWeather({ status: 'loading' })
    getEventWeather(event).then((result) => {
      if (!cancelled) setWeather(result)
    })
    return () => {
      cancelled = true
    }
  }, [event])
  return weather
}
