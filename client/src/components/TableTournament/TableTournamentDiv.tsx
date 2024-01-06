import React, {
useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';

import shareSvg from '../../assets/svg/share.svg';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import $api from '../../http';
import {RootState} from '../../redux';
import {
  cleanTournament,
  tableTournamentActionFetch,
  tableTournamentActionUpdate,
} from '../../redux/reducer/tableTournamentReducer';
import tournamentService, {tournamentTable,} from '../../services/tournamentService';
import socket from '../../socket';
import {Flex} from '../../style/Custom';
import {Button, Details, Player} from '../';
import {ListInvitedPlayer} from '../ListInvitedPlayer/ListInvitedPlayer';
import usePointHandler from './usePointHanlder';

const TableBracket = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

const DivOr = styled.div`
  display: flex;
  color: #515151;
  justify-content: center;
  align-items: center;
  font-family: resolve;
  font-weight: 700;
  font-style: italic;
  font-size: 20px;
  line-height: 21px;
  position: relative;
  margin-bottom: 29px;
  // @media only screen and (max-width: 425px) {
  //     font-size: 12px;
  //   }
  &::before {
    content: '';
    display: block;
    width: 40%;
    height: 2px;
    background: linear-gradient(90.67deg, #cc2b24 22.54%, #ffbc11 158.72%);
    position: absolute;
    left: 0;
    bottom: 40%;
  }

  &::after {
    content: '';
    display: block;
    width: 40%;
    height: 2px;
    background: linear-gradient(90.67deg, #cc2b24 22.54%, #ffbc11 158.72%);
    transform: rotate(180deg);
    position: absolute;
    right: 0;
    bottom: 40%;
  }
`;
const Round = styled.div``;
const Pair = styled.div`
  position: relative;
`;
const TitleTournamentName = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
`;
const DateTournament = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: 300;
`;

const PlaceTournament = styled.div`
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: 0.006em;
  margin-bottom: 40px;
`;

const CodeLink = styled.div`
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
`;

interface tournamentProps {
  showShare: boolean;
}

const Bottom = styled.div<{ showShare?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: ${(props) => (props.showShare ? 'space-between' : 'end')};
  align-items: center;
  height: 52px;
  padding: 0 27px;
  font-size: 16px;
  line-height: 17px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.006em;
  font-weight: bold;
  color: #ffffff;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: 0;
    right: 0;
    height: 100%;
    transform: rotate(180deg);
    background: linear-gradient(97.46deg,
      #429abe -57.08%,
    rgba(66, 154, 190, 0) 57.19%),
    #002a3c;
  }
`;
const BottomShare = styled.div`
  text-transform: uppercase;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    display: block;
    background-image: url(${shareSvg});
    background-repeat: no-repeat;
    margin-right: 10px;
  }
`;
const BottomStatus = styled.div``;
const Box = styled.div`
  position: absolute;
  right: 9%;
  width: 300px;
  display: flex;
  flex-direction: column;
  width: 15%;
  top: 19%;

  button {
    width: 100%;
  }
