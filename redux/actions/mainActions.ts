import axiosInstance from '../../utils/axiosInstance';
import {Dispatch} from 'redux';
import {
  setCurrentRecord,
  setRecords,
  updateRecordList,
} from '../slices/mainSlice';
import Config from 'react-native-config';

const domain = Config.real_device_localhost;

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  const data = await axiosInstance.post(`${domain}/summarize`, body);
  dispatch(setCurrentRecord(data));
};

export const updateScreenShot =
  (recordId: string, viewShot: string) => async (dispatch: Dispatch) => {
    const updateRecord = await axiosInstance.post(`${domain}/screen-shot`, {
      recordId,
      viewShot,
    });
    dispatch(updateRecordList(updateRecord));
  };

export const fetchRecords =
  (deviceId: string) => async (dispatch: Dispatch) => {
    const data = await axiosInstance.post(`${domain}/device-records`, {
      deviceId,
    });

    dispatch(setRecords(data));
  };
