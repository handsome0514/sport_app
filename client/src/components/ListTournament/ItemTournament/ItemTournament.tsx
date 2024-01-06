import React from 'react'
import styled from 'styled-components'

import $api from '../../../http'

const Wrapper = styled.div`
  margin: 14px 0;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 21px;
  margin-bottom: 10px;
`
const DeleteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 100px;
  z-index: 100;
  background: #d20028;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
  @media only screen and (max-width: 1024px) {
    right: 50px;
    top: 10px;
    padding: 10px 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 760px) {
    right: 20px;
    top: 10px;
    padding: 10px 10px;
    font-size: 14px;
  }
`
const DraftButton = styled.button`
  position: absolute;
  top: 70px;
  right: 100px;
  z-index: 100;
  background: linear-gradient(102.2deg, #429abe 33.09%, #005071 83.13%), #0085ff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
  @media only screen and (max-width: 1024px) {
    right: 50px;
    top: 50px;
    padding: 10px 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 760px) {
    right: 20px;
    top: 50px;
    padding: 10px 10px;
    font-size: 14px;
  }
`
const Inner = styled.div`
  position: relative;
  display: flex;
  width: 40vw;
  height: 25vh;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  @media only screen and (max-width: 760px) {
    width: 100%;
  }
`

const DetailInfo = styled.div`
  width: 90%;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 20px;
  font-weight: bold;
  color: #383d42;
  h4 {
    margin-bottom: 15px;
    font-size: 14px;
    line-height: 15px;
    color: #383d42;
    font-weight: normal;
  }
  @media only screen and (max-width: 760px) {
    width: 100%;
  }
`
const RulesText = styled.div`
  font-size: 14px;
  line-height: 15px;
  color: #383d42;
  font-weight: normal;
  width: 60%;
  @media only screen and (max-width: 760px) {
    width: 100%;
  }
`
type ItemTournamentProps = {
  date: string;
  status?: 'Upcoming' | 'Ongoing' | 'Finished' | 'Drafts';
  onClick?: any;
  name: string;
  _id: string;
  deleted: boolean;
  drafted: boolean;
  setDeleted: any;
  setDrafted: any;
  classic?: boolean;
  place: string | null;
};
export const ItemTournament: React.FC<ItemTournamentProps> = ({
  onClick,
  name,
  _id,
  deleted,
  drafted,
  setDeleted,
  setDrafted,
  date,
  status,
  classic,
  place
}) => {
  const formattedDate =
    date &&
    new Date(date).toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  const deleteHandlerClick = async(id: string) => {
    if (!window.confirm('Are you sure you want to delete?')) {
      return
    }
    await $api
      .delete(`/tournaments/${id}`, {data: {_id: id,},})
      .then(() => setDeleted(!deleted))
  }
  const draftHandlerClick = async(id: string) => {
    await $api
      .patch(`/tournaments/${_id}`, { id: _id, drafts: true })
      .then(() => setDrafted(!drafted))
  }

  return (
    <Wrapper>
      <Inner>
        <DetailInfo onClick={onClick}>
          <Title>{name}</Title>
          <h3 style={{ margin: '6px 0' }}>{formattedDate}</h3>
          <h4>Details: {place}</h4> 
          {classic ? (
            <RulesText>
              Classic Rules: Game winner is player that wins two sets, each set
              is played to three points. Starting player is decided with
              Rock/Paper/Scissors.
            </RulesText>
          ) : (
            <RulesText>
              Team Rules: In a tournament there are two teams. Players
              participating in tournament are selected to represent a team.
            </RulesText>
          )}
        </DetailInfo>
        <DeleteButton onClick={() => deleteHandlerClick(_id)}>
          Delete
        </DeleteButton>
        {status == 'Upcoming' && (
          <DraftButton onClick={() => draftHandlerClick(_id)}>
            Draft
          </DraftButton>
        )}
      </Inner>
    </Wrapper>
  )
}
