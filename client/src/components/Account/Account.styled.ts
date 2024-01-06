import styled from 'styled-components'

export const AccountWrapper = styled.div`
  width: 40%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`
export const AccountInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`
export const AccountButtons = styled.div`
  margin-right: 10%;
  align-self: center;
  @media only screen and (max-width: 768px) {
    width: 70%;
    margin-right: 0;
    margin-bottom: 60px;
  }
`
export const AccountButton = styled.div`
  font-weight: bold;
  font-size: 1rem;
  line-height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  padding: 20px 30px;
  background: ${({ color }) => color};
  border-radius: 10px;
  margin-bottom: 28px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0px;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 15px 30px;
  }
`
export const AccountFindTournaments = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  @media only screen and (max-width: 768px) {
    width: 70%;
    margin-right: 0;
    margin-bottom: 20px;
  }
`
export const AccountTournamentId = styled.input`
  font-size: 20px;
  line-height: 21px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 10px 20px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #ffffff;
  border-radius: 8px;
  margin-bottom: 18px;
  width: 100%;
  &::placeholder {
    font-weight: 300;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`
export const AccountTournamentButton = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(
      99.38deg,
      #f6be0e -6.68%,
      rgba(255, 188, 17, 0) 79.97%
    ),
    #c9302e;
  border-radius: 10px;
  padding: 15px 30px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 1rem;
    width: 100%;
  }
`
