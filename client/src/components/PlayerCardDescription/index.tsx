import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RootState } from '../../redux';
import { servicePicture } from '../../services/profileService';
import {
  CardWrapper,
  Container,
  Description,
  Img,
  TextCard,
  Title,
} from './styled';

export const Card: React.FC = () => {
  const {
 name, wins, atpStanding, trophies, playedGames 
} =
    useSelector(({ user }: RootState) => user);
    const {id} = useParams()

  useEffect(() => {
    servicePicture.getPicture(id);
  });

  return (
    <CardWrapper>
      <Img src={`${process.env.REACT_APP_API_URL}/user/${id}/picture`} />
      <Title>{name || ''}</Title>
      <Description>
        <Container>
          <TextCard>{`ATP standing: ${atpStanding}`}</TextCard>
          <TextCard>{`Played games: ${playedGames}`}</TextCard>
        </Container>
        <Container>
          <TextCard>{`Wins: ${wins}`}</TextCard>
          <TextCard>{`Trophies: ${trophies}`}</TextCard>
        </Container>
      </Description>
    </CardWrapper>
  );
};
