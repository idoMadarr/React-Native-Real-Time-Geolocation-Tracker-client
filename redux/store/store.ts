import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import mainSlice from '../slices/mainSlice';

const rootReducer = combineReducers({
  mainSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
