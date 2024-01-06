import styled from 'styled-components'

import shareSvg from '../../assets/svg/share.svg'

export const CopyFooterMobileWrapper = styled.div<{ showShare?: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  z-index: 1000;
  display: flex;
  justify-content: ${(props) => (props.showShare ? 'space-between' : 'end')};
  align-items: center;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: 0;
    right: 0;
    height: 100%;
    transform: rotate(180deg);
    background: linear-gradient(
        97.46deg,
        #429abe -57.08%,
        rgba(66, 154, 190, 0) 57.19%
      ),
      #002a3c;
  }
  @media only screen and (min-width: 768px) {
    display: none;
  }
`
export const CopyFooterMobileText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  font-weight: bold;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0.006em;
  text-transform: uppercase;
  color: #ffffff;
  position: relative;
  z-index: 1;
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    display: block;
    background-image: url(${shareSvg});
    background-repeat: no-repeat;
    margin-right: 10px;
  }
`

export const CopyFooterMobileCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  font-weight: bold;
  font-size: 1rem;
  line-height: 21px;
  letter-spacing: 0.01em;
  color: #ffffff;
`
