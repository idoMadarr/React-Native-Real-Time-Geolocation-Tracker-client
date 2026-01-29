import React, {useEffect, useRef} from 'react';
import {AppState, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/rootNavigation';
import {checkAppPermissions} from '../utils/permissions';

// Screens
import InitScreen from '../screens/InitScreen';
import MainScreen from '../screens/MainScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import GeofenceScreen from '../screens/GeofenceScreen';
import SummaryScreen from '../screens/SummaryScreen';
import DriveScreen from '../screens/DriveScreen';
import TripsScreen from '../screens/TripsScreen';
import TesterScreen from '../screens/TesterScreen';
import MainBottomsheet from '../components/BottomSheet/MainBottomSheet';
import GenericHeader from '../components/Resuable/GenericHeader';
import PermissionsScreen from '../screens/PermissionsScreen';
import {NavigationType, ScreenType} from './NavigationType';

const Stack = createNativeStackNavigator<NavigationType>();

const AppNavigation = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkAppPermissions();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.app}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={ScreenType.Splash} component={InitScreen} />
          <Stack.Screen
            name={ScreenType.Permissions}
            component={PermissionsScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Setting Permissions'}
                  description={
                    'We needs the following permissions to record your trips'
                  }
                  backDestination={ScreenType.Main}
                />
              ),
            }}
          />
          <Stack.Screen
            name={ScreenType.Instructions}
            component={InstructionsScreen}
          />
          <Stack.Screen name={ScreenType.Main} component={MainScreen} />
          <Stack.Screen
            name={ScreenType.Drive}
            component={DriveScreen}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name={ScreenType.Trips}
            component={TripsScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Trips History'}
                  description={'Explore your past trips and driving activity'}
                  backDestination={ScreenType.Main}
                />
              ),
            }}
          />
          <Stack.Screen
            name={ScreenType.Summary}
            component={SummaryScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Summary'}
                  description={'Check your driving statistics'}
                  backDestination={ScreenType.Trips}
                />
              ),
            }}
          />
          <Stack.Screen name={ScreenType.Geofence} component={GeofenceScreen} />
          <Stack.Screen name={ScreenType.Testing} component={TesterScreen} />
        </Stack.Navigator>
        <MainBottomsheet />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

export default AppNavigation;
