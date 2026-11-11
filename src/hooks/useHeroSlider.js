import { useEffect, useState } from 'react'

// Rotates through `length` items every 4s with a 350ms fade (as in the original).
export function useHeroSlider(length) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    let swap
    const timer = setInterval(() => {
      setFading(true)
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % length)
        setFading(false)
      }, 350)
    }, 4000)
    return () => {
      clearInterval(timer)
      clearTimeout(swap)
    }
  }, [length])
  return { index, fading }
}
