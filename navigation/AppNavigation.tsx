import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import {navigationRef} from '../utils/rootNavigation';
import {Modalize} from 'react-native-modalize';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import {BottomSheetActions, setBottomSheet} from '../redux/slices/mainSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SummarizeModal from '../components/MainPartials/SummarizeModal';
import {PropDimensions} from '../services/dimensions';
import {saveRecord} from '../redux/actions/mainActions';
import {MessageBuilder, MessageType} from '../models/MessageModel';

// Screens
import InitScreen from '../screens/InitScreen';
import MainScreen from '../screens/MainScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import MessageBottomSheet from '../components/MainPartials/MessageBottomSheet';
import GeofenceScreen from '../screens/GeofenceScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useAppDispatch();

  const appReady = useAppSelector(state => state.mainSlice.appReady);
  const bottomSheet = useAppSelector(state => state.mainSlice.bottomSheet);
  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord);

  const bottomSheetRef = useRef<any>(null);
  const stopDriveRef = useSharedValue(1);
  const saveDriveRef = useSharedValue(0);

  const [modalHeight, setModalHeight] = useState(1);

  useEffect(() => {
    if (bottomSheet) {
      if (bottomSheet.type === 'actions' || bottomSheet.type === 'message')
        return extendModal(0.25);
      if (bottomSheet.type === 'details') extendModal(0.9);
    }
  }, [bottomSheet]);

  const onSummarize = async (actions: BottomSheetActions) => {
    const measurement = await actions.fetchMeasurement();
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const body = {
      record: measurement.direction,
      deviceId: `${manufacturer}:${deviceId}`,
    };

    const invalidRecord = await dispatch(saveRecord(body));

    if (invalidRecord) {
      return handleInvalidRecord(invalidRecord.error, actions);
    }

    stopDriveRef.value = 0;
    saveDriveRef.value = 1;
    extendModal(0.9);
  };

  const onDone = async (actions?: BottomSheetActions) => {
    closeBottomSheet();
    setTimeout(() => {
      if (actions && 'onSave' in actions) actions.onSave();
      stopDriveRef.value = 1;
      saveDriveRef.value = 0;
      dispatch(setBottomSheet(null));
    }, 500);
  };

  const handleInvalidRecord = (error: string, actions: BottomSheetActions) => {
    closeBottomSheet();

    const errorMessage = new MessageBuilder(onDone.bind(this, actions))
      .setMessage('Tracker Failed:')
      .setContent(error)
      .setButtonTitle('close')
      .build();

    return setTimeout(() => {
      dispatch(setBottomSheet({type: 'message', content: errorMessage}));
    }, 600);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const extendModal = (percentage: number) => {
    setModalHeight(percentage);
    setTimeout(() => {
      bottomSheetRef.current?.open();
    }, 500);
  };

  const stopDriveOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(stopDriveRef.value),
      display: stopDriveRef.value === 0 ? 'none' : 'flex',
    };
  });

  const saveDriveOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(saveDriveRef.value),
      display: saveDriveRef.value === 0 ? 'none' : 'flex',
    };
  });

  let modalComponent: React.JSX.Element = <View />;

  if (bottomSheet?.type === 'details' && currentRecord) {
    modalComponent = (
      <SummarizeModal
        onDone={onDone}
        buttonTitle={'Close'}
        currentRecord={currentRecord}
      />
    );
  }

  if (bottomSheet?.type === 'actions') {
    modalComponent = (
      <View style={styles.bottomSheetHeight}>
        <Animated.View style={[stopDriveOpacityAnimation]}>
          <MessageBottomSheet
            title={'End Drive'}
            content={` Are you sure you want to end the current drive? Your trip will stop being tracked, and all collected data will be saved. You can view the route and trip summary once the drive ends.`}
            buttonTitle={'Summarize'}
            onPress={onSummarize.bind(
              this,
              bottomSheet.content as BottomSheetActions,
            )}
          />
        </Animated.View>
        <Animated.View style={[saveDriveOpacityAnimation]}>
          {currentRecord && (
            <SummarizeModal
              onDone={onDone.bind(
                this,
                bottomSheet.content as BottomSheetActions,
              )}
              buttonTitle={'Save & Done'}
              currentRecord={currentRecord}
            />
          )}
        </Animated.View>
      </View>
    );
  }

  if (bottomSheet?.type === 'message') {
    modalComponent = (
      <MessageBottomSheet
        {...(bottomSheet.content as MessageType)}
        closeBottomSheet={closeBottomSheet}
      />
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!appReady && <Stack.Screen name={'splash'} component={InitScreen} />}
        <Stack.Screen name={'instructions'} component={InstructionsScreen} />
        <Stack.Screen name={'geofence'} component={GeofenceScreen} />
        <Stack.Screen name={'main'} component={MainScreen} />
      </Stack.Navigator>
      <Modalize
        ref={bottomSheetRef}
        snapPoint={PropDimensions.fullHeight * modalHeight}
        useNativeDriver={true}
        openAnimationConfig={{timing: {duration: 600}}}
        closeAnimationConfig={{timing: {duration: 350}}}
        panGestureEnabled={false}>
        {modalComponent}
      </Modalize>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  bottomSheetHeight: {
    height: PropDimensions.fullHeight * 0.7,
  },
});

export default AppNavigation;
