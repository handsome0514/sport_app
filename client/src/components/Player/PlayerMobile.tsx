import React, {FC} from 'react'
import styled from 'styled-components'

import plusSvg from '../../assets/svg/plus-solid.svg'
import starSvg from '../../assets/svg/star.svg'
import winSvg from '../../assets/svg/win.svg'
import {Flex} from '../../style/Custom'
import {PointHandlerBtn} from '../TableTournament/usePointHanlder'
import {subtract} from "lodash";

type PlayerMobileType = {
  name: string;
  score: number;
  win: boolean;
  finishWin: boolean;
  onChangeScore?: any;
  round: number;
  pair: number;
  player: number;
  disabled?: boolean;
  finishMatch: boolean;
  lastRound: boolean;
  team?: null | 'red' | 'blue';
};
export const PlayerMobile: FC<PlayerMobileType> = ({
                                                     lastRound,
                                                     name,
                                                     finishMatch,
                                                     score,
                                                     win,
                                                     disabled,
                                                     onChangeScore,
                                                     round,
                                                     pair,
                                                     player,
                                                     team,
                                                     finishWin,
                                                   }: PlayerMobileType) => {
  return (
    <PlayerMobileWrapper win={win} finishWin={finishWin}>
      <PlayerMobileName win={win} finishWin={finishWin}>
        {name}
        <Flex>
          <PlayerMobileButtonBox
            disabled={disabled! || win || finishMatch}
            onClick={() => onChangeScore(round, pair, player, false)}
            style={{opacity: (disabled! || win || finishMatch) ? 0.5 : 1}}
          >
            <PointHandlerBtn>+</PointHandlerBtn>
          </PlayerMobileButtonBox>
          <PlayerMobileButtonBox
            disabled={disabled! || win || finishMatch}
            onClick={() => onChangeScore(round, pair, player, true)}
            style={{opacity: (disabled! || win || finishMatch) ? 0.5 : 1}}
          >
            <PointHandlerBtn>-</PointHandlerBtn>
          </PlayerMobileButtonBox>
        </Flex>
      </PlayerMobileName>

      <PlayerMobileScoreBox team={team} lastRound={lastRound}>
        <PlayerMobileScore
          placeholder={'-'}
          disabled={disabled}
          type='number'
          value={score}
          onChange={(e) => {
            console.log(e)
          }}
        />
      </PlayerMobileScoreBox>
    </PlayerMobileWrapper>
  )
}

const PlayerMobileWrapper = styled.div<{
  win: boolean;
  finishWin: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 33px;
  background-color: white;
  margin-bottom: 3px;
  color: black;
  font-size: 20px;
  line-height: 21px;
  letter-spacing: 0.006em;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 4px;
  overflow: hidden;
  background: ${({win, finishWin}) =>
    finishWin
      ? 'linear-gradient(102.2deg, #FFBC11 -8.27%, rgba(255, 188, 17, 0) 83.13%), #CC2B24;'
      : win
        ? '#EDEDE8'
        : ''};
  position: relative;
  z-index: 100;
`

const PlayerMobileName = styled.div<{
  win: boolean;
  finishWin: boolean;
}>`
  width: 70%;
  padding: 0 0 0 11px;
  font-size: 14px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::after {
    content: '';
    display: ${({win}) => (win ? 'block' : 'none')};
    width: 14px;
    height: 14px;
    background-image: url(${({win, finishWin}) =>
      finishWin ? winSvg : win ? starSvg : ''});
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin-right: 11px;
  }
`
const PlayerMobileScoreBox = styled.div<{
  lastRound: boolean;
  team?: null | 'red' | 'blue';
}>`
  display: flex;
  align-items: center;
  width: 40%;
  height: 110%;
  background: ${({lastRound, team}) =>
    lastRound && !team
      ? 'linear-gradient(97.46deg, #429ABE -57.08%, rgba(66, 154, 190, 0) 57.19%), #002A3C;'
      : team === 'blue'
        ? '#0178C8'
        : '#D20028'};
`
const PlayerMobileScore = styled.input`
  width: 100%;
  height: 50%;
  background-color: transparent;
  outline: none;
  border: none;
  color: white;
  font-size: 20px;
  line-height: 21px;
  text-transform: uppercase;
  text-align: center;
  border-right: 1px solid white;
  border-radius: 0;
  user-select: none;
  pointer-events: none;

  &:last-child {
    border-right: none;
  }

  &:disabled,
  &::placeholder {
    color: white;
    opacity: 0.7;
  }

  &[type='number'] {
    font-family: resolve !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 21px;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }
`

const PlayerMobileButtonBox = styled.div<{
  disabled: boolean;
}>`
  right: 0;
  display: flex;
  visibility: ${({disabled}) => (disabled ? 'hidden' : 'visible')};
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 8px;
  background: #6a6e71;
    /* opacity: ${({disabled}) => (disabled ? 0.6 : 1)}; */
`
const PlayerMobileButton = styled.div`
  background-color: transparent;
  border: 1px solid white;
  width: 22px;
  height: 22px;
  color: white;
  font-size: 22px;
  border-radius: 2px;
  background-image: url(${plusSvg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 9px;
`
