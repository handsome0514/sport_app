import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { map } from 'lodash'
import * as _ from 'lodash'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import $api from '../../http'
import { ITournaments } from '../../interface'
import {
  cleanTournament,
  tableTournamentActionFetch,
} from '../../redux/reducer/tableTournamentReducer'
import socket from '../../socket'
import { Flex } from '../../style/Custom'
import { TableTournamentDiv } from '../TableTournament/TableTournamentDiv'

const Aside = styled.aside`
  width: 21vw;
  background: #f5f6f6;
  padding: 1.5rem;
  border-radius: 5px;
`
const Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  margin: 10px 0;
  transition: all 150ms ease-in-out;
  &:hover {
    transform: scale(0.95);
  }
`
const List = styled.ul`
  overflow-y: scroll;
  height: 60vh;
  list-style: none;
  &li {
    width: 100%;
  }
`
const CodeLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 15px;
  margin-bottom: 16px;
  text-align: center;
  cursor: pointer;
  background: rgba(12, 27, 35, 0.5);
  border-radius: 8px;
  font-size: 18px;
  line-height: 16px;
  text-transform: uppercase;
  color: white;
`

const AllTournaments: FC = () => {
  const { id } = useParams()
  const [copyLink, setCopyLink] = useState(false)

  const { user_id } = useAppSelector(({ user }) => user)
  const [sortData, setSortData] = useState<ITournaments[]>()

  const [showTournament, setShowTournament] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const dispatch = useAppDispatch()
  const today = new Date().toLocaleString('en-CA', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  useEffect(() => {
    fetchTournaments()
    return () => {
      dispatch(cleanTournament())
    }
  }, [])

  useEffect(() => {
    socket.on('new_tournament_added', ({ user }: any) => {
      if (user.userId == user_id) {
        fetchTournaments()
      }
    })
  }, [])
  const fetchTournaments = () => {
    $api
      .get('/tournament/all', {params: {sharingId: id,},})
      .then(({ data }) => {
        const filteredData = data?.filter(
          (item) => item.started && !item.ended_at,
        )
        const sortedByDate = _.orderBy(
          filteredData,
          [
            function(item) {
              return new Date(item.started_at!.toString())
            },
          ],
          ['desc'],
        )
        setSortData(sortedByDate)
        setLoading(false)
      })
      .catch(({ response }) => {
        setLoading(false)
      })
  }
  const handleClick = (id: string | null) => {
    setShowTournament(false)
    if (id) {
      dispatch(tableTournamentActionFetch(id)).then(() => {
        setShowTournament(true)
      })
    }
  }
  return (
    <Flex
      justify='space-between'
      align_items='center'
      style={{
        width: '100%',
        height: '80vh',
        margin: -10,
      }}
    >
      <Aside>
        {user_id && (
          <CodeLink
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setCopyLink(true)
              setTimeout(() => {
                setCopyLink(false)
              }, 4000)
            }}
          >
            <div
              style={{
                fontFamily: 'Montserrat',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {copyLink ? (
                <p style={{ color: '#D20028', fontSize: 16 }}> Copied!</p>
              ) : (
                'Share link'
              )}
            </div>
          </CodeLink>
        )}
        <h2
          style={{
            color: '#000',
            fontSize: 20,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Up Coming tournaments
        </h2>
        <h2
          style={{
            color: '#000',
            fontSize: 12,
            margin: '8px 0',
          }}
        >
          {today}
        </h2>
        {loading ? (
          'Loading...'
        ) : (
          <List>
            {map(sortData, (item) => {
              const formattedDate =
                item.started_at &&
                new Date(item.started_at).toLocaleString('en-CA', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })
              return (
                <li key={item._id}>
                  <Button
                    onClick={() => {
                      handleClick(item._id)
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h2 style={{ color: '#000', margin: 0 }}>{item.name}</h2>
                      <h2 style={{ color: '#00000070', margin: 0 }}>
                        {formattedDate}
                      </h2>
                    </div>
                  </Button>
                </li>
              )
            })}
          </List>
        )}
      </Aside>
      {showTournament && (
        <div style={{ width: '60vw', padding: '2rem' }}>
          <TableTournamentDiv showShare={false} />
        </div>
      )}
    </Flex>
  )
}

export default AllTournaments
