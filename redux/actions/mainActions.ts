import axios from 'axios';
import {Dispatch} from 'redux';
import {setCurrentRecord} from '../slices/mainSlice';

export const saveRecord = (body: any) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post(
      'http://192.168.2.77:5000/summarize',
      body,
    );
    dispatch(setCurrentRecord(response.data));
  } catch (error) {
    console.log(error);
  }
};
