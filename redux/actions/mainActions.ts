import axios from 'axios';
import {Dispatch} from 'redux';
import {setCurrentRecord, setRecords} from '../slices/mainSlice';
import Config from 'react-native-config';

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post(`${Config.localhost}/summarize`, body);
    dispatch(setCurrentRecord(response.data));
  } catch (error) {
    console.log(error, '1');
  }
};

export const fetchRecords =
  (deviceId: string) => async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${Config.localhost}/device-records`, {
        deviceId,
      });
      dispatch(setRecords(response.data));
    } catch (error) {
      console.log(error, '2');
    }
  };
