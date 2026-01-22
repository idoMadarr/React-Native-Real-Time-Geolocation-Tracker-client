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

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name={'splash'} component={InitScreen} />
          <Stack.Screen
            name={'permissions'}
            component={PermissionsScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Setting Permissions'}
                  description={
                    'We needs the following permissions to record your trips'
                  }
                />
              ),
            }}
          />
          <Stack.Screen name={'instructions'} component={InstructionsScreen} />
          <Stack.Screen name={'main'} component={MainScreen} />
          <Stack.Screen
            name={'drive'}
            component={DriveScreen}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name={'trips'}
            component={TripsScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Trips History'}
                  description={'Explore your past trips and driving activity'}
                />
              ),
            }}
          />
          <Stack.Screen
            name={'summary'}
            component={SummaryScreen}
            options={{
              headerShown: true,
              header: () => (
                <GenericHeader
                  title={'Summary'}
                  description={'Check your driving statistics'}
                />
              ),
            }}
          />
          <Stack.Screen name={'geofence'} component={GeofenceScreen} />
          <Stack.Screen name={'testing'} component={TesterScreen} />
        </Stack.Navigator>
        <MainBottomsheet />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  app: {flex: 1},
});

export default AppNavigation;