`;

export const TableTournamentDiv = (props: tournamentProps) => {
  const {showShare} = props;
  const data = useAppSelector(({tableTournament}) => tableTournament);
  const {user_id, user_email} = useAppSelector(({user}) => user);
  const [copyLink, setCopyLink] = useState(false);
  const [clientWidth, setClientWidth] = useState(window.screen.width);
  const [widthPlayer, setWidthPlayer] = useState(280);

  const [copy, setCopy] = useState(false);
  const {id} = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {players} = useSelector((state: RootState) => state.tableTournament);
  const heightPlayer = 35;
  const marginPlayer = 6;
  let marginPair = 14;
  const marginRightRound = 50;
  const lineHeight = data.started ? 3 : 0;
  const color = '#225F78';
  const finishMatch =
    data.tournament_bracket[data.tournament_bracket.length - 1][0][0]
      .finishMatch &&
    data.tournament_bracket[data.tournament_bracket.length - 1][0][1]
      .finishMatch;
  if (finishMatch) {
    $api.patch(`/tournaments/${id}`, {id: id, ended_at: new Date()});
  }
  const renderedBefore = useRef<boolean>(false);
  useEffect(() => {
    if (!renderedBefore.current) {
      renderedBefore.current = true;
      dispatch(cleanTournament());
      socket.on('new_update_tournament_data', (changedTournamentId) => {
        if (changedTournamentId.tournamentId == id) {
          dispatch(tableTournamentActionFetch(id!));
        }
      });
    }
    return () => {
      dispatch(cleanTournament());
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', () =>
      setClientWidth(window.screen.width),
    );
    window.addEventListener('orientationchange', () =>
      setClientWidth(window.screen.width),
    );
    return () => {
      window.removeEventListener('resize', () =>
        setClientWidth(window.screen.width),
      );
      window.removeEventListener('orientationchange', () =>
        setClientWidth(window.screen.width),
      );
    };
  }, [clientWidth]);

  useEffect(() => {
    if (clientWidth <= 1024) {
      setWidthPlayer(180);
    } else {
      setWidthPlayer(280);
    }
  }, [clientWidth]);
  const generateTableDiv = (tournament_bracket: tournamentTable[]) => {
    let paddingRound = 0;
    let shouldRender = true;
    const generateTournament = tournament_bracket.map(
      (round, roundIndex, arrayRound) => {
        if (roundIndex > 0) {
          paddingRound += heightPlayer + marginPlayer + marginPair / 2;
          marginPair += marginPair + marginPlayer + heightPlayer * 2;
        }
        const {length} = tournamentService.getTeamPlayers(
          tournament_bracket[roundIndex - 1],
        );

        if (roundIndex > 0) {
          if (length !== tournament_bracket[roundIndex - 1].length) {
            shouldRender = false;
          }
        }

        return (
          <Round
            key={roundIndex}
            style={{paddingTop: paddingRound, marginRight: marginRightRound}}
          >
            {round.map((item, indexPair) => {
              if (
                item[0].name === '(No opponent)' &&
                item[1].name === '(No opponent)'
              ) {
                return null;
              }
              return (
                <Pair
                  key={indexPair}
                  style={{marginBottom: marginPair, position: 'relative'}}
                >
                  {item.map((item, indexPlayer, arrayPlayer) => {
                    const {PointHandler, handlePoints} = usePointHandler();
                    const handleClick = useCallback(
                      async(index: number) => {
                        // if (!item.finishMatch || true) {
                        handlePoints(item.score)
                          .then((resp) => {
                            if (typeof resp === 'number') {
                              onChangeScore(
                                roundIndex,
                                indexPair,
                                indexPlayer,
                                +resp,
                                index,
                              );
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                        // }
                      },
                      [item],
                    );

                    return (
                      <span key={indexPlayer}>
                        <PointHandler/>

                           <Player
                             lineBottom={
                               data.classic &&
                               roundIndex !== arrayRound.length - 1 &&
                               indexPair % 2 === 0 &&
                               indexPlayer % 2 === 0
                             }
                             lineTop={
                               data.classic &&
                               roundIndex !== arrayRound.length - 1 &&
                               indexPair % 2 === 1 &&
                               indexPlayer % 2 === 1
                             }
                             team={shouldRender ? item.team : null}
                             marginPair={marginPair}
                             width={widthPlayer}
                             height={heightPlayer}
                             margin={marginPlayer}
                             name={item.name || ''}
                             marginRightRound={marginRightRound}
                             lineHeight={lineHeight}
                             color={color}
                             score={item.score}
                             win={item.win}
                             onChangeScore={handleClick}
                             round={roundIndex}
                             pair={indexPair}
                             player={indexPlayer}
                             lastRound={roundIndex === arrayRound.length - 1}
                             finishWin={
                               roundIndex === arrayRound.length - 1 && item.win
                             }
                             disabled={item.disabled}
                             disabledInput={item.disabled}

                           />
                      </span>
                    );
                  })}
                </Pair>
              );
            })}
          </Round>
        );
      },
    );
    return generateTournament;
  };

  const onChangeScore = (
    round: number,
    pair: number,
    playerIndex: number,
    score: number,
    scoreIndex: number,
  ) => {
    const copy: tournamentTable[] = JSON.parse(
      JSON.stringify(data.tournament_bracket),
    );
    copy[round][pair][playerIndex].score = +isNaN(score) ? 0 : score;
    dispatch(
      tableTournamentActionUpdate({
        id: id!,
        tournament_bracket: tournamentService.updateWin(copy),
      }),
    ).then(() => {
      socket.emit('tournament_updated', {tournamentId: id});
    });
  };

  const copyHandlerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLink(true);
    setTimeout(() => {
      setCopyLink(false);
    }, 4000);
  };

  if (!data.started) {
    return (
      <>
        <Flex justify="space-between" align_items="flex-start">
          <div>
            <TitleTournamentName>{data.name} </TitleTournamentName>
            <DateTournament>
              {new Date(data.date!).toDateString()}
            </DateTournament>
            <PlaceTournament>{data.place!}</PlaceTournament>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <CodeLink onClick={copyHandlerClick}>
              <div>Tournament ID</div>
              <div
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: 'bold',
                  fontSize: 26,
                }}
              >
                {copyLink ? 'Copied!' : `${data.code_link}`}
              </div>
            </CodeLink>
            <ListInvitedPlayer data={data}/>
          </div>
        </Flex>
        <TableBracket>{generateTableDiv(data.tournament_bracket)}</TableBracket>
        {data.creator !== user_id && <Details details={data.rules!}/>}
        <Bottom showShare={showShare}>
          {showShare && (
            <BottomShare>
              <p
                onClick={() => {
                  setCopy(true);
                  navigator.clipboard.writeText(window.location.href);
                  setTimeout(() => {
                    setCopy(false);
                  }, 3000);
                }}
              >
                {copy ? 'Tournament Link Copied!' : 'Share Tournament'}
              </p>
            </BottomShare>
          )}
          <BottomStatus>
            Tournament status: {finishMatch ? 'Completed' : 'Started'}
          </BottomStatus>
        </Bottom>
      </>
    );
  }
  return (
    <>
      <Flex
        justify="space-between"
        align_items="flex-start"
        style={{width: '100%'}}
      >
        <div>
          <TitleTournamentName>
            {data.name} {!!data.ended_at && '(Completed)'}
          </TitleTournamentName>
          <DateTournament>{new Date(data.date!).toDateString()}</DateTournament>
          <PlaceTournament>{data.place!}</PlaceTournament>
        </div>
        {user_id && user_email && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <CodeLink onClick={copyHandlerClick}>
              <div>Tournament ID</div>
              <div
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: 'bold',
                  fontSize: 26,
                }}
              >
                {copyLink ? 'Copied!' : `${data.code_link}`}
              </div>
            </CodeLink>
          </div>
        )}
      </Flex>
      <TableBracket>
        {generateTableDiv(data.tournament_bracket)}

        {finishMatch && user_id !== data.creator && user_id && (
          <Box>
            <Button
              style={{marginBottom: 29, fontStyle: 'italic'}}
              onClick={() => {
                navigate('/create');
              }}
            >
              Create Tournament
            </Button>
          </Box>
        )}
        {finishMatch && !user_id && (
          <Box>
            <Button
              primary
              style={{marginBottom: 29, fontStyle: 'italic'}}
              onClick={() => navigate('/registration')}
            >
              REGISTER
            </Button>
          </Box>
        )}
      </TableBracket>
      <Details details={data.place!}/>

      <Bottom showShare={showShare}>
        {showShare && (
          <BottomShare>
            <p
              onClick={() => {
                setCopy(true);
                navigator.clipboard.writeText(window.location.href);
                setTimeout(() => {
                  setCopy(false);
                }, 3000);
              }}
            >
              {copy ? 'Tournament Link Copied!' : 'Share Tournament'}
            </p>
          </BottomShare>
        )}
        <BottomStatus>
          Tournament status: {finishMatch ? 'Completed' : 'Started'}
        </BottomStatus>
      </Bottom>
    </>
  );
};
