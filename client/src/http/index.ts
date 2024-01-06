import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

$api.interceptors.response.use(config => {
  return config;
}, async error => {
  const originalRequest = error.config;
  if (error.response.status === 401) {
    try {
      const response = await axios.get(`${API_URL}user/refresh`, { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      return axios.request(originalRequest);
    } catch (error) {
      console.log('Not authorized');
    }
  }
  return Promise.reject(error);
});

export default $api;
