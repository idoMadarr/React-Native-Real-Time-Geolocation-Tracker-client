import {GeolocationResponse} from '@react-native-community/geolocation';
import {createSlice} from '@reduxjs/toolkit';

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
    content?: BottomSheetActions;
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
      // const recordListCopy: RecordType[] = JSON.parse(
      //   JSON.stringify(state.recordList),
      // );
      // recordListCopy.push(action.payload);
      // state.recordList = recordListCopy;
      // state.recordList.push(action.payload);
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
