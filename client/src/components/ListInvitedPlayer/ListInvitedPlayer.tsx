import React, { KeyboardEventHandler, useEffect, useState } from 'react';

import shareLinkSvg from '../../assets/svg/shareLink.svg';
import shareMailSvg from '../../assets/svg/shareMail.svg';
import whatsappSvg from '../../assets/svg/whatsapp.svg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useInput } from '../../hooks/useInput';
import $api from '../../http';
import { ITournaments } from '../../interface';
import { guestNickNameActionChange } from '../../redux/reducer/guestNickNameReducer';
import {
  tableTournamentActionFetch,
  tableTournamentActionUpdate,
} from '../../redux/reducer/tableTournamentReducer';
import tournamentService, {tournamentTable,} from '../../services/tournamentService';
import socket from '../../socket';
import { Flex } from '../../style/Custom';
import { Button } from '../Button/Button';
import { TeamButton } from '../CreateTournamentForm/CreateTournamentForm.styled';
import { Input } from '../Input/Input';
import {
  AddNewPlayer,
  CodeLink,
  InputAddPlayer,
  ItemPlayer,
  ItemsPlayer,
  ListPlayer,
  ListPlayerInner,
  ListPlayerTableList,
  ListPlayerTableListInfo,
  ListPlayerTableListPair,
  ListPlayerTableListPlayer,
  ListPlayerTitle,
  ListPlayerWrapper,
  SelectedTitle,
  ShareBox,
  ShareBoxButton,
  ShareBoxButtons,
  ShareBoxInner,
  ShareBoxTitle,
  WaitApproval,
} from './listInvitedPlayerStyled';

type ListInvitedPlayerProps = {
  data: ITournaments;
};

