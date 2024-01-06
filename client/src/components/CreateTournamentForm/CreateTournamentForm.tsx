import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import './DatePicker.css';
import $api from '../../http';
import { RootState } from '../../redux';
import { actionChangeListTournament } from '../../redux/reducer/listTournamentReducer';
import { Flex, Title } from '../../style/Custom';
import Snackbar from '../Snackbar';
import {
  Box,
  BoxItem,
  Button,
  ButtonBox,
  Input,
  InputBox,
  Label,
  Option,
  StyledSelect,
  Tournament,
} from './CreateTournamentForm.styled';
import validationSchema from './validations';

export const CreateTournamentForm = () => {
  const [checkType, setCheckType] = useState('');
  const [value, setValue] = useState({
    selectedOption: 2,
    kFactor: 32
  });
  const { user_id } = useSelector(({ user }: RootState) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState({
    hide: true,
    message: '',
  });
  const resetError = () => {
    setError({
      hide: true,
      message: '',
    });
  };

  const handleChangeType = (e) => {
    const { value } = e.target;
    setCheckType(value);
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const optionsForSelect = [2, 4, 6, 8, 10];

  const classicType = checkType === 'classic' ? true : false;
  const eloType = checkType === 'elo' ? true : false;

  const formik = useFormik({
    initialValues: {
      name: '',
      place: '',
      date: new Date().toLocaleString('en-CA', { hour12: false }),
      rules: '',
      additional: '',
      drafts: false,
      classic: false,
      elo: false,
      participants: 2,
      kFactor: 32,
    },
    validationSchema,
    onSubmit: async(values) => {
      await $api
        .post('/tournaments', {
          creator: user_id,
          ...values,
          classic: classicType,
          elo: eloType,
          participants: +value.selectedOption,
          kFactor: +value.kFactor,
        })
        .then(() => {
          dispatch(actionChangeListTournament('Upcoming'));
          navigate('/tournament');
        })
        .catch((error) => {
          setError({
            message: error?.response?.data?.message || '',
            hide: false,
          });
        });
    },
  });

  const handleClick = () => {
    formik.setValues((prev) => ({ ...prev, drafts: true }));
  };

  const handleChangeOptions = (e) => {
    const { value, name } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <form style={{ width: '100%' }} action="" onSubmit={formik.handleSubmit}>
      <Tournament>
        <Box>
          <BoxItem>
            <Title>New tournament</Title>
            <InputBox error={!!(formik.touched.name && formik.errors.name)}>
              <label>Name</label>
              <Input
                type={'text'}
                placeholder={''}
                {...formik.getFieldProps('name')}
              />
            </InputBox>
            <InputBox error={!!(formik.touched.date && formik.errors.date)}>
              <label>Date&Time</label>
              <Input
                type="datetime-local"
                {...formik.getFieldProps('date')}
                value={formik.values.date}
                required
                min={new Date().toLocaleDateString('en-CA')}
              />
            </InputBox>
            <InputBox error={!!(formik.touched.place && formik.errors.place)}>
              <label>Place (Address, City, Country)</label>
              <Input
                type={'text'}
                placeholder={''}
                flex-end
                {...formik.getFieldProps('place')}
              />
            </InputBox>
            <InputBox>
              <label>Additional</label>
              <Input
                type={'text'}
                placeholder={''}
                {...formik.getFieldProps('additional')}
              />
            </InputBox>
            <InputBox>
              <label>Tournament rules</label>
              <Flex
                role={'group'}
                style={{ width: '50%', marginTop: 10 }}
                gap="10px"
              >
                <Flex>
                  <Input
                    type="radio"
                    placeholder=""
                    name="classic"
                    value="classic"
                    checked={checkType === 'classic'}
                    onChange={handleChangeType}
                  />
                  <label>Classic</label>
                </Flex>
                <Flex>
                  <Input
                    type="radio"
                    placeholder=""
                    name="team"
                    value="team"
                    checked={checkType === 'team'}
                    onChange={handleChangeType}
                  />
                  <label>Team</label>
                </Flex>
                <Flex>
                  <Input
                    type="radio"
                    placeholder=""
                    name="elo"
                    value="elo"
                    checked={checkType === 'elo'}
                    onChange={handleChangeType}
                  />
                  <label>ELO</label>
                </Flex>
              </Flex>
              {checkType === 'elo' ? (
                <>
                  <Flex flex_direction="column">
                    <Label>Select count of players</Label>
                    <StyledSelect onChange={handleChangeOptions} name='selectedOption'>
                      <Option value="">Select</Option>
                      {optionsForSelect.map((option: number) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </StyledSelect>
                  </Flex>
                  <Flex flex_direction="column" style={{marginTop: 15 }}> 
                    <label htmlFor="">K-factor</label>
                    <Input
                      type="number"
                      placeholder="32"
                      name="kFactor"
                      value={value.kFactor}
                      onChange={handleChangeOptions}
                    />
                   
                  </Flex>
                </>
              ) : null}
            </InputBox>
            <Snackbar
              message={error.message}
              type="error"
              timeout={800}
              hide={error.hide}
              callback={resetError}
            />
          </BoxItem>
          <BoxItem>
            <Flex justify="center" style={{ borderBottom: '1px solid red' }}>
              <Title
                style={{ alignContent: 'center' }}
                active={formik.getFieldProps('classic').value}
              >
                Rules
              </Title>
            </Flex>
            {checkType === 'classic' || checkType === 'elo' ? (
              <ul>
                <li>Game winner is player who wins two sets</li>
                <li>Each set is played to three points</li>
                <li>Starting player is decided with Rock/Paper/Scissors</li>
              </ul>
            ) : (
              <ul>
                <li>
                  In a tournament there are two teams. Players participating in
                  tournament are selected to represent a team.
                </li>
                <li>
                  Each round players are drawn primarily to play against a
                  member of opponent team and if there are not enough opponents
                  to play against, then secondarily against their own team
                  member.
                </li>
                <li>
                  Participants for the next round will be drawn after all the
                  games in current round has been played.
                </li>
              </ul>
            )}
          </BoxItem>
        </Box>
        <ButtonBox>
          <Button
            disabled={!(formik.isValid && formik.dirty)}
            style={{ marginRight: 15 }}
            color="linear-gradient(102.2deg, #429ABE 33.09%, #005071 83.13%), #0085FF;"
            onClick={handleClick}
            type="submit"
          >
            Save draft
          </Button>
          <Button
            disabled={!(formik.isValid && formik.dirty)}
            color="linear-gradient(99.38deg, #FFBC11 -133.31%, rgba(255, 188, 17, 0) 79.97%), #CC2B24;"
            type="submit"
          >
            Publish
          </Button>
        </ButtonBox>
      </Tournament>
    </form>
  );
};
