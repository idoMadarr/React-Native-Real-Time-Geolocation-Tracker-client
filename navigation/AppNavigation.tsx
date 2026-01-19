import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/rootNavigation';
import {useAppSelector} from '../redux/hooks/hooks';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
  const appReady = useAppSelector(state => state.mainSlice.appReady);

  return (
    <GestureHandlerRootView style={styles.app}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!appReady && <Stack.Screen name={'splash'} component={InitScreen} />}
          <Stack.Screen name={'permissions'} component={PermissionsScreen} />
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
