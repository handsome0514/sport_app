import React, { FC } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/redux'
import { useInput } from '../../hooks/useInput'
import $api from '../../http'
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

const Title = styled.h2`
  font-family: resolve;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: 0.016em;
  color: #383d42;
  margin-bottom: 26px;
`

const Text = styled.p`
  color: #383d42;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.06em;
  margin: 20px 0;
`
export const ForgotPassword: FC = () => {
  const email = useInput('')
  const navigate = useNavigate()

  const { isLoading } = useAppSelector(({ user }) => user)
  const buttonSendEmailHandlerClick = async(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    // send email request
    if (email.value) {
      await $api
        .post('/user/forgot-password', {email: email.value,})
        .then(() => {
          navigate('/login')
        })
    }
  }

  if (!isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <LoginStyled>
      <Box>
        <Title>Forgot Password?</Title>
        <Input {...email} type={'text'} placeholder={''} label={'Email'} />
        <Text>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Text>
        <Flex flex_direction={'column'}>
          <Button
            style={{ marginBottom: 18 }}
            onClick={buttonSendEmailHandlerClick}
          >
            Continue
          </Button>
        </Flex>
      </Box>
    </LoginStyled>
  )
}
