import { useCallback, useRef } from 'react'

export const useDebounce: (callback: () => void, delay: number) => () => void = (callback, delay) => {

  const timer = useRef<any>()

  const debounceCallback = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      callback()
    }, delay)
  }, [callback, delay])

  return debounceCallback
}
