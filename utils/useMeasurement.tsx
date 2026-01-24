import {useContext, useEffect, useState} from 'react';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import RNRestart from 'react-native-restart';
import {MessageBuilder} from '../models/MessageModel';
import {useAppDispatch} from '../redux/hooks/hooks';
import {setBottomSheet} from '../redux/slices/mainSlice';
import {MeasurementContext} from '../context/MeasurementContext';
import {NativeEventEmitter, NativeModules} from 'react-native';

const {ForegroundServiceModule} = NativeModules;

Geolocation.setRNConfiguration({
  authorizationLevel: 'always',
  skipPermissionRequests: false,
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

const eventEmitter = new NativeEventEmitter(ForegroundServiceModule);

export const useMeasurement = () => {
  const dispatch = useAppDispatch();

  const {directionRef} = useContext(MeasurementContext);

  const [currentLocation, setCurrentLocation] =
    useState<GeolocationResponse | null>();

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    const subscription = eventEmitter.addListener(
      'onLocationUpdate',
      location => {
        console.log(location);
        directionRef.current.push(location);
      },
    );

    return () => subscription.remove();
  }, []);

  const startLocationUpdatesNative = () => {
    ForegroundServiceModule.initForegroundService();
  };

  const stopLocationUpdatesNative = () => {
    ForegroundServiceModule.stopForegroundService();
    if (directionRef.current) {
      const driveRes = {
        direction: directionRef.current,
      };
      directionRef.current = [];

      return driveRes;
    }
  };

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setCurrentLocation(position);
      },

      error => {
        const errorMessage = new MessageBuilder(RNRestart.restart)
          .setMessage(`GPS Error: ${error.code}`)
          .setContent(error.message)
          .setButtonTitle('restart')
          .build();

        dispatch(setBottomSheet({type: 'message', content: errorMessage}));
      },
    );
  };

  return {
    currentLocation,
    fetchCurrentLocation,
    startLocationUpdatesNative,
    stopLocationUpdatesNative,
  };
};
