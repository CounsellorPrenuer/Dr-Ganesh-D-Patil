import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(threshold = 0.1, rootMargin = '0px 0px -50px 0px') {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, we can disconnect the observer for this element
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin])

  return { elementRef, isVisible }
}

export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const { elementRef, isVisible } = useScrollAnimation<T>()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShouldAnimate(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, delay])

  return { elementRef, shouldAnimate }
}