import React, { FC, ReactNode } from 'react'

import { useAppSelector } from '../hooks/redux'

export const LayoutErrorApi: FC<{ children: ReactNode }> = ({ children }) => {
  const { error } = useAppSelector(({ errorServer }) => errorServer)

  if (error) {
    return (
      <div>
        <h1>Technical work will be introduced, come back later</h1>
      </div>
    )
  }
  return <div>{children}</div>
}
