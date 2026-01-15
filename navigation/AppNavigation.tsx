import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/rootNavigation';
import {useAppSelector} from '../redux/hooks/hooks';

// Screens
import InitScreen from '../screens/InitScreen';
import MainScreen from '../screens/MainScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import GeofenceScreen from '../screens/GeofenceScreen';
import SummaryScreen from '../screens/SummaryScreen';
import MainBottomsheet from '../components/BottomSheet/MainBottomSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const appReady = useAppSelector(state => state.mainSlice.appReady);
  const bottomSheet = useAppSelector(state => state.mainSlice.bottomSheet);

  useEffect(() => {
    // autoGraphZoom();
  }, [bottomSheet]);

  // const autoGraphZoom = () => {
  //   if (bottomSheet) {
  //     if (bottomSheet.type === 'actions' || bottomSheet.type === 'message')
  //       return extendModal(0.25);
  //     if (bottomSheet.type === 'details') extendModal(0.9);
  //     if (bottomSheet.type === 'summary') extendModal(0.45);
  //   }
  // };

  return (
    <GestureHandlerRootView style={styles.app}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!appReady && <Stack.Screen name={'splash'} component={InitScreen} />}
          <Stack.Screen name={'instructions'} component={InstructionsScreen} />
          <Stack.Screen name={'geofence'} component={GeofenceScreen} />
          <Stack.Screen name={'main'} component={MainScreen} />
          <Stack.Screen name={'summary'} component={SummaryScreen} />
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
