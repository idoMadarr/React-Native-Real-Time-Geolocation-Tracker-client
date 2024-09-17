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

// Screens
import SplashScreen from '../screens/SplashScreen';
import MainScreen from '../screens/MainScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import StopDriveModal from '../components/MainPartials/StopDriveModal';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useAppDispatch();

  const message = useAppSelector(state => state.mainSlice.message);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const stopDriveRef = useSharedValue(1);
  const saveDriveRef = useSharedValue(0);

  useEffect(() => {
    if (message) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [message]);

  const onSummarize = async (message: BottomSheetActions) => {
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const res = await message.onSummarize();
    const body = {
      record: res.direction,
      deviceId: `${manufacturer}:${deviceId}`,
    };
    await dispatch(saveRecord(body));

    stopDriveRef.value = 0;
    saveDriveRef.value = 1;

    extendModal('76%');
  };

  const onDone = (message: BottomSheetActions) => {
    closeBottomSheet();
    setTimeout(() => {
      message.onSave();
      stopDriveRef.value = 1;
      saveDriveRef.value = 0;
      dispatch(setBottomSheet(null));
    }, 500);
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
        onPress={() => dispatch(setBottomSheet(null))}
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
  if (message) {
    modalComponent = (
      <View style={styles.bottomSheetHeight}>
        <Animated.View style={[stopDriveOpacityAnimation]}>
          <StopDriveModal onSummarize={onSummarize.bind(this, message)} />
        </Animated.View>
        <Animated.View style={[saveDriveOpacityAnimation, styles.content]}>
          <SummarizeModal onDone={onDone.bind(this, message)} />
        </Animated.View>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={'splash'} component={SplashScreen} />
        <Stack.Screen name={'instructions'} component={InstructionsScreen} />
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
