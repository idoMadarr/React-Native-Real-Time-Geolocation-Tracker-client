import {useEffect, useRef, useState} from 'react';
import backgroundServer from 'react-native-background-actions';
import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';
import RNRestart from 'react-native-restart';
import {MessageBuilder} from '../models/MessageModel';
import {useAppDispatch} from '../redux/hooks/hooks';
import {setBottomSheet} from '../redux/slices/mainSlice';

const options = {
  taskName: 'Background Task',
  taskTitle: 'Background Task is running',
  taskDesc: 'This is a description for the task',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat', // You can set a deep link URI here if needed
  parameters: {
    delay: 5000, // Run the task every 5 seconds
  },
};

Geolocation.setRNConfiguration({
  authorizationLevel: 'always',
  skipPermissionRequests: false,
  enableBackgroundLocationUpdates: true,
  locationProvider: 'auto',
});

const sleep = (time: number) =>
  // @ts-ignore:
  new Promise(resolve => setTimeout(() => resolve(), time));

export const useMeasurement = () => {
  const dispatch = useAppDispatch();

  let directionRef = useRef<GeolocationResponse[]>([]);

  const [currentLocation, setCurrentLocation] =
    useState<GeolocationResponse | null>();

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const startMeasurement = async () => {
    await backgroundServer.start(backgroundTask, options);
  };

  const stopMeasurement = async () => {
    if (directionRef.current) {
      //   drivingTime();
      await backgroundServer.stop();

      const driveRes = {
        direction: directionRef.current,
      };
      directionRef.current = [];

      return driveRes;
    }
  };

  const backgroundTask = async (taskDataArguments: any) => {
    const {delay} = taskDataArguments;

    console.log('Background Server');
    while (backgroundServer.isRunning()) {
      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          console.log(directionRef.current, 'positions');

          directionRef.current.push(position);
        },
        error => {
          terminateMeasurement(error);
        },
        {
          enableHighAccuracy: true,
          useSignificantChanges: false,
          // distanceFilter: 50, // Minimum distance (in meters) to update the location
          interval: 5000, // Update interval (in milliseconds), which is 5 sec
          fastestInterval: 5000, // Fastest update interval (in milliseconds)
          timeout: 5000,
          maximumAge: 0,
        },
      );

      await sleep(delay);
    }
  };

  const terminateMeasurement = async (error: GeolocationError) => {
    // User change the permission while the app start to measure
    // In this case - restart the app for sending the user the InstructionsScreen
    if (error.code === error.PERMISSION_DENIED) {
      await stopMeasurement();
      return RNRestart.restart();
    }

    // Unavailable GPS coords (Ex. underground park) / Slow GPS retriving data
    // In this case - keep tracking till the GPS will found a valid coords
    if (
      error.code === error.POSITION_UNAVAILABLE ||
      error.code === error.TIMEOUT
    )
      return;
  };

  const fetchCurrentLocation = () => {
    console.log('asd');

    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        console.log(position, 'position');

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
    startMeasurement,
    stopMeasurement,
  };

  //   const formattedDriveTime = () => {
  //       const stopTime = new Date();

  //       // @ts-ignore:
  //     const timeDifference = stopTime - startTime.current;
  //     // @ts-ignore:
  //     const stoppedTime = new Date(startTime.current.getTime() + timeDifference);

  //     const totalSecondsPassed = Math.floor(timeDifference / 1000);
  //     const hoursPassed = Math.floor(totalSecondsPassed / 3600); // 3600 seconds in an hour
  //     const minutesPassed = Math.floor((totalSecondsPassed % 3600) / 60); // Remaining minutes after hours
  //     const remainingSeconds = totalSecondsPassed % 60; // Remaining seconds after minutes

  //     const resultString = `Driving stopped after ${hoursPassed} hour(s), ${minutesPassed} minute(s), and ${remainingSeconds} second(s).`;
  //     endTime.current = stoppedTime;
  //     Alert.alert('STOP DRIVING', resultString);
  //   };
};
