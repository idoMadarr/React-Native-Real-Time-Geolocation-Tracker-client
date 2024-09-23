import axiosInstance from '../../utils/axiosInstance';
import {Dispatch} from 'redux';
import {
  setCurrentRecord,
  setRecords,
  updateRecordList,
} from '../slices/mainSlice';

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  const data: any = await axiosInstance.post('/summarize', body);
  if ('error' in data) return data;

  dispatch(setCurrentRecord(data));
};

export const updateScreenShot =
  (recordId: string, viewShot: string) => async (dispatch: Dispatch) => {
    const updateRecord = await axiosInstance.post('/screen-shot', {
      recordId,
      viewShot,
    });
    dispatch(updateRecordList(updateRecord));
  };

export const fetchRecords =
  (deviceId: string) => async (dispatch: Dispatch) => {
    const data = await axiosInstance.post('/device-records', {
      deviceId,
    });

    dispatch(setRecords(data));
  };
