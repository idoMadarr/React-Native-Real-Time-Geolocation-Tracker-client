import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import {navigationRef} from '../utils/rootNavigation';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import {BottomSheetActions, setBottomSheet} from '../redux/slices/mainSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SummarizeModal from '../components/MainPartials/SummarizeModal';
import {PropDimensions} from '../services/dimensions';
import Colors from '../assets/colors/palette.json';
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

  const bottomSheetRef = useRef<BottomSheet>(null);
  const stopDriveRef = useSharedValue(1);
  const saveDriveRef = useSharedValue(0);

  useEffect(() => {
    if (bottomSheet) {
      if (bottomSheet.type === 'actions' || bottomSheet.type === 'message') {
        bottomSheetRef.current?.snapToIndex(0);
        return;
      }
      if (bottomSheet.type === 'details') {
        extendModal('85%');
      }
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
    extendModal('85%');
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

  const extendModal = (percentage: string) => {
    bottomSheetRef.current?.snapToPosition(percentage);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        pressBehavior={'none'}
        onPress={() => {
          // saveDriveRef.value = 0;
          dispatch(setBottomSheet(null));
        }}
        {...props}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

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

  const snapPoints = useMemo(() => ['22%', '40%', '60%', '80%', '100%'], []);

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
      <MessageBottomSheet {...(bottomSheet.content as MessageType)} />
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        enablePanDownToClose={true}
        animationConfigs={{duration: 600}}
        handleComponent={null}
        handleIndicatorStyle={{backgroundColor: Colors.secondary}}
        backdropComponent={renderBackdrop}>
        {modalComponent}
      </BottomSheet>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  bottomSheetHeight: {
    height: PropDimensions.fullHeight * 0.7,
  },
  content: {
    position: 'absolute',
    top: 0,
  },
});

export default AppNavigation;
