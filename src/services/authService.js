
import axios from 'axios';

const refreshTokenEndpoint = `${process.env.REACT_APP_API_URL}Login/refresh-token`;

export const refreshToken = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('felhasz'));
    if (!userData?.token || !userData?.refreshToken) {
      return null;
    }

    const response = await axios.post(refreshTokenEndpoint, {
      accessToken: userData.token,
      refreshToken: userData.refreshToken
    });

    if (response.data) {
      const updatedUserData = {
        ...userData,
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
      localStorage.setItem('felhasz', JSON.stringify(updatedUserData));
      return response.data.accessToken;
    }
    return null;
  } catch (error) {
    localStorage.removeItem('felhasz');
    return null;
  }
};


axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
      
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);