export const ListInvitedPlayer = ({ data }: ListInvitedPlayerProps) => {
  const {
 players, creator, isLoading, _id, code_link, started, elo 
} =
    useAppSelector(({ tableTournament }) => tableTournament);
  const { nickName } = useAppSelector(({ guestNickName }) => guestNickName);
  const user = useAppSelector(({ user }) => user);
  const [selected, setSelected] = useState(0);
  const [listPlayer, setListPlayer] = useState<any[]>([]);
  const newPlayer = useInput('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [guestClicked, setGuestClicked] = useState(false);
  const [copyLink, setCopyLink] = useState(false);

  const dispatch = useAppDispatch();
  const nicknameInput = useInput('');
  const [table, setTable] = useState<tournamentTable[]>(
    data.tournament_bracket,
  );
  const filterSelected = listPlayer.filter((item) => item.selected);
  const [waiting, setWaiting] = useState(false);
  const selectPlayerHandlerClick = (index: number) => {
    const copy = [...listPlayer];
    copy[index] = { ...copy[index], selected: false };
    copy[index].selected = !listPlayer[index].selected;
    setListPlayer(copy);
  };
  const [copied, setCopied] = useState(false);
  const [team, setTeam] = useState<'blue' | 'red' | null>(null);
  const [playerTeam, setPlayerTeam] = useState<'blue' | 'red' | null>(null);

  useEffect(() => {
    socket.on('new_update_tournament', (changedTournamentId: any) => {
      if (changedTournamentId.tournamentId == _id) {
        dispatch(tableTournamentActionFetch(_id!));
      }
    });
  }, []);
  
  const startHandlerClick = () => {
    if (!elo && filterSelected.length < 2) {
      setError('Need minimum 2 players');
    } else {
      dispatch(
        tableTournamentActionUpdate({
          id: _id!,
          tournament_bracket: tournamentService
            .init(filterSelected)
            .returnTable(),
          started: true,
          started_at: new Date().toLocaleString(),
        }),
      ).then(() => {
        socket.emit('tournament_started', { userId: user.user_id });
      });
    }
  };
  const changeNickNameHandlerClick = () => {
    setGuestClicked(true);
    localStorage.setItem('nickName', nicknameInput.value);
    dispatch(guestNickNameActionChange(nicknameInput.value));
    setWaiting(true);
  };

  useEffect(() => {
    if (nickName?.length && guestClicked) {
      applyGuestHandlerClick();
    }
  }, [nickName, guestClicked]);

  const applyGuestHandlerClick = () => {
    if (!nickName?.length) {
      return;
    }
    $api
      .post('/tournaments/add-players', {
        _id: data._id,
        nickname: nickName,
        team: playerTeam,
      })
      .then(() => {
        setError('');
        setSuccess('Your application is accepted!');
        socket.emit('join_tournament', { tournamentId: data._id });
      })
      .catch(({ response }) => {
        setSuccess('');
        setError(response.data.message);
      });
  };

  const applyUserHandlerClick = () => {
    $api
      .post('/tournaments/add-players', {
        _id: data._id,
        user,
        team: playerTeam,
      })
      .then(() => {
        setError('');
        setSuccess('Your application is accepted!');
        socket.emit('join_tournament', { tournamentId: data._id });
        setWaiting(true);
      })
      .catch(({ response }) => {
        setSuccess('');
        setError(response.data.message);
      });
  };

  const addPlayerHandlerClick = () => {
    const copy = [...listPlayer];
    if (copy.find((item) => item.name === newPlayer.value)) {
      setError('This user already exists!');
      return false;
    }
    if (newPlayer.value === '') {
      setError('The field cannot be empty!');
      return false;
    }
    copy.push({ guest: true, name: newPlayer.value, team });

    $api
      .post('/tournaments/add-players', {
        _id: data._id,
        nickname: newPlayer.value,
        team,
      })
      .then(({ data }) => {
        setListPlayer(data.players);
        newPlayer.setValue('');
        setError('');
        setSuccess('Your application is accepted!');
        setTeam(null);
      })
      .catch(({ response }) => setError(response.data.message));
  };
  useEffect(() => {
    const filterSelected = listPlayer.filter((item) => item.selected);
    setSelected(filterSelected.length);
    setTable(tournamentService.init(filterSelected).returnTable());
  }, [filterSelected.length, listPlayer]);

  useEffect(() => {
    players && setListPlayer(players);
  }, [players]);
  const FindGuest =
    !!players?.filter((player) => player.name === nickName)[0]?.name &&
    !started;
  const FindUser =
    !!players?.filter((player) => player.name === user.nickname)[0]?.name &&
    !started;

  useEffect(() => {
    if (user.user_id === creator) {
      return;
    }
    const interval = setInterval(() => {
      dispatch(tableTournamentActionFetch(_id!));
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const copyHandlerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLink(true);
    setTimeout(() => {
      setCopyLink(false);
    }, 4000);
  };

  if (user.user_id !== creator && (FindGuest || FindUser || waiting)) {
    return (
      <>
        <WaitApproval>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </WaitApproval>
        <h2>Waiting for approval</h2>
      </>
    );
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (user.user_id === creator || elo) {
    return (
      <ListPlayerWrapper>
        <ListPlayerTableList>
          <ListPlayerTableListInfo>Chosen Participants</ListPlayerTableListInfo>
          <ListPlayerTableListPair>
            {listPlayer
              ? listPlayer.map((player, indexPlayer) => {
                  if (player.selected) {
                    return (
                      <ListPlayerTableListPlayer
                        team={player.team}
                        key={indexPlayer}
                      >
                        {player.name}
                      </ListPlayerTableListPlayer>
                    );
                  }
                  if (elo) {
                    return (
                      <ListPlayerTableListPlayer
                        team={player.team}
                        key={indexPlayer}
                      >
                        {player.name}
                      </ListPlayerTableListPlayer>
                    );
                  }
                })
              : null}
          </ListPlayerTableListPair>
        </ListPlayerTableList>

        <ShareBox>
          <ShareBoxInner>
            <ShareBoxTitle>Share tournament</ShareBoxTitle>
            <ShareBoxButtons>
              <ShareBoxButton>
                <a
                  href={`whatsapp://send?text=Invited you to Game! sub.soccer/tournament/${_id}`}
                >
                  <img src={whatsappSvg} alt="" />
                  Whatsapp
                </a>
              </ShareBoxButton>
              <ShareBoxButton>
                <p
                  onClick={() => {
                    setCopied(true);
                    navigator.clipboard.writeText(window.location.href);
                    setTimeout(() => {
                      setCopied(false);
                    }, 3000);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={shareLinkSvg} alt="" />
                  Share link
                  {copied && <span>Link copied!</span>}
                </p>
              </ShareBoxButton>
              <ShareBoxButton>
                <a
                  href={`mailto:?subject= Game Invite&body=Invited you to play with me! sub.soccer/tournament/${_id}.`}
                >
                  <img src={shareMailSvg} alt="" />
                  Share via mail
                </a>
              </ShareBoxButton>
            </ShareBoxButtons>
          </ShareBoxInner>
          <Button small onClick={startHandlerClick}>
            Start
          </Button>
        </ShareBox>

        <ListPlayer>
          <CodeLink onClick={copyHandlerClick}>
            Tournament ID {copyLink ? <p>Copied!</p> : <p>{code_link}</p>}
          </CodeLink>
          {elo ? null : (
            <AddNewPlayer>
              <InputAddPlayer
                {...newPlayer}
                type={'text'}
                placeholder={'New Guest Player'}
              />

              <Button
                onClick={addPlayerHandlerClick}
                primary
                disabled={!team && !data.classic}
                style={{
                  fontSize: 18,
                  marginBottom: 10,
                  width: '30%',
                  height: '84%',
                  backgroundColor: '#0085FF',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                ADD
              </Button>
            </AddNewPlayer>
          )}
          {!data.classic && !elo ? (
            <>
              <ListPlayerTableListInfo
                style={{
                  fontSize: 20,
                  margin: '5px auto',
                  textAlign: 'center',
                  width: 'fit-content',
                  textTransform: 'inherit',
                }}
              >
                Add to
              </ListPlayerTableListInfo>
              <Flex justify="space-between">
                <TeamButton
                  disabled={team === 'red'}
                  onClick={() => setTeam('red')}
                  backgroundColor="#D20028"
                  active={team === 'red'}
                >
                  Team 1
                </TeamButton>
                <TeamButton
                  onClick={() => setTeam('blue')}
                  backgroundColor="#0178C8"
                  active={team === 'blue'}
                >
                  Team 2
                </TeamButton>
              </Flex>
            </>
          ) : null}
          {!elo ? (
            <>
              <ListPlayerTableListInfo style={{ margin: '25px 0' }}>
                Applying
              </ListPlayerTableListInfo>
              <ListPlayerInner>
                <ItemsPlayer>
                  {listPlayer.map((item, index) => (
                    <ItemPlayer
                      registered={!item.guest}
                      team={item.team}
                      key={item.name + index}
                      onClick={() => selectPlayerHandlerClick(index)}
                      selected={listPlayer[index].selected}
                    >
                      {item.name}
                    </ItemPlayer>
                  ))}
                </ItemsPlayer>
              </ListPlayerInner>
              <Flex justify={'space-between'} align_items={'center'}>
                <SelectedTitle>Selected: {selected}</SelectedTitle>
              </Flex>
            </>
          ) : null}

          <br />
          {error && <span style={{ color: '#CE482B' }}>{error}</span>}
        </ListPlayer>
      </ListPlayerWrapper>
    );
  }

  if ((user.user_id && user.user_id !== creator) || !elo) {
    return (
      <ListPlayer>
        <h2>Choose Your Team</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Flex
            justify="space-around"
            style={{ margin: '20px 0', width: '80%' }}
          >
            <TeamButton
              disabled={playerTeam === 'red'}
              onClick={() => setPlayerTeam('red')}
              backgroundColor="#D20028"
              active={playerTeam === 'red'}
            >
              Team 1
            </TeamButton>
            <TeamButton
              onClick={() => setPlayerTeam('blue')}
              backgroundColor="#0178C8"
              active={playerTeam === 'blue'}
            >
              Team 2
            </TeamButton>
          </Flex>
        </div>
        <Button style={{ margin: '10px 0' }} onClick={applyUserHandlerClick}>
          Apply for a tournament
        </Button>
        {error && <span style={{ color: '#CE482B' }}>{error}</span>}
        {success && <span style={{ color: '#40A35B' }}>{success}</span>}
      </ListPlayer>
    );
  }
  return (
    <ListPlayer>
      <ListPlayerTitle>Enter your name. </ListPlayerTitle>
      <Input
        {...nicknameInput}
        label={''}
        type={'text'}
        placeholder={nickName! || 'NAME'}
        style={{ width: '100%' }}
      />
      {!data.classic || !elo ? (
        <>
          <h2>Choose Your Team</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Flex
              justify="space-around"
              style={{ margin: '20px 0', width: '80%' }}
            >
              <TeamButton
                disabled={playerTeam === 'red'}
                onClick={() => setPlayerTeam('red')}
                backgroundColor="#D20028"
                active={playerTeam === 'red'}
              >
                Team 1
              </TeamButton>
              <TeamButton
                onClick={() => setPlayerTeam('blue')}
                backgroundColor="#0178C8"
                active={playerTeam === 'blue'}
              >
                Team 2
              </TeamButton>
            </Flex>
          </div>
        </>
      ) : null}
      <Button onClick={changeNickNameHandlerClick}>APPLY TOURNAMENT</Button>
      <br />
      {error && <span style={{ color: '#CE482B' }}>{error}</span>}
      {success && <span style={{ color: '#40A35B' }}>{success}</span>}
    </ListPlayer>
  );
};
