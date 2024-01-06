import React, { FC, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { useInput } from '../../hooks/useInput'
import { actionUserLogin } from '../../redux/reducer/userReducer'
import { Flex } from '../../style/Custom'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

const LoginStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    justify-content: center;
    width: 100%;
  }
`

const Box = styled.div`
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    justify-content: flex-start;
    width: 100%;
    h2 {
      margin-bottom: 30px;
    }
  }
`
const CreateAccount = styled.span`
  cursor: pointer;
  color: #383d42;
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.06em;
  text-decoration-line: underline;
  &:hover {
    color: #f95050;
  }
`
const ForgotPassowrd = styled.span`
  cursor: pointer;
  color: #383d42;
  text-align: center;
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.06em;
  text-decoration-line: underline;
  margin: 10px 0;
  &:hover {
    color: #f95050;
  }
`

const Title = styled.h2`
  font-family: resolve;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.016em;
  color: #383d42;
  margin-bottom: 26px;
`
export const Login: FC = () => {
  const firstLoad = useRef(true)
  useEffect(() => {
    if (firstLoad.current && user_email && user_id) {
      firstLoad.current = false
      navigate('/acount')
    }
  }, [])

  const email = useInput('')
  const password = useInput('')
  const dispatch = useAppDispatch()
  const {
    isLoading, error, user_email, user_id
  } = useAppSelector(
    ({ user }) => user,
  )
  const navigate = useNavigate()
  const buttonLoginHandlerClick = async(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    dispatch(
      actionUserLogin({
        user_email: email.value.toLocaleLowerCase(),
        password: password.value,
      }),
    ).then(() => {
      navigate('/profile')
    })
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  const passwordBoxErrorStyle = { marginBottom: 33 }

  return (
    <LoginStyled>
      <Box>
        <Title>Log In</Title>
        <Input {...email} type={'text'} placeholder={''} label={'Email'} />
        {/* <br /> */}
        <Input
          style={error ? passwordBoxErrorStyle : {}}
          {...password}
          type={'password'}
          placeholder={''}
          label={'Password'}
          errorString={error!}
        />
        <Flex flex_direction={'column'}>
          <Button
            style={{ marginBottom: 18 }}
            onClick={buttonLoginHandlerClick}
          >
            Continue
          </Button>
          {/* <br /> */}
          <ForgotPassowrd onClick={() => navigate('/forgotpassword')}>
            Forgot Password?
          </ForgotPassowrd>
          <CreateAccount onClick={() => navigate('/registration')}>
            Click here to create account
          </CreateAccount>
        </Flex>
      </Box>
    </LoginStyled>
  )
}
