import React, { FC } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/redux'
import $api from '../../http'
import { Flex } from '../../style/Custom'
import { Button } from '../Button/Button'

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
export const ActivateUser: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector(({ user }) => user)
  const buttonActivateHandlerClick = async(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    $api
      .get(`/user/activate?link=${id}`)
      .then(() => navigate('/'))
  }

  if (!isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <LoginStyled>
      <Box>
        <Title>Activate Account</Title>
        <Flex flex_direction={'column'}>
          <Button onClick={buttonActivateHandlerClick}>
            Click here to activate account
          </Button>
        </Flex>
      </Box>
    </LoginStyled>
  )
}
