import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../../redux';
import { servicePicture } from '../../services/profileService';
import { Button } from '../Button/Button';

const WrapperImage = styled.div`
  display: flex;
  justify-content: start;
`;

const Img = styled.img`
  width: 150px;
  height: 150px;
  border: 1px solid white;
  object-fit: cover;
`;

const InputPhotoProfile = styled.input`
  color: transparent;
  border: none;

  &::before {
    content: 'CHANGE PICTURE';
    display: inline-block;
    border: none;
    margin: 0.5rem 0;
    outline: none;
    white-space: nowrap;
    cursor: pointer;
    font-weight: 700;
    font-size: 12px;
    color: white;
  }
  &::-webkit-file-upload-button {
    visibility: hidden;
  }
`;

const WrapperButton = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export const InputForFile = () => {
  const { user_id } = useSelector(({ user }: RootState) => user);
  const [selectedFile, setSelectedFile] = useState<any>(
    `${process.env.REACT_APP_API_URL}/user/${user_id}/picture`,
  );
  const [displayPicture, setDisplayPicture] = useState(
    selectedFile ? selectedFile : '',
  );

  useEffect(() => {
    servicePicture.getPicture(user_id);
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append(
        'picture',
        new Blob([selectedFile], { type: selectedFile.type }),
      );
      servicePicture.editPicture(formData).then(() => {
        servicePicture.getPicture(user_id);
      });
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const temporaryURL = URL.createObjectURL(file);
    setDisplayPicture(temporaryURL);
  };

  const deletePhoto = (e) => {
    e.preventDefault();
    servicePicture
      .deletePicture()
      .then(() => {
        setDisplayPicture('');
      })
      .catch((er) => {
        console.error(er);
      });
  };

  return (
    <>
      <WrapperImage>
        <Img src={displayPicture} alt="profilePhoto" />
      </WrapperImage>
      <InputPhotoProfile
        accept="image/heic, image/jpeg, image/webp"
        name="profilePhoto"
        type="file"
        onChange={handlePhotoChange}
      />
      <WrapperButton>
        <Button
          style={{ fontSize: '15px' }}
          onClick={(e) => handleUpload(e)}
          small
        >
          Save Photo
        </Button>
        <Button
          style={{ fontSize: '15px' }}
          onClick={(e) => deletePhoto(e)}
          small
        >
          Delete Photo
        </Button>
      </WrapperButton>
    </>
  );
};
