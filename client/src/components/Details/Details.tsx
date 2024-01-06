import React, { useState } from 'react'
import styled from 'styled-components'

import arrowDownSvg from '../../assets/svg/arrow_down.svg'

type DetailBoxProps = {
  open: boolean;
};
const DetailsBox = styled.div`
  position: absolute;
  bottom: 5%;
  right: 7%;
  width: 11%;
  display: flex;
  flex-direction: column;
  padding: 10px 30px 30px 20px;
  transition: all 0.5s ease;
  overflow: hidden;
  position: fixed;
  right: 0;
  color: #383d42;
  ${({ open }: DetailBoxProps) =>
  open
    ? `
    background-color:rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    width: 40%;

    `
    : `
    `}
`

const DetailsButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  margin-bottom: 10px;
  font-size: 1.5rem;
  padding: 5px 10px;
  border-radius: 4px;
  color: #fff;
  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 9px;
    background-image: url(${arrowDownSvg});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-left: 20px;
    transition: all 0.5s ease-in-out;
  }
  ${({ open }: DetailBoxProps) =>
  open
    ? `
    &::after {
        transform: rotate(180deg);
}
    `
    : `
    border: 2px solid white;

    `}
`

const DetailsInfo = styled.div`
  height: 0;
  visibility: hidden;
  opacity: 0;
  transition: all 0.5s ease;
  overflow: auto;
  font-family: 'ResolveSans';
  font-weight: 300;
  font-size: 16px;
  line-height: 16px;
  color: #fff;

  ${({ open }: DetailBoxProps) =>
  open &&
    `
    visibility: visible;
    opacity: 1;
    `}
`

type DetailsProps = {
  details: string | null;
};

export const Details = ({ details }: DetailsProps) => {
  const [open, setOpen] = useState(false)
  
  const detailSplit = () => {
    return details!.split('\n')
  }
  return (
    <DetailsBox open={open}>
      <DetailsButton open={open} onClick={() => setOpen(!open)}>
        Rules
      </DetailsButton>
      <DetailsInfo
        open={open}
        style={{ height: open ? 50 + detailSplit().length * 5 : 0 }}
      >
        <p style={{ marginBottom: 5 }}>Classic Rules:</p>
        <p>
          Game winner is player that wins two sets, each set is played to three
          points.
        </p>
        <p>Starting player is decided with Rock/Paper/Scissors.</p>
        {detailSplit().map((msg, index) => {
          return <p key={msg + index}>{msg}</p>
        })}
      </DetailsInfo>
    </DetailsBox>
  )
}
