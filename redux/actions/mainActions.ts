import axiosInstance from '../../utils/axiosInstance';
import {Dispatch} from 'redux';
import {
  setCurrentRecord,
  setRecords,
  updateRecordList,
} from '../slices/mainSlice';
import Config from 'react-native-config';
import {analyzeRoadRecord} from '../../utils/haversineFormula';
import {getFromStorage, saveToStorage} from '../../utils/asyncstorage';
import uuid from 'react-native-uuid';

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  if (Config.OFFLINE_MODE === 'true') {
    const {distance, averageSpeed, startTime, endTime, waypoints} =
      analyzeRoadRecord(body);

    const currentRecord = {
      id: uuid.v4(),
      distance,
      averageSpeed,
      startTime,
      endTime,
      waypoints,
      image: null,
    };

    const userRecords = await getFromStorage('records');
    if (userRecords) {
      userRecords.push(currentRecord);
      await saveToStorage('records', userRecords);
    }

    dispatch(setCurrentRecord(currentRecord));
  } else {
    const data: any = await axiosInstance.post('/summarize', body);
    if ('error' in data) return data;

    dispatch(setCurrentRecord(data));
  }
};

export const updateScreenShot =
  (recordId: string, viewShot: string) => async (dispatch: Dispatch) => {
    if (Config.OFFLINE_MODE === 'true') {
      const userRecords = await getFromStorage('records');
      if (userRecords) {
        const updatedRecords = userRecords.map((record: any) => {
          if (record.id === recordId) {
            return {...record, image: viewShot};
          }
          return record;
        });
        await saveToStorage('records', updatedRecords);
        dispatch(updateRecordList(updatedRecords));
      }
    } else {
      const updateRecord = await axiosInstance.post('/screen-shot', {
        recordId,
        viewShot,
      });
      dispatch(updateRecordList(updateRecord));
    }
  };

export const fetchRecords =
  (deviceId: string) => async (dispatch: Dispatch) => {
    if (Config.OFFLINE_MODE === 'true') {
      const data = await getFromStorage('records');
      if (data) dispatch(setRecords(data));
    } else {
      const data = await axiosInstance.post('/device-records', {
        deviceId,
      });
      // @ts-ignore:
      if (data === false) return false;

      dispatch(setRecords(data));
    }
  };
