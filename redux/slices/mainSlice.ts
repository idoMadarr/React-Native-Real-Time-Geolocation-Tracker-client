import {createSlice} from '@reduxjs/toolkit';
import {MessageType} from '../../models/MessageModel';

export interface BottomSheetActionsPropsType {
  closeBottomSheet(): void;
  extendBottomsheet(): void;
}

export interface RecordType {
  _id: string;
  distance: number;
  averageSpeed: number;
  startTime: Date | string;
  endTime: Date | string;
  waypoints: {longitude: number; latitude: number}[];
  image?: string | null;
  // Extended metrics
  maxSpeed?: number;
  minSpeed?: number;
  duration?: number;
  durationFormatted?: string;
  elevationGain?: number;
  elevationLoss?: number;
  maxElevation?: number;
  minElevation?: number;
  pickupAddress: string;
  destinationAddress: string;
  stops?: number;
  averageHeading?: number;
  numberOfWaypoints?: number;
  segments?: Array<{
    distance: number;
    speed: number;
    time: number;
    startIndex: number;
    endIndex: number;
  }>;
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
  permissions: {
    gps: boolean;
    location: boolean;
    backgroundLocation: boolean;
    batteryOptimization: boolean;
    notifications: boolean;
    overlay: boolean;
  };
  bottomSheet: {
    type: string;
    content?: BottomSheetActionsPropsType | MessageType;
  } | null;
}

const initialState: RootStateApp = {
  appReady: false,
  recordList: [],
  currentRecord: null,
  geofence: null,
  permissions: {
    gps: false,
    location: false,
    backgroundLocation: false,
    batteryOptimization: false,
    notifications: false,
    overlay: false,
  },
  bottomSheet: null,
};

export const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setAppReady: state => {
      state.appReady = true;
    },
    updatePermission: (state, action) => {
      state.permissions[
        action.payload.type as keyof RootStateApp['permissions']
      ] = action.payload.value;
    },
    setPermissions: (state, action) => {
      state.permissions = {...state.permissions, ...action.payload};
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
  updatePermission,
  setPermissions,
  setBottomSheet,
  setRecords,
  updateRecordList,
  setGeofence,
  setCurrentRecord,
} = mainSlice.actions;

export default mainSlice.reducer;
