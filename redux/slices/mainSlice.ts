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

interface RootStateApp {
  appReady: boolean;
  recordList: RecordType[];
  currentRecord: RecordType | null;
  bottomSheet: {
    type: string;
    content?: BottomSheetActions | MessageType;
  } | null;
}

const initialState: RootStateApp = {
  appReady: false,
  recordList: [],
  currentRecord: null,
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
  },
});

export const {
  setAppReady,
  setBottomSheet,
  setRecords,
  updateRecordList,
  setCurrentRecord,
} = mainSlice.actions;

export default mainSlice.reducer;
