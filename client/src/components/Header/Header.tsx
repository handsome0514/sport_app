import React, { memo, useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'

import logoSvg from '../../assets/img/logo.png'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import {
  actionChangeListTournament,
  TournamentStates,
} from '../../redux/reducer/listTournamentReducer'
import { actionUserLogout } from '../../redux/reducer/userReducer'
import { Burger } from './Burger'
import {
  HeaderDiv,
  HeaderDropDown,
  HeaderNav,
  HeaderNavLink,
  List,
  Logo,
  NavLinkDrop,
} from './Headet.styled'

export const Header = memo(() => {
  const selectData: TournamentStates[] = [
    'Upcoming',
    'Ongoing',
    'Finished',
    'Drafts',
  ]
  const [clientWidth, setClientWidth] = useState(window.screen.width)
  const [openSelect, setOpenSelect] = useState(false)
  const { status } = useAppSelector(({ listTournament }) => listTournament)
  const { user_id, sharingId } = useAppSelector(({ user }) => user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const selectHandlerClick = (index: TournamentStates) => {
    setOpenSelect(false)
    dispatch(actionChangeListTournament(index))
    navigate('/tournament')
  }

  const buttonLogoutHandlerClick = () => {
    dispatch(actionUserLogout()).then(() => navigate(-1))
  }
  useEffect(() => {
    const closeMenu = () => {
      setOpenSelect(false)
    }
    window.addEventListener('resize', () =>
      setClientWidth(window.screen.width),
    )
    window.addEventListener('click', closeMenu)
    return () => {
      window.removeEventListener('resize', () =>
        setClientWidth(window.screen.width),
      )
      window.removeEventListener('click', closeMenu)
    }
  }, [clientWidth])

  if (user_id) {
    return (
      <HeaderDiv>
        <Link to='/'>
          <Logo>
            <img width={120} src={logoSvg} alt='subsoccer' />
          </Logo>
        </Link>
        {clientWidth < 767 && <Burger />}

        {clientWidth >= 768 && (
          <HeaderNav>
            {clientWidth >= 2560 && (
              <HeaderNavLink to={`/all/${sharingId}`}>TV View</HeaderNavLink>
            )}
             <HeaderNavLink to={`/player-card/${user_id}`}>Player Card</HeaderNavLink>
            <HeaderNavLink to={'/create'}>Create tournament</HeaderNavLink>
            <NavLinkDrop
              onClick={(e) => {
                setOpenSelect(true)
                e.stopPropagation()
              }}
            >
              LIST OF TOURNAMENTS
              <HeaderDropDown className={openSelect ? 'active' : ''}>
                <List>
                  {selectData.map((item, index, array) => (
                    <li
                      className={`${item === status ? 'active' : ''}`}
                      key={index}
                      onClick={() => selectHandlerClick(array[index])}
                    >
                      {item}
                    </li>
                  ))}
                </List>
              </HeaderDropDown>
            </NavLinkDrop>

            <HeaderNavLink to={'/profile'}>Profile</HeaderNavLink>
            <div onClick={buttonLogoutHandlerClick}>Log out</div>
          </HeaderNav>
        )}
      </HeaderDiv>
    )
  }
  return (
    <HeaderDiv>
      <Link to='/'>
        <Logo>
          <img width={120} src={logoSvg} alt='subsoccer' />
        </Logo >
      </Link>
      {clientWidth < 767 && <Burger />}
      {clientWidth >= 768 && (
        <HeaderNav>
          <HeaderNavLink to={'/login'}>Log in</HeaderNavLink>
        </HeaderNav>
      )}
    </HeaderDiv>
  )
})
