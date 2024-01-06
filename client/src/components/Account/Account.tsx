import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import $api from '../../http'
import {
  AccountButton,
  AccountButtons,
  AccountFindTournaments,
  AccountInner,
  AccountTournamentButton,
  AccountTournamentId,
  AccountWrapper,
} from './Account.styled'

export const Account: FC = () => {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>('')
  const codeButtonHandlerClick = () => {
    $api
      .post('/tournament/code', {code_link: code.toLowerCase(),})
      .then(({ data }) => navigate(data.link))
      .catch(({ response }) => {
        setError(response?.data.message)
      })
  }

  return (
    <AccountWrapper>
      <AccountInner>
        <AccountButtons>
          <AccountButton
            color='linear-gradient(99.38deg, #F6BE0E -6.68%, rgba(255, 188, 17, 0) 79.97%), #C9302E;'
            onClick={() => navigate('/create')}
            style={{ fontStyle: 'italic' }}
          >
            Create Tournament
          </AccountButton>
          <AccountButton
            color='linear-gradient(96.82deg, #2158AA -41.1%, #0178C8 95.51%), #0085FF;'
            onClick={() => navigate('/tournament')}
            style={{ fontStyle: 'italic' }}
          >
            My tournament
          </AccountButton>
          <AccountButton
            color='linear-gradient(96.82deg, #2158AA -41.1%, #0178C8 95.51%), #0085FF;'
            onClick={() => navigate('/profile')}
            style={{ fontStyle: 'italic' }}
          >
            Profile
          </AccountButton>
        </AccountButtons>
        <AccountFindTournaments>
          {error && error}
          <AccountTournamentId
            type='number'
            onChange={(e) => setCode(e.target.value)}
            placeholder='Tournament ID'
            min={1}
          />
          <AccountTournamentButton
            onClick={codeButtonHandlerClick}
            style={{ fontStyle: 'italic' }}
          >
            Find tournament
          </AccountTournamentButton>
        </AccountFindTournaments>
      </AccountInner>
    </AccountWrapper>
  )
}
