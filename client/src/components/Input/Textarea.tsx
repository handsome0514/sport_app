import React from 'react'
import styled from 'styled-components'

const TextareaBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const TextareaStyled = styled.textarea`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 1.4vw;
  padding: 10px 10px;
  width: 25vw;
  height: 100%;
  border: none;
  outline: none;
  color: white;
  resize: none;
  overflow: hidden;
  margin-bottom: 10px;

  &::placeholder {
    font-size: 1.4vw;
    color: white;
    opacity: 0.9;
  }
  @media only screen and (max-width: 426px) {
    width: 100%;
    padding: 10px 10px;
    font-size: 26px;
  }
`
const Label = styled.label`
  font-size: 18px;
  line-height: 19px;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
  font-weight: 300;
  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`

type TextareaProps = {
  label: string;
  placeholder: string;
  onChange: any
};

export const Textarea = ({ label, placeholder, onChange }: TextareaProps) => {
  return (
    <TextareaBox>
      <Label>{label}</Label>
      <TextareaStyled
        placeholder={placeholder}
        onChange={onChange}
      />
    </TextareaBox>
  )
}
