import React, {
  FC,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {Route, Routes, useLocation} from 'react-router-dom'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import styled from 'styled-components'

import './index.css'
import footerMobile from './assets/img/footer_mobile.png'
import {
  ActivateUser,
  ForgotPassword,
  Header,
  Login,
  Registration,
  ResetPassword,
} from './components'
import AllTournaments from './components/AllTounnaments'
import ErrorBoundary from './components/ErrorBoundary'
import {generateBackground} from './helpers/generateBackground'
import {
  useAppDispatch,
  useAppSelector,
  useShallowEqualSelector,
} from './hooks/redux'
import {
  AccountPage,
  CreateTournament,
  Main,
  PlayerPage,
  ProfilePage,
  Tournament,
  TournamentBracket
} from './Pages'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import Support from './Pages/Support'
import {actionUserAuth} from './redux/reducer/userReducer'

const Wrapper = styled.div<{ loggedIn?: boolean; clientWidth: number }>`
  display: flex;
  flex-direction: column;
  color: white;
  overflow: ${({clientWidth}) => (clientWidth < 768 ? 'scroll' : 'hidden')};
  background: ${({loggedIn}) => generateBackground(loggedIn)};

  background-size: 35vw, cover;
  min-height: 100vh;
  @media only screen and (max-width: 768px) {
    background-repeat: no-repeat;
    background-position: 0 0px;
    background-size: cover;
  }
`

const FooterMobile = styled.div<{ loggedIn?: boolean }>`
  height: 161px;
  width: 100%;
  background: url(${({loggedIn}) => (loggedIn ? footerMobile : '')});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 1px;
  z-index: 900;
`
const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2% 6%;
  flex: 1;
`
const Content: FC<{ children: ReactNode }> = ({children}) => (
  <ErrorBoundary>
    <ContentInner>{children}</ContentInner>
  </ErrorBoundary>
)

export const App = () => {
  const location = useLocation()

  const dispatch = useAppDispatch()
  const [clientWidth, setClientWidth] = useState(window.screen.width)
  const {user_email, isLoading} = useShallowEqualSelector(({user}) => {
    return user
  })

  const {_id, started} = useAppSelector(
    ({tableTournament}) => tableTournament,
  )

  useLayoutEffect(() => {
    window.addEventListener('resize', () =>
      setClientWidth(window.screen.width),
    )
    window.addEventListener('orientationchange', () =>
      setClientWidth(window.screen.width),
    )
    return () => {
      window.removeEventListener('resize', () =>
        setClientWidth(window.screen.width),
      )
      window.removeEventListener('orientationchange', () =>
        setClientWidth(window.screen.width),
      )
    }
  }, [clientWidth])

  const firstLoad = useRef<boolean | null>(true)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      dispatch(actionUserAuth())
    }
    return () => {
      firstLoad.current = null
    }
  }, [dispatch])

  if (isLoading && firstLoad.current) {
    return (
      <Wrapper clientWidth={clientWidth}>
        <Content>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2>Loading...</h2>
          </div>
        </Content>
      </Wrapper>
    )
  }
  if (!user_email) {
    return (
      <Wrapper clientWidth={clientWidth}>
        <Header/>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames='slide'
            timeout={1500}
          >
            <Content>
              <Routes>
                <Route path='/' element={<Main/>}/>
                <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
                <Route path='/support' element={<Support/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/registration' element={<Registration/>}/>
                <Route path='/player-card/:id' element={<PlayerPage/>}/>
                <Route
                  path='/tournament/:_id'
                  element={<TournamentBracket/>}
                />
                {clientWidth >= 2560 && (
                  <Route path='/all/:_id' element={<AllTournaments/>}/>
                )}
                <Route path='/forgotpassword' element={<ForgotPassword/>}/>
                <Route
                  path='/reset-password/:userId'
                  element={<ResetPassword/>}
                />
                <Route path='*' element={<Main/>}/>
              </Routes>
            </Content>
          </CSSTransition>
        </TransitionGroup>
        {clientWidth < 768 && (
          <FooterMobile loggedIn={_id || started ? false : true}/>
        )}
      </Wrapper>
    )
  }
  return (
    <Wrapper clientWidth={clientWidth} loggedIn={true}>
      <Header/>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames='slide'
          timeout={1500}
        >
          <Content>
            <Routes>
              <Route path='/' element={<Main/>}/>
              <Route path='/tournament/:id' element={<TournamentBracket/>}/>
              <Route path='/tournament' element={<Tournament/>}/>
              <Route path='/create' element={<CreateTournament/>}/>
              <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
              <Route path='/account' element={<AccountPage/>}/>
              <Route path='/profile' element={<ProfilePage/>}/>
              <Route path='/player-card/:id' element={<PlayerPage/>}/>
              {clientWidth >= 2560 && (
                <Route path='/all/:_id' element={<AllTournaments/>}/>
              )}
              <Route path='/activate/:_id' element={<ActivateUser/>}/>
              <Route path='*' element={<Main/>}/>
            </Routes>
          </Content>
        </CSSTransition>
      </TransitionGroup>
      {clientWidth < 768 && <FooterMobile/>}
    </Wrapper>
  )
}
