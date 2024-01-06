import React, { CSSProperties, FC } from 'react'
import styled from 'styled-components'

const ButtonStyled = styled.button`
  width: ${({ large, small, medium }: ButtonProps) =>
    `${large ? 25 : medium ? 11 : small ? 25 / 3 : 25}vw`};
  height: 7vh;
  border-radius: 10px;
  background: ${({ primary }: ButtonProps) =>
      primary
        ? 'linear-gradient(96.82deg, #0085FF -41.1%, #005071 95.51%), #0085FF;'
        : 'linear-gradient(99.38deg, #F6BE0E -6.68%, rgba(255, 188, 17, 0) 79.97%), #C9302E'};
  color: white;
  border: none;
  font-weight: 700;
  font-family: resolve;
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  align-self: center;
  letter-spacing: 0.006em;
  text-transform: uppercase;
  cursor: pointer;
  text-transform: uppercase;
  @media only screen and (max-width: 768px) {
    font-size: 20px;
    line-height: 21px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    width: 100%;
    height: 57px;
  }
  transition: all 200ms ease-in-out;
  &:hover {
    background-color: ${({ primary }: ButtonProps) =>
          primary ? '#225F78' : '#CE482B '};
    transform: scale(0.95);
  }
`

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactChild | React.ReactNode;
  large?: boolean;
  small?: boolean;
  medium?: boolean;
  primary?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
}
export const Button: FC<ButtonProps> = ({ children, style, ...props }) => {
  return (
    <ButtonStyled style={style} {...props}>
      {children}
    </ButtonStyled>
  )
}
