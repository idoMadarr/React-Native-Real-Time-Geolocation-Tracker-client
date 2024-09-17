import {GeolocationResponse} from '@react-native-community/geolocation';
import {createSlice} from '@reduxjs/toolkit';

export interface BottomSheetActions {
  onSummarize(): {direction: GeolocationResponse[]; startTime: Date};
  onSave(): void;
}

export interface RecordType {
  distance: number;
  averageSpeed: number;
  startTime: Date;
  endTime: Date;
  waypoints: {longitude: number; latitude: number}[];
}

interface RootStateApp {
  message: BottomSheetActions | null;
  recordList: RecordType[];
  currentRecord: RecordType | null;
}

const initialState: RootStateApp = {
  message: null,
  recordList: [],
  currentRecord: null,
};

export const mainSlice = createSlice({
  name: 'mainSlice',
  initialState,
  reducers: {
    setBottomSheet: (state, action) => {
      state.message = action.payload;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    },
    setRecord: (state, action) => {
      state.recordList = [...state.recordList, action.payload];
    },
  },
});

export const {setBottomSheet, setCurrentRecord, setRecord} = mainSlice.actions;

export default mainSlice.reducer;
