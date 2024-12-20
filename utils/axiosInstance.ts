import axios from 'axios';
import Config from 'react-native-config';
import store from '../redux/store/store';
import {setBottomSheet} from '../redux/slices/mainSlice';
import {MessageModel} from '../models/MessageModel';
import RNRestart from 'react-native-restart';

const axiosInstance = axios.create({
  // baseURL: Config.localhost,
  // baseURL: Config.real_device_localhost,
  baseURL: Config.production,
});

axiosInstance.defaults.timeout = 140000;

axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    const url: string = error.response.config.url;

    if (url.includes('summarize') && error.response.data?.error) {
      return {error: error.response.data?.error};
    }

    const errorMessage = new MessageModel(
      'Unknown Error:',
      error.response.data?.error || 'Something went worng',
      'restart',
      RNRestart.restart,
    );

    store.dispatch(setBottomSheet({type: 'message', content: errorMessage}));
    return false;
  },
);

export default axiosInstance;
