import {RefObject, useEffect} from 'react'

const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  effect: () => void,
) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        effect()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
export default useClickOutside
