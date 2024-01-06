import React from 'react'
import styled from 'styled-components'

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  flex: 1;
  position: relative;
  @media only screen and (max-width: 426px) {
    // margin-bottom: 5px;
  }
`
const InputType = styled.input<InputTypeProps>`
  &[type='date'] {
    -webkit-appearance: none;
    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      filter: invert(100%);
    }
  }
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  font-family: resolve;
  font-size: 20px;
  font-weight: 300;
  padding: 0 14px;
  width: max(25vw, 100%);
  height: 7vh;
  border: none;
  outline: none;
  color: #383d42;
  border: 2px solid ${({ error }) => (error ? '#CE482B' : '#FFFFFF')};
  &::placeholder {
    font-family: resolve;
    text-align: center;
    font-size: 20px;
    color: #383d42;
    letter-spacing: 0.05em;
    font-weight: 300;
    opacity: 0.9;
    text-transform: uppercase;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  @media only screen and (max-width: 426px) {
    width: 100%;
    padding: 10px 18px;
    height: 50px;
  }
  @media only screen and (max-width: 768px) {
    &::-webkit-calendar-picker-indicator {
      -webkit-appearance: none;
    }
  }
`
export const Label = styled.label`
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.06em;
  margin-bottom: 5px;
  font-weight: 300;
  color: #383d42;
  @media only screen and (max-width: 425px) {
    font-size: 16px;
  }
`
export const Error = styled.div<InputTypeProps>`
  position: absolute;
  font-weight: 400;
  bottom: -23px;
  right: 0;
  left: 0;
  text-align: center;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.06em;
  color: #ce482b;
`
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: 'text' | 'number' | 'password' | 'date' | 'email';
  label: string;
  placeholder: string;
  style?: any;
  labelStyle?: any;
  value?: any;
  errorString?: string | [];
  min?: any;
  error?: string | false | undefined;
  valid?: boolean;
}

type InputTypeProps = {
  error?: boolean;
};

export const Input = ({
  errorString,
  min,
  label,
  placeholder,
  type,
  onChange,
  style,
  labelStyle,
  value,
  name,
}: InputProps) => {
  return (
    <>
      <InputBox style={{ ...style }}>
        <Label style={{ ...labelStyle }}>{label}</Label>
        <InputType
          placeholder={placeholder}
          onChange={onChange}
          type={type}
          value={value}
          error={!!errorString}
          min={min}
          name={name}
        />

        {!!errorString && <Error error={!!errorString}>{errorString}</Error>}
      </InputBox>
    </>
  )
}
