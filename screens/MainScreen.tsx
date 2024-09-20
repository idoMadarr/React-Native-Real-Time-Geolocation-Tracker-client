import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {PropDimensions} from '../services/dimensions';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {useMeasurement} from '../utils/useMeasurement';
import TextElement from '../components/Resuable/TextElement';
import ButtonElement from '../components/Resuable/ButtonElement';
import * as Colors from '../assets/colors/palette.json';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import LinearGradient from 'react-native-linear-gradient';
import DriveMode from '../components/MainPartials/DriveMode';
import {
  RecordType,
  setAppReady,
  setBottomSheet,
  setCurrentRecord,
} from '../redux/slices/mainSlice';
import RecordItem from '../components/MainPartials/RecordItem';

const RECORD_ITEM_WIDTH = PropDimensions.fullWidth * 0.7;
const SPACER = (PropDimensions.fullWidth - RECORD_ITEM_WIDTH) / 2;

const MainScreen = () => {
  const {currentLocation, startMeasurement, stopMeasurement} = useMeasurement();

  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);
  const recordList = useAppSelector(state => state.mainSlice.recordList);
  const displayRecordList = [{spacer: true}, ...recordList, {spacer: true}];

  // Animated BG Transition:
  const backgroundScale = useSharedValue(7.2);

  // Animated Elements:
  const buttonTranslateX = useSharedValue(0);
  const locationcTranslateX = useSharedValue(0);
  const lottieOpacity = useSharedValue(0);
  const recordListOpacity = useSharedValue(1);
  const recordListX = useSharedValue(0);

  useEffect(() => {
    dispatch(setAppReady());
  }, []);

  const onStart = () => {
    buttonTranslateX.value = PropDimensions.fullWidth;
    locationcTranslateX.value = -PropDimensions.fullWidth;
    backgroundScale.value = 0;
    lottieOpacity.value = 1;
    recordListOpacity.value = 0;

    startMeasurement();
  };

  const onStop = async () => {
    const modalActions = {
      fetchMeasurement: async () => {
        const result = await stopMeasurement();
        return result;
      },
      onSave: async () => {
        buttonTranslateX.value = 0;
        locationcTranslateX.value = 0;
        backgroundScale.value = 7.2;
        lottieOpacity.value = 0;
        recordListOpacity.value = 1;
      },
    };

    dispatch(setBottomSheet({type: 'actions', content: modalActions}));
  };

  const onRecord = async (content: RecordType) => {
    await dispatch(setCurrentRecord(content));
    await dispatch(setBottomSheet({type: 'details'}));
  };

  const buttonTranslateXAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(buttonTranslateX.value)}],
    };
  });

  const locationcTranslateXAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(locationcTranslateX.value)}],
    };
  });

  const backgroundScaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(backgroundScale.value)}],
    };
  });

  const lottieOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(lottieOpacity.value),
    };
  });

  const recordListOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(recordListOpacity.value),
      display: recordListOpacity.value === 0 ? 'none' : 'flex',
    };
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      recordListX.value = event.contentOffset.x;
    },
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
      <View style={[StyleSheet.absoluteFillObject, styles.customBackground]}>
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
      <Animated.View
        style={[styles.driveModeContainer, lottieOpacityAnimation]}>
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

      <Animated.View
        style={[styles.mapContainer, locationcTranslateXAnimation]}>
        <View style={styles.headerMapContainer}>
          <TextElement
            fontWeight={'bold'}
            cStyle={{textAlign: 'center', color: Colors.secondary}}>
            - Current Location -
          </TextElement>
        </View>
        <View style={styles.map}>
          {currentLocation ? (
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
              liteMode={true}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={false}
              showsMyLocationButton={false}>
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

      {recordList.length >= 2 ? (
        <Animated.ScrollView
          style={[recordListOpacityAnimation]}
          horizontal={true}
          bounces={false}
          scrollEventThrottle={16}
          snapToInterval={RECORD_ITEM_WIDTH}
          onScroll={onScroll}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}>
          {displayRecordList.map((item, index) => {
            const animatedScaleStyle = useAnimatedStyle(() => {
              const scale = interpolate(
                recordListX.value,
                [
                  (index - 2) * RECORD_ITEM_WIDTH,
                  (index - 1) * RECORD_ITEM_WIDTH,
                  index * RECORD_ITEM_WIDTH,
                ],
                [0.8, 1, 0.8],
              );
              return {
                transform: [{scale}],
              };
            });

            if ('spacer' in item)
              return <View key={index} style={{width: SPACER}} />;

            return (
              <Animated.View key={item._id} style={[animatedScaleStyle]}>
                <RecordItem {...item} onRecord={onRecord.bind(this, item)} />
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      ) : recordList.length === 1 ? (
        <Animated.View
          style={[{alignItems: 'center'}, recordListOpacityAnimation]}>
          <RecordItem
            {...recordList[0]}
            onRecord={onRecord.bind(this, recordList[0])}
          />
        </Animated.View>
      ) : null}

      <Animated.View style={[styles.startContainer, buttonTranslateXAnimation]}>
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
  customBackground: {
    backgroundColor: Colors.white,
  },
});

export default MainScreen;
