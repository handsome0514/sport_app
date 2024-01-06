import React, { FC, useState } from 'react';
import { FormEventHandler } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { useInput } from '../../hooks/useInput';
import $api from '../../http';
import { RootState } from '../../redux';
import { servicePicture } from '../../services/profileService';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { InputForFile } from '../Input/InputForFile';
import Snackbar, { SnackBarProps } from '../Snackbar';

const ProfileWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ProfileInner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  @media only screen and (max-width: 760px) {
    width: 100%;
  }

  @media only screen and (min-width: 761px) {
    max-width: 66%;
  }
`;
const ProfileTitle = styled.h1`
  margin-bottom: 31px;
  align-self: flex-start;
  @media only screen and (max-width: 760px) {
    font-size: 24px;
  }
`;
const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileFormInputs = styled.div`
  width: 100%;
  display: flex;
  gap: 51px;
  margin-bottom: 15px;
  @media only screen and (max-width: 760px) {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }
`;

export const Profile: FC = () => {
  const {
 name, nickname, user_email, phone, user_id 
} = useSelector(
    ({ user }: RootState) => user,
  );
  const nicknameInput = useInput(nickname || '');
  const nameInput = useInput(name || '');
  const emailInput = useInput(user_email || '');
  const phoneInput = useInput(phone || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbarData, setSnackbarData] = useState<{
    type: SnackBarProps['type'];
    message: SnackBarProps['message'];
    hide: SnackBarProps['hide'];
  }>({
    message: '',
    type: 'success',
    hide: true,
  });
  const hideSnackBar = () => {
    setSnackbarData({ message: '', type: 'success', hide: true });
  };

  const saveClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    $api
      .patch('/user', {
        _id: user_id,
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        nickname: nicknameInput.value,
      })
      .then((resp) => {
        if (resp.status === 200) {
          setSnackbarData({
            message: 'Your profile has been updated',
            type: 'success',
            hide: false,
          });
        }
      })
      .catch(() => {
        setSnackbarData({
          message: 'There was an error please try again later',
          type: 'error',
          hide: false,
        });
      });
  };
  return (
    <ProfileWrapper>
      <ProfileInner>
        <ProfileTitle>Your Profile</ProfileTitle>
        <ProfileForm>
          <ProfileFormInputs>
            <div style={{ flexGrow: 1 }}>
              <Input
                labelStyle={{ color: 'white' }}
                {...nicknameInput}
                label={'Nickname'}
                type={'text'}
                placeholder={nickname || ''}
              />
              <Input
                labelStyle={{ color: 'white' }}
                {...nameInput}
                label={'Name'}
                type={'text'}
                placeholder={name || ''}
              />
              <InputForFile />
              
            </div>
            <div style={{ flexGrow: 1 }}>
              <Input
                labelStyle={{ color: 'white' }}
                {...emailInput}
                label={'E-mail'}
                type={'text'}
                placeholder={user_email || ''}
              />
              <Input
                labelStyle={{ color: 'white' }}
                {...phoneInput}
                label={'Phone'}
                type={'text'}
                placeholder={phone || ''}
              />
            </div>
          </ProfileFormInputs>
          <Button
            style={{ alignSelf: 'flex-end' }}
            onClick={saveClickHandler}
            small
          >
            Save
          </Button>
        </ProfileForm>
        <Snackbar
          hide={snackbarData.hide}
          type={snackbarData.type}
          message={snackbarData.message}
          timeout={1000}
          callback={hideSnackBar}
        />
      </ProfileInner>
    </ProfileWrapper>
  );
};
