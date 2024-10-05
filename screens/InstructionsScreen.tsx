import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  StyleSheet,
  Linking,
  AppState,
  Image,
  NativeModules,
} from 'react-native';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {useAppDispatch} from '../redux/hooks/hooks';
import {PropDimensions} from '../services/dimensions';
import Step from '../components/InstructionsPartials/Step';
import {steps, constants} from '../fixtures/instructions-steps.json';
import {
  askForgroundLocation,
  checkBackgroundLocation,
  checkForgroundLocation,
  checkUnrestrictedBattery,
} from '../utils/permissions';
import {navigate} from '../utils/rootNavigation';
import * as Colors from '../assets/colors/palette.json';
import {setAppReady} from '../redux/slices/mainSlice';
import Config from 'react-native-config';

const {GPSServices} = NativeModules;

const bgs = [Colors.tertiary, '#5B99C2', '#445069', Colors.primary];

const images: any = {
  ['car-wheel']: require('../assets/images/car-wheel.png'),
  ['folded-map']: require('../assets/images/folded-map.png'),
  ['steering_wheel']: require('../assets/images/steering_wheel.png'),
  ['final']: require('../assets/images/final.png'),
};

const InstructionsScreen = () => {
  const dispatch = useAppDispatch();

  const flatListRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [forgroundLocationStatus, setForgroundLocationStatus] = useState<
    boolean | null
  >(null);
  const [backgroundLocationStatus, setBackgroundLocationStatus] = useState<
    boolean | null
  >(null);
  const [gpsLocationStatus, setLocationGpsStatus] = useState<boolean | null>(
    null,
  );
  const [restrictBatteryStatus, setRestrictBatteryStatus] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    initInstructions();
    dispatch(setAppReady());
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        initInstructions();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const initInstructions = async () => {
    const forgroundStatus = await checkForgroundLocation();
    const backgroundStatus = await checkBackgroundLocation();
    const gpsStatus = await GPSServices.isGPSEnabled();
    const batteryStatus = await checkUnrestrictedBattery();

    setForgroundLocationStatus(forgroundStatus);
    setBackgroundLocationStatus(backgroundStatus);
    setLocationGpsStatus(gpsStatus);
    setRestrictBatteryStatus(batteryStatus);
  };

  const Indicator = ({scrollX}: {scrollX: Animated.Value}) => {
    return (
      <View style={styles.indicatorContainer}>
        {steps.map((_, index) => {
          // [prevSlide, currentSlide, nextSlide]
          const inputRange = [
            (index - 1) * PropDimensions.fullWidth,
            index * PropDimensions.fullWidth,
            (index + 1) * PropDimensions.fullWidth,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.indicatorItem, {transform: [{scale}], opacity}]}
            />
          );
        })}
      </View>
    );
  };

  const Backdrop = ({scrollX}: {scrollX: Animated.Value}) => {
    const backgroundColor = scrollX.interpolate({
      inputRange: bgs.map((_, i) => i * PropDimensions.fullWidth),
      outputRange: bgs.map(bg => bg),
    });
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor,
          },
        ]}
      />
    );
  };

  const Square = ({scrollX}: {scrollX: Animated.Value}) => {
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(scrollX, PropDimensions.fullWidth),
        new Animated.Value(PropDimensions.fullWidth),
      ),
      1,
    );

    const rotate = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['35deg', '0deg', '35deg'],
    });

    const translateX = YOLO.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -PropDimensions.fullHeight, 0],
    });

    return (
      <Animated.View
        style={{
          width: PropDimensions.fullHeight,
          height: PropDimensions.fullHeight,
          backgroundColor: Colors.white,
          borderRadius: 90,
          top: -PropDimensions.fullHeight * 0.6,
          left: -PropDimensions.fullHeight * 0.3,
          position: 'absolute',
          transform: [{rotate}, {translateX}],
        }}
      />
    );
  };

  const handleProgress = async (step: number) => {
    switch (step) {
      case constants.GPS:
        if (!gpsLocationStatus) {
          GPSServices.openGPSSettings();
          break;
        }
        nextStep();
        break;

      case constants.FORGROUND_PERMISSION:
        const cb = () => {
          setForgroundLocationStatus(true);
          nextStep();
        };
        askForgroundLocation(cb);
        break;
      case constants.BACKGROUND_PERMISSION:
        backgroundLocationStatus && restrictBatteryStatus
          ? nextStep()
          : Linking.openSettings();
        break;

      default:
        if (
          forgroundLocationStatus &&
          backgroundLocationStatus &&
          gpsLocationStatus &&
          restrictBatteryStatus
        ) {
          navigate('main');
        }
        break;
    }
  };

  const nextStep = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < steps.length) {
      return flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const fetchPrivacyPolicy = () => Linking.openURL(Config.privacyPolicy!);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'dark-content'}
        backgroundColor={Colors.white}
      />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />
      <Animated.FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={itemData => itemData.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        pagingEnabled={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
            listener: event => {
              // @ts-ignore:
              const offsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(offsetX / PropDimensions.fullWidth);
              setCurrentIndex(newIndex);
            },
          },
        )}
        renderItem={({item}) => {
          const statusButton =
            item.id === constants.GPS
              ? gpsLocationStatus
              : item.id === constants.FORGROUND_PERMISSION
              ? forgroundLocationStatus
              : item.id === constants.BACKGROUND_PERMISSION
              ? backgroundLocationStatus && restrictBatteryStatus
              : item.id === constants.DONE
              ? forgroundLocationStatus &&
                backgroundLocationStatus &&
                gpsLocationStatus &&
                restrictBatteryStatus
              : true;

          return (
            <Step
              id={item.id}
              title={item.title}
              description={item.description}
              asset={item.asset}
              action={item.action}
              handleProgress={handleProgress.bind(this, item.id)}
              statusButton={statusButton!}
              fetchPrivacyPolicy={fetchPrivacyPolicy}>
              <Image
                source={images[item.asset]}
                resizeMode={'contain'}
                style={styles.image}
              />
            </Step>
          );
        }}
      />
      <Indicator scrollX={scrollX} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: '4%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  image: {
    width: PropDimensions.fullWidth / 1.4,
    height: PropDimensions.fullWidth / 1.6,
  },
  indicatorItem: {
    margin: 10,
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
});

export default InstructionsScreen;
