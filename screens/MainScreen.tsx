import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {PropDimensions} from '../services/dimensions';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {useMeasurement} from '../utils/useMeasurement';
import TextElement from '../components/Resuable/TextElement';
import ButtonElement from '../components/Resuable/ButtonElement';
import * as Colors from '../assets/colors/palette.json';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppDispatch} from '../redux/hooks/hooks';
import LinearGradient from 'react-native-linear-gradient';
import DriveMode from '../components/MainPartials/DriveMode';
import {setBottomSheet} from '../redux/slices/mainSlice';

const MainScreen = () => {
  const {currentLocation, startMeasurement, stopMeasurement} = useMeasurement();

  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);

  const disable = false;

  const buttonScrollX = useSharedValue(0);
  const cardScrollX = useSharedValue(0);
  const backgroundScale = useSharedValue(7.2);
  const driveAnimationX = useSharedValue(0);
  const driveAnimationOpacity = useSharedValue(0);

  const onStart = () => {
    buttonScrollX.value = PropDimensions.fullWidth;
    cardScrollX.value = -PropDimensions.fullWidth;
    backgroundScale.value = 0;
    driveAnimationOpacity.value = 1;

    startMeasurement();
  };

  const onStop = async () => {
    const modalActions = {
      onSummarize: async () => {
        const result = await stopMeasurement();
        return result;
      },
      onSave: async () => {
        buttonScrollX.value = 0;
        cardScrollX.value = 0;
        backgroundScale.value = 7.2;
        driveAnimationOpacity.value = 0;
      },
    };

    dispatch(setBottomSheet(modalActions));
  };

  const buttonScrollXAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(buttonScrollX.value)}],
    };
  });

  const cardScrollXAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(cardScrollX.value)}],
    };
  });

  const backgroundScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(backgroundScale.value)}],
    };
  });

  const lottieAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(driveAnimationX.value)}],
      opacity: withTiming(driveAnimationOpacity.value),
    };
  });

  const CustomBackground = () => {
    const colors = [
      Colors.primary,
      Colors.primary,
      Colors.primary,
      Colors.primary,
      Colors.secondary,
    ];

    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: Colors.white,
          },
        ]}>
        <Animated.View style={[styles.inner, backgroundScaleAnimation]}>
          <LinearGradient
            colors={colors}
            style={{
              width: PropDimensions.circleButton,
              height: PropDimensions.circleButton,
            }}
          />
        </Animated.View>
      </View>
    );
  };

  const DriveAnimation = () => {
    return (
      <Animated.View style={[styles.driveModeContainer, lottieAnimation]}>
        <DriveMode onStop={onStop} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.primary}
      />
      <CustomBackground />

      <DriveAnimation />

      <Animated.View style={[styles.mapContainer, cardScrollXAnimation]}>
        <View style={styles.headerMapContainer}>
          <TextElement cStyle={{color: 'black'}}>Here you are:</TextElement>
        </View>
        <View style={styles.map}>
          {currentLocation && disable ? (
            <MapView
              ref={mapRef}
              style={{flex: 1}}
              initialRegion={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                // Delta values is the inital scoop view of the map (zoom)
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              showsMyLocationButton={true}>
              <Marker
                coordinate={currentLocation.coords}
                pinColor={Colors.warning}
              />
            </MapView>
          ) : (
            <ActivityIndicator
              size={'small'}
              color={Colors.primary}
              style={styles.spinner}
            />
          )}
        </View>
      </Animated.View>

      <Animated.View style={[styles.startContainer, buttonScrollXAnimation]}>
        <ButtonElement
          backgroundColor={Colors.secondary}
          onPress={onStart}
          fontWeight={'bold'}
          title={'START\nnew drive'}
          titleColor={Colors.white}
          cStyle={{
            width: PropDimensions.circleButton,
            height: PropDimensions.circleButton,
            borderRadius: 90,
            elevation: 8,
            marginBottom: '6%',
          }}
        />
        <TextElement fontWeight={'demi-bold'}>
          Ready to hit the road? Press the button to start tracking your drive
          in real-time. We’ll capture your journey, providing accurate routes
          and distance details along the way!
        </TextElement>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: '8%',
  },
  inner: {
    alignSelf: 'center',
    borderRadius: 150,
    overflow: 'hidden',
  },
  mapContainer: {
    alignSelf: 'center',
    height: PropDimensions.sectionHeight,
    width: PropDimensions.standardWidth,
    padding: 8,
    elevation: 8,
    backgroundColor: '#eee',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  headerMapContainer: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
  },
  map: {
    height: '80%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
  },
  startContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: PropDimensions.standardWidth,
  },
  driveModeContainer: {
    width: PropDimensions.fullWidth,
    height: Dimensions.get('window').height * 0.3,
    position: 'absolute',
    top: '36%',
  },
  spinner: {
    position: 'absolute',
    left: '46%',
    top: '30%',
  },
});

export default MainScreen;
