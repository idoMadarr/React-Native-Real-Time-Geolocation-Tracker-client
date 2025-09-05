import {createSlice} from '@reduxjs/toolkit';
import {MessageType} from '../../models/MessageModel';
import {GeolocationResponse} from '../../utils/haversineFormula';

export interface BottomSheetActions {
  fetchMeasurement(): {direction: GeolocationResponse[]; startTime: Date};
  onSave(): void;
}

export interface RecordType {
  _id: string;
  distance: number;
  averageSpeed: number;
  startTime: Date;
  endTime: Date;
  waypoints: {longitude: number; latitude: number}[];
  image?: string | null;
}

export interface GeofenceType {
  latitude: number;
  longitude: number;
}

interface RootStateApp {
  appReady: boolean;
  recordList: RecordType[];
  currentRecord: RecordType | null;
  geofence: GeofenceType | null;
  bottomSheet: {
    type: string;
    content?: BottomSheetActions | MessageType;
  } | null;
}

const initialState: RootStateApp = {
  appReady: false,
  recordList: [],
  currentRecord: null,
  geofence: null,
  bottomSheet: null,
};

export const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setAppReady: state => {
      state.appReady = true;
    },
    setBottomSheet: (state, action) => {
      state.bottomSheet = action.payload;
    },
    setRecords: (state, action) => {
      if (action.payload) {
        state.recordList = action.payload;
      }
    },
    updateRecordList: (state, action) => {
      state.recordList.unshift(action.payload);
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    },
    setGeofence: (state, action) => {
      state.geofence = action.payload;
    },
  },
});

export const {
  setAppReady,
  setBottomSheet,
  setRecords,
  updateRecordList,
  setGeofence,
  setCurrentRecord,
} = mainSlice.actions;

export default mainSlice.reducer;
