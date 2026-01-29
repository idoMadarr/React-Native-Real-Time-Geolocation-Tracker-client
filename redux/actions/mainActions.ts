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
  RoadRecordAnalysis,
} from '../../utils/haversineFormula';
import {getFromStorage, saveToStorage} from '../../utils/asyncstorage';
import uuid from 'react-native-uuid';
import {getManufacturer, getUniqueId} from 'react-native-device-info';
import axios from 'axios';

const API_KEY = Config.geocode_maps_key;
export interface GeoLocationBody {
  deviceId: string;
  record: GeolocationResponse[];
}

export const saveRecord =
  (body: GeoLocationBody) => async (dispatch: Dispatch) => {
    if (Config.OFFLINE_MODE === 'true') {
      const {
        distance,
        averageSpeed,
        startTime,
        endTime,
        waypoints,
        maxSpeed,
        minSpeed,
        duration,
        durationFormatted,
        elevationGain,
        elevationLoss,
        maxElevation,
        minElevation,
        stops,
        averageHeading,
        numberOfWaypoints,
        segments,
        totalTurns,
        sharpTurns,
        uTurns,
        maxTurnAngle,
        turnEvents,
      } = analyzeRoadRecord(body.record);

      // Getting the address from the first the last waypoint.
      let pickupAddress: any = 'Address Not Found';
      let destinationAddress: any = 'Address Not Found';
      try {
        const pickupResAddress = await axios(
          `https://geocode.maps.co/reverse?lat=${waypoints[0].latitude}&lon=${waypoints[0].longitude}&accept-language=en&api_key=${API_KEY}`,
        );
        const destinationResAddress = await axios(
          `https://geocode.maps.co/reverse?lat=${
            waypoints[waypoints.length - 1].latitude
          }&lon=${
            waypoints[waypoints.length - 1].longitude
          }&accept-language=en&api_key=${API_KEY}`,
        );

        pickupAddress = pickupResAddress.data.display_name;
        destinationAddress = destinationResAddress.data.display_name;
      } catch (error) {
        console.log('Error: fetching addresses', error);
      }

      const currentRecord = {
        _id: uuid.v4(),
        distance,
        averageSpeed,
        startTime,
        endTime,
        waypoints,
        image: null,
        maxSpeed,
        minSpeed,
        duration,
        durationFormatted,
        elevationGain,
        elevationLoss,
        maxElevation,
        minElevation,
        stops,
        averageHeading,
        numberOfWaypoints,
        segments,
        pickupAddress,
        destinationAddress,
        totalTurns,
        sharpTurns,
        uTurns,
        maxTurnAngle,
        turnEvents,
      };

      const userRecords = await getFromStorage('records');
      if (userRecords) {
        userRecords.unshift(currentRecord);
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

export const tripAnalaytics = async (record: RoadRecordAnalysis) => {
  try {
    const response = await axios.post(`${Config.agent_url}/analyze_trip`, {
      trip_data: record,
    });
    return response.data;
  } catch (error) {
    return {error: 'Failed to analyze trip'};
  }
};
