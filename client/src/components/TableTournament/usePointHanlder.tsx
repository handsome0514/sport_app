import {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

import {Flex} from '../../style/Custom'
import useClickOutside from './useCickOutside'

const PoinHandlerContainer = styled.div`
  position: absolute;
  right: -45%;
  top: 50%;
  z-index: 99;
  transform: translateY(-50%);
  height: 100%;
  background: #7c757a;
  border-radius: 3px;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 42%;
`
export const PointHandlerBtn = styled.button`
  color: #fff;
  background: transparent;
  border: 1px solid #fff;
  width: 25px;
  height: 25px;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: transform 300ms ease;

  :hover {
    transform: scale(0.9);
  }
`
const Value = styled.span`
  background: #fff;
  color: #000;
  width: 25px;
  height: 25px;
  padding: auto;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  border-radius: 2px;
`
const ActionButton = styled.button`
  flex: 0.8;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 300ms ease;

  :hover {
    transform: scale(0.9);
  }
`
const usePointHandler = () => {
  const promiseRef = useRef<((value: unknown) => void) | null>(null)

  const [value, setValue] = useState<number>(0)
  const [hidden, setHidden] = useState<boolean>(true)

  const handleIncrement = () => {
    setValue((prev) => prev + 1)
  }
  const handleDecrement = () => {
    if (value !== 0) {
      setValue((prev) => prev - 1)
    }
  }
  const handleReset = () => {
    if (value !== 0) {
      setValue(0)
    }
  }
  const handleConfirm = () => {
    setHidden(true)
    if (promiseRef.current) {
      promiseRef.current(value)
    }
  }

  const pointhandler = () => {
    return new Promise((resolve) => {
      promiseRef.current = resolve
    })
  }

  useEffect(() => {
    return () => {
      promiseRef.current = null
    }
  }, [])
  const handlePoints = async(score: number) => {
    setValue(score)
    setHidden(false)
    return await pointhandler()
  }

  const PointHandler = () => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    useClickOutside(wrapperRef, () => {
      setHidden(true)
    })

    if (hidden) {
      return null
    }
    return (
      <PoinHandlerContainer ref={wrapperRef}>
        <Flex justify='space-between' style={{flex: 1}}>
          <PointHandlerBtn disabled={value === 0} onClick={handleDecrement}>
            -
          </PointHandlerBtn>{' '}
          <Value>{value}</Value>
          <PointHandlerBtn onClick={handleIncrement}>+</PointHandlerBtn>
        </Flex>
        <Flex justify='space-between' style={{flex: 0.7, width: '100%'}}>
          <ActionButton disabled={value === 0} onClick={handleReset}>
            reset
          </ActionButton>
          <span style={{flex: 0.1}}/>
          <ActionButton onClick={handleConfirm}>confirm</ActionButton>
        </Flex>
      </PoinHandlerContainer>
    )
  }
  return {
    handlePoints,
    PointHandler,
  }
}

export default usePointHandler
