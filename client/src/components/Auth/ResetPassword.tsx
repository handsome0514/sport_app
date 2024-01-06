import React, { FC } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router'
import { useFormik } from 'formik'
import styled from 'styled-components'
import * as Yup from 'yup'

import { useAppSelector } from '../../hooks/redux'
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

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
})

export const ResetPassword: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  console.log(userId)
  const { isLoading } = useAppSelector(({ user }) => user)
  const navigate = useNavigate()

  const {
    handleSubmit, handleChange, values, errors, touched 
  } = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
        await $api
          .post('/user/reset-password', {
            userId,
            password: values.password,
          })
          .then(() => {
            navigate('/login')
          })
      } catch (err) {
        console.log(err)
      }
    },
  })

  if (!isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <LoginStyled>
      <form onSubmit={handleSubmit}>
        <Box>
          <Title>Reset Password</Title>

          <Input
            type='password'
            name='password'
            label='password'
            placeholder={''}
            value={values.password}
            onChange={handleChange}
            errorString={
              errors.password && touched.password ? errors.password : undefined
            }
          />
          <Input
            type='password'
            name='passwordConfirmation'
            label='confirm password'
            placeholder={''}
            value={values.passwordConfirmation}
            onChange={handleChange}
            errorString={
              errors.passwordConfirmation &&
              touched.passwordConfirmation &&
              !errors.password
                ? errors.passwordConfirmation
                : undefined
            }
          />

          <Flex flex_direction={'column'}>
            <Button type='submit' style={{ marginBottom: 18 }}>
              Reset
            </Button>
          </Flex>
        </Box>
      </form>
    </LoginStyled>
  )
}
