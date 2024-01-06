import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/redux'
import $api from '../../http'
import { ITournaments } from '../../interface'
import { actionChangeListTournament } from '../../redux/reducer/listTournamentReducer'
import { cleanTournament } from '../../redux/reducer/tableTournamentReducer'
import { ItemTournament } from './ItemTournament/ItemTournament'

const Wrapper = styled.div`
  overflow-y: auto;
  align-self: flex-start;
  @media only screen and (max-width: 760px) {
    width: 100%;
  }
`

const NoTournament = styled.div`
  font-family: SubsoccerFont;
  font-style: normal;
  font-weight: normal;
  font-size: 50px;
  line-height: 60px;
  text-transform: uppercase;
  text-align: center;
`

const ListTournamentHeader = styled.ul`
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
    color: rgba(255, 255, 255, 0.8);

    &.active {
      color: white;
      padding-bottom: 5px;
      border-bottom: 2px solid #ffbc11;
    }
  }
`

const ListTournamentStatus = styled.div`
  font-weight: bold;
  font-size: 50px;
  line-height: 54px;
  letter-spacing: 0.006em;
  color: #ffffff;
  text-transform: uppercase;
  position: fixed;
  bottom: 15px;
  right: 15px;
  @media only screen and (max-width: 760px) {
    display: none;
  }
`
const DateTournaments = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 26px;
  letter-spacing: 0.006em;
  color: #ffffff;
  margin-top: 64px;
`
export const ListTournament: FC = () => {
  const [data, setData] = useState<any>()
  const [sortData, setSortData] = useState<ITournaments[]>()
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [drafted, setDrafted] = useState(false)
  const [clientWidth, setClientWidth] = useState(window.screen.width)
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
    $api
      .get('/tournaments')
      .then(({data}) => {
        setData(data.tournaments.reverse())
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
    return () => {
      dispatch(cleanTournament())
    }
  }, [deleted, drafted, dispatch])

  const { status } = useAppSelector(({ listTournament }) => listTournament)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  useEffect(() => {
    setSortData(
      data?.filter(item => {
        if (!item.date) return false; // return false if item.date is not defined

        const itemDate = new Date(item.date);
        const currentDate = new Date();

        return (
          (!item.drafts && itemDate.getTime() > currentDate.getTime()) ||
          (!item.drafts && itemDate.getDate() === currentDate.getDate())
        );
      })
    );
    if (status === 'Upcoming') {
      setSortData(
        data?.filter(item => {
          if (!item.date) return false; // Skip if item.date is not defined

          const itemDate = new Date(item.date);
          const currentDate = new Date();

          const isUpcomingDate = itemDate.getTime() > currentDate.getTime();
          const isToday = itemDate.getDate() === currentDate.getDate();

          return !item.started && !item.drafts && (isUpcomingDate || isToday);
        })
      );
    }
    if (status === 'Ongoing') {
      setSortData(data?.filter((item) => item.started && !item.ended_at))
    }
    if (status === 'Finished') {
      setSortData(data?.filter((item) => item.ended_at))
    }
    if (status === 'Drafts') {
      setSortData(data?.filter((item) => item.drafts))
    }
  }, [status, data])

  if (loading) {
    return <h1>Loading...</h1>
  }
  return (
    <Wrapper>
      {clientWidth < 768 && (
        <ListTournamentHeader>
          <li
            onClick={() => dispatch(actionChangeListTournament('Upcoming'))}
            className={`${status === 'Upcoming' ? 'active' : ''}`}
          >
            Upcoming
          </li>
          <li
            onClick={() => dispatch(actionChangeListTournament('Ongoing'))}
            className={`${status === 'Ongoing' ? 'active' : ''}`}
          >
            Ongoing
          </li>
          <li
            onClick={() => dispatch(actionChangeListTournament('Finished'))}
            className={`${status === 'Finished' ? 'active' : ''}`}
          >
            Finished
          </li>
          <li
            onClick={() => dispatch(actionChangeListTournament('Drafts'))}
            className={`${status === 'Drafts' ? 'active' : ''}`}
          >
            Drafts
          </li>
        </ListTournamentHeader>
      )}
      <div style={{ overflowY: 'scroll', height: '80vh', borderRadius: 10 }}>
        {data && sortData ? (
          <div>
            {sortData.map((item, index, array) => {
              if (!item.date) return null; // Skip if item.date is not defined

              const d = new Date(item.date);
              const month = monthNames[d.getMonth()];
              const year = d.getFullYear();

              const previousItemDate = index - 1 >= 0 ? array[index - 1].date : null;
              const previousDate = previousItemDate ? new Date(previousItemDate).getMonth() : -1;
              const currentDate = d.getMonth() !== previousDate;

              return (
                <div key={(item.creator || "") + index}>
                  {currentDate && (
                    <DateTournaments style={{ marginTop: index === 0 ? 0 : 64 }}>
                      {month} {year}
                    </DateTournaments>
                  )}
                  <ItemTournament
                    _id={item._id || ""}
                    date={item.date}
                    status={status}
                    onClick={() => navigate(`/tournament/${item._id}`)}
                    name={item.name || ""}
                    deleted={deleted}
                    drafted={drafted}
                    setDeleted={setDeleted}
                    setDrafted={setDrafted}
                    classic={item.classic || false}
                    place={item.place}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {sortData && sortData.length < 1 && (
        <NoTournament>No tournament yet</NoTournament>
      )}
      <ListTournamentStatus>{status}</ListTournamentStatus>
    </Wrapper>
  )
}
