import axiosInstance from '../../utils/axiosInstance';
import {Dispatch} from 'redux';
import {
  setCurrentRecord,
  setRecords,
  updateRecordList,
} from '../slices/mainSlice';
import Config from 'react-native-config';
import {analyzeRoadRecord} from '../../utils/haversineFormula';

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  if (Config.OFFLINE_MODE === 'true') {
    const {distance, averageSpeed, startTime, endTime, waypoints} =
      analyzeRoadRecord(body);
    const currentRecord = {
      distance,
      averageSpeed,
      startTime,
      endTime,
      waypoints,
    };
    console.log(currentRecord, 'result');
    // ...saveToStorage
    dispatch(setCurrentRecord(currentRecord));
  } else {
    const data: any = await axiosInstance.post('/summarize', body);
    if ('error' in data) return data;

    dispatch(setCurrentRecord(data));
  }
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
    if (Config.OFFLINE_MODE === 'true') {
      // Fetch from local storage
      // dispatch(setRecords(data));
    } else {
      const data = await axiosInstance.post('/device-records', {
        deviceId,
      });
      // @ts-ignore:
      if (data === false) return false;

      dispatch(setRecords(data));
    }
  };
