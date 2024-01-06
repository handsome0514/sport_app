import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { TableTournamentDiv, TableTournamentMobile } from '../../components'
import { ListInvitedPlayer } from '../../components/ListInvitedPlayer/ListInvitedPlayer'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { tableTournamentActionFetch } from '../../redux/reducer/tableTournamentReducer'

export const TournamentBracket: FC = () => {
  const dispatch = useAppDispatch()
  const tableTournament = useAppSelector(
    ({ tableTournament }) => tableTournament,
  )

  const { id } = useParams<{ id?: string }>()

  const [clientWidth, setClientWidth] = useState(window.screen.width)
  useEffect(() => {
    window.addEventListener('resize', () =>
      setClientWidth(window.screen.width),
    )
    return () => {
      window.removeEventListener('resize', () =>
        setClientWidth(window.screen.width),
      )
    }
  }, [clientWidth])

  useEffect(() => {
    if (id) {
      dispatch(tableTournamentActionFetch(id))
    }
  }, [id, dispatch])

  if (tableTournament.isLoading) {
    return <h1>Loading...</h1>
  }
  if (!(tableTournament._id || id) && tableTournament.isLoading) {
    return <h2>Tournament not found or deleted</h2>
  }
  if (!tableTournament.started) {
    return <ListInvitedPlayer data={tableTournament} />
  }
  return clientWidth < 768 ? (
    <TableTournamentMobile showShare={true} />
  ) : (
    <TableTournamentDiv showShare={true} />
  )
}
