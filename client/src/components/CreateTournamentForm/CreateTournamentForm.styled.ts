import styled from 'styled-components'
import { BackgroundColor } from 'styled-icons/foundation'

export const Tournament = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  padding: 0 20%;
  input[type='text'],
  textarea {
    font-family: 'resolve';
    font-size: 18px;
    line-height: 19px;
    letter-spacing: 0.06em;
    font-weight: 300;
  }
  @media only screen and (max-width: 426px) {
    flex-direction: column;
    align-items: baseline;
    justify-content: flex-start;
    width: 100%;
    padding: 0 0;
    height: 80vh;
  }
`
export const Box = styled.div`
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 20px;
  @media only screen and (max-width: 426px) {
    display: block;
    width: 100%;
  }
`

export const BoxItem = styled.div`
  align-self: flex-start;
  width: 100%;
  display: flex;
  flex-direction: column;
  ul {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  li {
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    letter-spacing: 0.006em;
    width: 250px;
    margin-bottom: 20px;
  }
`

export const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  z-index: 1000;
  padding-bottom: 20px;
  @media only screen and (max-width: 425px) {
    justify-content: space-between;
  }
`

export const Input = styled.input`
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #ffffff;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 300;
  padding: 14px;
  width: 100%;
  height: 50px;
  outline: none;
  color: white;
  margin-bottom: 0;
  &::placeholder {
    font-family: resolve;
    font-size: 14px;
    color: white;
    opacity: 0.9;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type='date'] {
    -webkit-appearance: none;
    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      filter: invert(100%);
    }
  }
  &[type='radio'] {
    margin-right: 5px;
    padding: 8px;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    width: 10px;
    height: 10px;
    border: 1px solid #fff;
    border-radius: 50%;
    display: grid;
    place-content: center;
  }

  &[type='radio']::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: scale(0);
    transition: 200ms transform ease-in-out;
    background: #fff;
  }
  &[type='radio']:checked::before {
    transform: scale(1);
  }
`
export const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 18px;
  font-weight: 300;
  padding: 14px;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  color: white;
  margin-bottom: 6px;
`
export const Button = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 55px;
  border-radius: 10px;
  background: ${({ color, disabled }) => (disabled ? 'gray' : color)};
  color: white;
  border: none;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  text-transform: uppercase;
  padding: 17px 30px;
  @media only screen and (max-width: 768px) {
    font-size: 20px;
    line-height: 21px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    width: 100%;
    height: 50px;
  }
  &:hover {
  }
`

export const InputBox = styled.div<{
  error?: boolean;
}>`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  label {
    font-family: resolve;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.06em;
    margin-bottom: 2px;
    font-weight: 300;
    ${({ error }) =>
  error &&
      `
        &::after{
          content: '*';
          font-family: open-sans;
          font-size: 20px;
          color: red;
          margin-left: 2px;
      }
    `}
    @media only screen and (max-width: 425px) {
      font-size: 16px;
    }
  }
`
type TeamButtonProps = {
  backgroundColor: string;
  active: boolean;
};
export const TeamButton = styled.button<TeamButtonProps>`
  background: ${({ backgroundColor }: { backgroundColor: string }) =>
  backgroundColor};
  outline: none;
  border: none;
  position: relative;
  flex: 0.4;
  height: 40px;
  border-radius: 5px;
  color: #fff;
  text-transform: uppercase;
  font-size: 18px;
  padding-left: 10px;
  font-weight: 400;
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    background: #fff;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    background: ${({ active }: { active: boolean }) =>
    active ? '#bfbfbf' : '#fff'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: 12.5px;
    top: 50%;
    transform: translateY(-50%)
      scale(${({ active }: { active: boolean }) => (active ? 1 : 0)});
    transition: all 300ms ease-in-out;
  }
`
export const StyledSelect = styled.select`
  width: 100%;
  padding: 14px;
  outline-style: none;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #ffffff;
  border-radius: 8px;
  color: white;
  height: 50px;
`;

export const Option = styled.option`
  padding: 7px;
  font-size: 18px;
  background-color: gray;
`;
export const Label = styled.label`
  margin-top: 20px;
`;
