import axios from 'axios';
import history from '../browserHistory';
import CONSTANTS from '../constants';

const { BASE_URL, ACCESS_TOKEN } = CONSTANTS;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers = { ...config.headers, Authorization: token };
    }
    return config;
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  response => {
    if (response.data.token) {
      window.localStorage.setItem(ACCESS_TOKEN, response.data.token);
    }
    return response;
  },
  async err => {
    const originalRequest = err.config;
    if (
      err.response.status === 408 &&
      err.config &&
      !err.config._isRetry &&
      history.location.pathname !== '/login' &&
      history.location.pathname !== '/registration' &&
      history.location.pathname !== '/'
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${BASE_URL}refresh`, {
          withCredentials: true,
        });
        window.localStorage.setItem('accessToken', response.data.accessToken);
        return instance.request(originalRequest);
      } catch (err) {
        history.replace('/login');
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
