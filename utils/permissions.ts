import {NativeModules, Platform} from 'react-native';
import {
  checkNotifications,
  check,
  PERMISSIONS,
  request,
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';
import store from '../redux/store/store';
import {setPermissions} from '../redux/slices/mainSlice';
const {BatteryOptimizationModule, GPSServices, OverlayPermission} =
  NativeModules;

export const askPushNotifications = async (cb?: () => void) => {
  const {status} = await requestNotifications(['alert', 'sound']);

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    cb!();
  }
};

export const checkPushNotifications = async () => {
  const {status} = await checkNotifications();

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return true;
  }
  return false;
};

export const askForgroundLocation = async (cb?: () => void) => {
  const locationPermission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const status = await request(locationPermission, {
    title: 'Enable GPS for Precise Tracking',
    message:
      'This app requires access to your location for using precise location in real-time.',
    buttonPositive: 'OK',
  });

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    cb!();
  }

  return status;
};

export const checkForgroundLocation = async () => {
  const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  if (
    status === RESULTS.BLOCKED ||
    status === RESULTS.DENIED ||
    status === RESULTS.UNAVAILABLE
  ) {
    return false;
  }
  return true;
};

export const checkBackgroundLocation = async () => {
  const status = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
  if (
    status === RESULTS.BLOCKED ||
    status === RESULTS.DENIED ||
    status === RESULTS.UNAVAILABLE
  ) {
    return false;
  }
  return true;
};

export const checkUnrestrictedBattery = async () => {
  const status =
    (await BatteryOptimizationModule.checkBatteryOptimization()) as string;

  if (status === 'unrestricted') return true;
  return false;
};

export const checkAppPermissions = async () => {
  const isGPSEnabled = await GPSServices.isGPSEnabled();
  const forgroundStatus = await checkForgroundLocation();
  const backgroundStatus = await checkBackgroundLocation();
  const batteryStatus = await checkUnrestrictedBattery();
  const notificationsStatus = await checkPushNotifications();
  const overlayStatus = await OverlayPermission.checkOverlayPermission();

  store.dispatch(
    setPermissions({
      gps: isGPSEnabled,
      location: forgroundStatus,
      backgroundLocation: backgroundStatus,
      batteryOptimization: batteryStatus,
      notifications: notificationsStatus,
      overlay: overlayStatus,
    }),
  );
};
