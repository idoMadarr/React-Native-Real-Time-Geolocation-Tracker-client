import {useContext, useEffect, useState} from 'react';
// import backgroundServer from 'react-native-background-actions';
import Geolocation, {
  // GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import RNRestart from 'react-native-restart';
import {MessageBuilder} from '../models/MessageModel';
import {useAppDispatch} from '../redux/hooks/hooks';
import {setBottomSheet} from '../redux/slices/mainSlice';
import {MeasurementContext} from '../context/MeasurementContext';
// import {setDelay} from './helpers';
import {NativeEventEmitter, NativeModules} from 'react-native';

const {ForegroundServiceModule} = NativeModules;

// const options = {
//   taskName: 'Background Task',
//   taskTitle: 'Background Task is running',
//   taskDesc: 'This is a description for the task',
//   taskIcon: {
//     name: 'ic_launcher',
//     type: 'mipmap',
//   },
//   color: '#ff00ff',
//   linkingURI: 'yourSchemeHere://chat', // You can set a deep link URI here if needed
//   parameters: {
//     delay: 5000, // Run the task every 5 seconds
//   },
// };

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

  // const startMeasurement = async () => {
  //   await backgroundServer.start(pollingGPSApproch, options);
  // };

  // const stopMeasurement = async () => {
  //   if (directionRef.current) {
  //     //   drivingTime();
  //     await backgroundServer.stop();

  //     const driveRes = {
  //       direction: directionRef.current,
  //     };
  //     directionRef.current = [];

  //     return driveRes;
  //   }
  // };

  // const pollingGPSApproch = async (taskDataArguments: any) => {
  //   const {delay} = taskDataArguments;

  //   console.log('Background Server');
  //   while (backgroundServer.isRunning()) {
  //     Geolocation.getCurrentPosition(
  //       (position: GeolocationResponse) => {
  //         // @ts-ignore:
  //         directionRef.current.push(position);
  //       },
  //       error => {
  //         terminateMeasurement(error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         useSignificantChanges: false,
  //         // distanceFilter: 50, // Minimum distance (in meters) to update the location
  //         interval: 5000, // Update interval (in milliseconds), which is 5 sec
  //         fastestInterval: 5000, // Fastest update interval (in milliseconds)
  //         timeout: 5000,
  //         maximumAge: 0,
  //       },
  //     );

  //     await setDelay(delay);
  //   }
  // };

  const startLocationUpdatesNative = () => {
    ForegroundServiceModule.initForegroundService();
  };

  const stopLocationUpdatesNative = () => {
    console.log(directionRef.current, 'stop');

    ForegroundServiceModule.stopForegroundService();
    if (directionRef.current) {
      const driveRes = {
        direction: directionRef.current,
      };
      directionRef.current = [];

      return driveRes;
    }
  };

  // const terminateMeasurement = async (error: GeolocationError) => {
  //   // User change the permission while the app start to measure
  //   // In this case - restart the app for sending the user the InstructionsScreen
  //   if (error.code === error.PERMISSION_DENIED) {
  //     await stopMeasurement();
  //     return RNRestart.restart();
  //   }

  //   // Unavailable GPS coords (Ex. underground park) / Slow GPS retriving data
  //   // In this case - keep tracking till the GPS will found a valid coords
  //   if (
  //     error.code === error.POSITION_UNAVAILABLE ||
  //     error.code === error.TIMEOUT
  //   )
  //     return;
  // };

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
    // startMeasurement,
    // stopMeasurement,
    startLocationUpdatesNative,
    stopLocationUpdatesNative,
  };
};
