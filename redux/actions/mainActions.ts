import axiosInstance from '../../utils/axiosInstance';
import {Dispatch} from 'redux';
import {
  setCurrentRecord,
  setRecords,
  updateRecordList,
} from '../slices/mainSlice';
import Config from 'react-native-config';
import {
  analyzeRoadRecord,
  GeolocationResponse,
} from '../../utils/haversineFormula';
import {getFromStorage, saveToStorage} from '../../utils/asyncstorage';
import uuid from 'react-native-uuid';
import {getManufacturer, getUniqueId} from 'react-native-device-info';

export interface GeoLocationBody {
  deviceId: string;
  record: GeolocationResponse[];
}

export const saveRecord =
  (body: GeoLocationBody) => async (dispatch: Dispatch) => {
    if (Config.OFFLINE_MODE === 'true') {
      const {distance, averageSpeed, startTime, endTime, waypoints} =
        analyzeRoadRecord(body.record);

      const currentRecord = {
        _id: uuid.v4(),
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
      } else {
        await saveToStorage('records', [currentRecord]);
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
          if (record.id === recordId || record._id === recordId) {
            return {...record, image: viewShot};
          }
          return record;
        });
        await saveToStorage('records', updatedRecords);
        dispatch(updateRecordList(updatedRecords));

        const deviceId = await getUniqueId();
        const manufacturer = await getManufacturer();
        dispatch(fetchRecords(`${manufacturer}:${deviceId}`));
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
