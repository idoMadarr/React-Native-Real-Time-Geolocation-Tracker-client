import {useEffect, useRef, useState} from 'react';
import backgroundServer from 'react-native-background-actions';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {Alert} from 'react-native';

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
  let directionRef = useRef<GeolocationResponse[]>([]);
  let startTime = useRef<Date | null>();

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
      Alert.alert('Title', JSON.stringify(directionRef.current));
      const driveRes = {
        direction: directionRef.current,
        startTime: startTime.current,
      };
      directionRef.current = [];
      startTime.current = null;

      return driveRes;
    }
  };

  const backgroundTask = async (taskDataArguments: any) => {
    const {delay} = taskDataArguments;
    startTime.current = new Date();

    console.log('Background Server');
    while (backgroundServer.isRunning()) {
      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          console.log(position);
          directionRef.current.push(position);
        },
        error => {
          Alert.alert('GPS Error', JSON.stringify(error));
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

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setCurrentLocation(position);
      },
      error => {
        Alert.alert('GPS Error', JSON.stringify(error));
      },
    );
  };

  return {
    currentLocation,
    startMeasurement,
    stopMeasurement,
  };

  //   const drivingTime = () => {
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
