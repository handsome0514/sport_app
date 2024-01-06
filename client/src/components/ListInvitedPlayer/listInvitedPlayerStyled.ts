import styled from 'styled-components'

import checkSvg from '../../assets/svg/check.svg'
import userSvg from '../../assets/svg/user.svg'

type ItemPlayerProps = {
  selected?: boolean;
  registered?: boolean;
  team?: null | 'red' | 'blue';
};

export const ListPlayerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    button {
      width: 177px;
    }
  }
`
export const CodeLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  min-width: 350px;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border: 2px dashed #ffffff;
  border-radius: 8px;
  font-size: 18px;
  line-height: 16px;
  text-transform: uppercase;
  color: #000000;
  p {
    margin-left: 10px;
    font-weight: bold;
    font-size: 24px;
    line-height: 26px;
    letter-spacing: 0.01em;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
`
export const ListPlayerTableList = styled.div`
  height: 455px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 10px;
    height: 10%;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    margin-top: 140px;
    margin-bottom: 40px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 5px;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
    height: auto;
  }
`
export const ListPlayerTableListInfo = styled.div`
  font-size: 50px;
  line-height: 60px;
  display: flex;
  align-items: center;
  letter-spacing: 0.006em;
  color: #ffffff;
  margin-bottom: 50px;
  text-transform: uppercase;
`

export const ListPlayerTableListPair = styled.div`
  margin-bottom: 21px;
`
type ListPlayerTableListPlayerProps = {
  team?: null | 'blue' | 'red';
};
export const ListPlayerTableListPlayer = styled.div<ListPlayerTableListPlayerProps>`
  width: 200px;
  background: ${({ team }) =>
  team ? (team === 'blue' ? '#0178C8' : '#D20028') : '#fff'};
  border-radius: 4px;
  padding: 7px 14px;
  font-weight: bold;
  font-size: 17px;
  line-height: 18px;
  letter-spacing: 0.006em;
  text-transform: uppercase;
  color: ${({ team }) => (team ? '#fff' : '#000')};
  margin-bottom: 2px;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

export const ListPlayer = styled.div`
  text-align: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`

export const ListPlayerTitle = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.006em;
  color: #ffffff;
  margin-bottom: 34px;
`
export const ListPlayerInner = styled.div`
  max-height: 300px;
  margin-bottom: 10px;
  overflow: auto;
`

export const ItemsPlayer = styled.div`
  height: 260px;
  overflow-y: auto;
  @media only screen and (max-width: 768px) {
    height: 155px;
  }
`
export const AddNewPlayer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60px;
  input {
    width: 100%;
  }
`
export const ItemPlayer = styled.div<ItemPlayerProps>`
  background-color: ${({ team }) =>
  team ? (team === 'red' ? 'red' : 'blue') : 'rgba(255, 255, 255, 0.2)'};
  margin-bottom: 10px;
  padding: 10px 23px 10px 39px;
  border-radius: 4px;
  font-family: 'Montserrat';
  font-size: 20px;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  ${({ selected }) =>
    selected &&
    `
    background-color: rgba(255,255,255,.4);
    &::after{
    content: '';
    display: block;
    width: 16px;
    height: 12px;
    background-image: url(${checkSvg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
`}
  ${({ registered }) =>
      registered &&
    `
&::before {
    content: '';
    position: absolute;
    display: block;
    width: 10px;
    height: 10px;
    left: 16px;
    background-image: url(${userSvg});
}    
`}
`
export const InputAddPlayer = styled.input`
  background-color: white;
  margin-bottom: 10px;
  width: 100%;
  font-size: 20px;
  line-height: 21px;
  letter-spacing: 0.016em;
  color: #225f78;
  font-weight: 600;
  padding: 10px 0;
  padding-left: 39px;
  border-radius: 4px;
  outline: none;
  border: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  &::placeholder {
    font-family: 'resolve';
    font-size: 20px;
    line-height: 21px;
    letter-spacing: 0.016em;
    color: #225f78;
    font-weight: 600;
  }
`
export const SelectedTitle = styled.span`
  font-style: italic;
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
`

export const ShareBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  align-self: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
    order: 2;
  }
`

export const ShareBoxInner = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 2px dashed #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 25px 35px;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  line-height: 26px;
  letter-spacing: 0.016em;
  color: #225f78;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
`

export const ShareBoxTitle = styled.div`
  margin-bottom: 24px;
`
export const ShareBoxButtons = styled.div`
  width: 70%;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  letter-spacing: 0.016em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: center;
`
export const ShareBoxButton = styled.div`
  a {
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    color: #225f78;

    img {
      width: 40px;
      height: 100%;
      margin-right: 17.5px;
    }
  }
  p {
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    color: #225f78;

    img {
      width: 40px;
      height: 100%;
      margin-right: 17.5px;
    }
    span {
      color: #c9302e;
      align-items: center;
      margin-left: 10px;
      font-size: 12px;
    }
  }
`

export const WaitApproval = styled.div`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    }
    & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #429ABE;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #429ABE transparent transparent transparent;
    }
    &div:nth-child(1) {
    animation-delay: -0.45s;
    }
    &div:nth-child(2) {
    animation-delay: -0.3s;
    }
    & div:nth-child(3) {
    animation-delay: -0.15s;
    }
    @keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`
