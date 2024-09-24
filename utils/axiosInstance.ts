import axios from 'axios';
import Config from 'react-native-config';

const axiosInstance = axios.create({
  baseURL: Config.localhost,
  // baseURL: Config.real_device_localhost,
  // baseURL: Config.production,
});

axiosInstance.defaults.timeout = 90000;

axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    return {error: error.response.data?.error || 'Unknown Error'};
  },
);

export default axiosInstance;
