import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { useAppSelector } from '../../hooks/redux'
import { useInput } from '../../hooks/useInput'
import $api from '../../http'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    justify-content: center;
    width: 100%;
    h2 {
      margin-bottom: 40px;
    }
  }
`
const Title = styled.h2`
  margin-bottom: 46px;
`
const DivOr = styled.div`
  display: flex;
  color: #515151;
  justify-content: center;
  align-items: center;
  font-family: resolve;
  font-weight: 700;
  font-style: italic;
  font-size: 20px;
  line-height: 21px;
  position: relative;
  margin-bottom: 29px;
  // @media only screen and (max-width: 425px) {
  //     font-size: 12px;
  //   }
  &::before {
    content: '';
    display: block;
    width: 40%;
    height: 2px;
    background: linear-gradient(90.67deg, #cc2b24 22.54%, #ffbc11 158.72%);
    position: absolute;
    left: 0;
    bottom: 40%;
  }
  &::after {
    content: '';
    display: block;
    width: 40%;
    height: 2px;
    background: linear-gradient(90.67deg, #cc2b24 22.54%, #ffbc11 158.72%);
    transform: rotate(180deg);
    position: absolute;
    right: 0;
    bottom: 40%;
  }
`

const Box = styled.div`
  @media only screen and (max-width: 426px) {
    width: 100%;
    // input {
    // margin-bottom: 0px;
    // }
  }
`

export const InvitedAuth: FC = () => {
  const code = useInput('')
  const { user_email, user_id } = useAppSelector(({ user }) => user)
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const codeButtonHandlerClick = () => {
    $api
      .post('/tournament/code', {code_link: code.value.toLowerCase(),})
      .then(({ data }) => navigate(data.link))
      .catch(({ response }) => {
        setError(response?.data.message)
      })
  }
  return (
    <Wrapper
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          codeButtonHandlerClick()
        }
      }}
    >
      <Box>
        <Input
          {...code}
          label={''}
          type={'number'}
          placeholder={'tournament id'}
          errorString={error}
          style={error ? {} : { marginBottom: 20 }}
        />
        <Button
          style={{ marginBottom: 29, fontStyle: 'italic' }}
          onClick={codeButtonHandlerClick}
        >
          Find tournament
        </Button>
        <DivOr>or</DivOr>
        <Button
          primary
          style={{
            marginBottom: 9,
            backgroundColor: '#225F78',
            fontStyle: 'italic',
          }}
          onClick={() =>
            user_email && user_id ? navigate('/create') : navigate('/login')
          }
        >
          Create tournament
        </Button>
      </Box>
    </Wrapper>
  )
}
