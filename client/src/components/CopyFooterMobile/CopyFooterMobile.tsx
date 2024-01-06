import React, { FC, useState } from 'react'

import {
  CopyFooterMobileCode,
  CopyFooterMobileText,
  CopyFooterMobileWrapper,
} from './copyFooterMobileStyled'

type CopyFooterMobileType = {
  finish: boolean;
  showShare?: boolean;
};

export const CopyFooterMobile: FC<CopyFooterMobileType> = ({
  finish,
  showShare,
}) => {
  const [copy, setCopy] = useState(false)
  return (
    <CopyFooterMobileWrapper showShare={showShare}>
      {showShare && (
        <CopyFooterMobileText>
          <p
            onClick={() => {
              setCopy(true)
              navigator.clipboard.writeText(window.location.href)
              setTimeout(() => {
                setCopy(false)
              }, 3000)
            }}
          >
            {copy ? 'Tournament Link Copied!' : 'Share Tournament'}
          </p>
        </CopyFooterMobileText>
      )}
      <CopyFooterMobileCode>
        Tournament status: {finish ? 'Complete' : 'Started'}
      </CopyFooterMobileCode>
    </CopyFooterMobileWrapper>
  )
}
