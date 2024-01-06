import React from 'react'

import { Account } from '../../components'
import { InvitedAuth } from '../../components/Auth/InvitedAuth'
import { useAppSelector } from '../../hooks/redux'

export const Main = () => {
  const user = useAppSelector(({ user }) => user.user_id)

  if (user) {
    return <Account />
  }
  return <InvitedAuth />
}
