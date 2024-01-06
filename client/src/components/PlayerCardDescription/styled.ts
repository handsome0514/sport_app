import styled from 'styled-components';

export const CardWrapper = styled.div`
  border: 3px solid black;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 300px;
`;
export const Description = styled.div`
  padding: 10px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  gap: 30px;
  background-color: #144e6b;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const Container = styled.div`

`;
export const TextCard = styled.p``;
export const Title = styled.p`
  text-align: center;
  padding: 7px;
  font-size: 30px;
  font-weight: bold;
  background-color: black;
`;
export const Img = styled.img`
  height: 250px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;
