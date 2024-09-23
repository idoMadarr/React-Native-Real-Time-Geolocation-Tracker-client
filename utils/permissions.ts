import {NativeModules, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
const {BatteryOptimizationModule} = NativeModules;

export const askForgroundLocation = async (cb?: () => void) => {
  const locationPermission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const status = await request(locationPermission);
  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    cb!();
  }

  if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
    console.log(
      'show a modal that tell the user to allow the permission from the settings',
    );
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
