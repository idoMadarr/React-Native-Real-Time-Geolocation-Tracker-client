import axios from 'axios';
import Config from 'react-native-config';

const axiosInstance = axios.create({
  // baseURL: Config.localhost,
  // baseURL: Config.real_device_localhost,
  baseURL: Config.production,
});

axiosInstance.defaults.timeout = 40000;

axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    console.log(`Error: ${error}`);
    return false;
  },
);

export default axiosInstance;
