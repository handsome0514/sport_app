import {FC} from 'react'
import {CheckCircle} from '@styled-icons/bootstrap/CheckCircle'
import {ErrorOutline} from '@styled-icons/material-twotone/ErrorOutline'
import {ErrorWarning} from '@styled-icons/remix-line/ErrorWarning'
import styled from 'styled-components'

export interface SnackBarProps extends StyledSnackbarProps {
  message: string;
  callback?: () => void;
  hide: boolean;
}

type StyledSnackbarProps = {
  type: 'success' | 'warning' | 'error';
  timeout: number;
};

const StyledSnackbar = styled.div<StyledSnackbarProps>`
  position: absolute;
  z-index: 1000;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  > div {
    display: grid;
    grid-template-columns: 0.2fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 10px;
    grid-template-areas: '. .';
    align-items: center;
    animation-name: breath-animation;
    animation-duration: ${({timeout}) => timeout}ms;
    animation-iteration-count: 3;
    animation-timing-function: ease-in-out;
    background-color: ${({type}) =>
      type === 'success'
        ? '#C9F3DA'
        : type === 'error'
          ? '#FED7D7'
          : '#FEFCBF'};
    padding: 0.5rem 1rem;
    border-radius: 5px;
    color: ${({type}) =>
      type === 'success'
        ? '#2FBE2C'
        : type === 'error'
          ? '#AE1616'
          : '#C07E1A'};
  }
`

const Snackbar: FC<SnackBarProps> = ({
                                       type,
                                       message,
                                       timeout,
                                       callback,
                                       hide,
                                     }) => {
  if (hide) {
    return null
  }
  return (
    <StyledSnackbar onAnimationEnd={callback} type={type} timeout={timeout}>
      <div>
        <div>
          {type === 'success' ? (
            <CheckCircle size={20}/>
          ) : type === 'error' ? (
            <ErrorOutline size={20}/>
          ) : (
            <ErrorWarning size={20}/>
          )}
        </div>
        <div>{message}</div>
      </div>
    </StyledSnackbar>
  )
}

export default Snackbar
