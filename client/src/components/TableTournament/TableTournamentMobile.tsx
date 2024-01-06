import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import styled from 'styled-components'

import {useAppDispatch, useAppSelector} from '../../hooks/redux'
import $api from '../../http'
import {cleanTournament, tableTournamentActionUpdate,} from '../../redux/reducer/tableTournamentReducer'
import tournamentService, {tournamentTable,} from '../../services/tournamentService'
import socket from "../../socket";
import {CopyFooterMobile, PlayerMobile} from '..'

interface tournamentProps {
  showShare?: boolean;
}

export const TableTournamentMobile = (props: tournamentProps) => {
  const {showShare} = props
  const {
    tournament_bracket,
    name,
    place,
    date,
    _id,
    creator,
    ended_at,
    isLoading,
  } = useAppSelector(({tableTournament}) => tableTournament)
  const {user_id} = useAppSelector(({user}) => user)
  const [selectRound, setSelectRound] = useState(0)
  const dispatch = useAppDispatch()
  const {id} = useParams();
  const finishMatch =
    tournament_bracket[tournament_bracket.length - 1][0][0].finishMatch &&
    tournament_bracket[tournament_bracket.length - 1][0][1].finishMatch

  if (finishMatch) {
    if (!ended_at) {
      $api.patch(`/tournaments/${id}`, {id: id, ended_at: new Date()})
    }
  }

  const onChangeScore = (
    round: number,
    pair: number,
    playerIndex: number,
    subtract?: boolean,
  ) => {
    const copy: tournamentTable[] = JSON.parse(
      JSON.stringify(tournament_bracket),
    )
    let notChanged = false
    if (subtract) {
      if (copy[round][pair][playerIndex].score > 0) {
        copy[round][pair][playerIndex].score -= 1
      } else {
        notChanged = true
      }

    }
    if (!subtract) {
      if (
        copy[round][pair][playerIndex].score < 3 &&
        copy[round][pair][playerIndex === 1 ? 0 : 1].score < 3
      ) {
        copy[round][pair][playerIndex].score += 1;
      }
    }
    if (!notChanged) {
      dispatch(
        tableTournamentActionUpdate({
          id: id!,
          tournament_bracket: tournamentService.updateWin(copy),
        }),
      );
    }
  }
  const FinalRound = selectRound === tournament_bracket.length - 1

  useEffect(() => {
    return () => {
      dispatch(cleanTournament())
    }
  }, [])
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <TableTournamentMobileHeader>
        {tournament_bracket?.map((_, index, array) => {
          if (index === array.length - 1) {
            return (
              <li
                key={index}
                className={`${selectRound === index ? 'active' : ''}`}
                onClick={() => setSelectRound(index)}
                style={{color: user_id ? 'white' : 'black'}}
              >
                Final Round
              </li>
            )
          }
          return (
            <li
              key={index}
              className={`${selectRound === index ? 'active' : ''}`}
              onClick={() => setSelectRound(index)}
              style={{color: user_id ? 'white' : 'black'}}
            >
              Round {index + 1}
            </li>
          )
        })}
      </TableTournamentMobileHeader>
      <TableTournamentMobilContent>
        <TableTournamentMobilName color={user_id ? 'white' : 'black'}>
          {name}
        </TableTournamentMobilName>
        <TableTournamentMobilPlace color={user_id ? 'white' : 'black'}>
          {place}
        </TableTournamentMobilPlace>
        <TableTournamentMobilDate color={user_id ? 'white' : 'black'}>
          {new Date(date!).toDateString()}
        </TableTournamentMobilDate>
        {tournament_bracket![selectRound].map((pair, indexPair) => {
          return (
            <TableTournamentMobilePair key={indexPair + selectRound}>
              {pair.map((player, indexPlayer) => {
                return (
                  <PlayerMobile
                    key={indexPlayer + player.name + selectRound}
                    {...player}
                    pair={indexPair}
                    round={selectRound}
                    onChangeScore={onChangeScore}
                    player={indexPlayer}
                    finishWin={
                      selectRound === tournament_bracket.length - 1 &&
                      player.win
                    }
                    disabled={(user_id !== creator || player.disabled) && true}
                    finishMatch={player.finishMatch}
                    lastRound={FinalRound}
                  />
                )
              })}
            </TableTournamentMobilePair>
          )
        })}
      </TableTournamentMobilContent>
      <CopyFooterMobile finish={finishMatch} showShare={showShare}/>
    </>
  )
}

const TableTournamentMobileHeader = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  position: absolute;
  right: 0;
  left: 0;
  padding: 10px 20px;
  top: 120px;

  li {
    font-size: 24px;
    line-height: 25px;
    letter-spacing: 0.05em;
    color: #fff;

    &.active {
      color: #fff;
      padding-bottom: 5px;
      border-bottom: 2px solid #d30028;
    }
  }
`

const TableTournamentMobilContent = styled.div`
  padding-top: 10px;
  height: 96%;
  overflow-y: auto;
`
const TableTournamentMobilName = styled.h2<{ color?: string }>`
  font-size: 24px;
  line-height: 26px;
  letter-spacing: 0.006em;
  margin-top: 10px;
  color: ${({color}) => color || '#fff'};
`
const TableTournamentMobilPlace = styled.p<{ color?: string }>`
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.006em;
  font-weight: 100;
  color: ${({color}) => color || '#fff'};
`
const TableTournamentMobilDate = styled.p<{ color?: string }>`
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.006em;
  font-weight: 100;
  margin-bottom: 25px;
  color: ${({color}) => color || '#fff'};
`

const TableTournamentMobilePair = styled.div`
  margin: 14px 0;
`
