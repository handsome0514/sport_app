import $api from "../http";

export const servicePicture = {
  deletePicture: () => {
    return $api.delete('user/picture');
  },
  getPicture: (id: string | undefined | null) => {
    return $api.get(`user/${id}/picture`);
  },
  editPicture: (data) => {
    return $api.patch('user/picture', data);
  }
};
