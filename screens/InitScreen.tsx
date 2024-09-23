import React, {useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, NativeModules} from 'react-native';
import {navigate} from '../utils/rootNavigation';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import LottieView from 'lottie-react-native';
import {useAppDispatch} from '../redux/hooks/hooks';
import Colors from '../assets/colors/palette.json';
import TextElement from '../components/Resuable/TextElement';
import LinearGradient from 'react-native-linear-gradient';
import {PropDimensions} from '../services/dimensions';
import {
  checkBackgroundLocation,
  checkForgroundLocation,
  checkUnrestrictedBattery,
} from '../utils/permissions';
import {fetchRecords} from '../redux/actions/mainActions';
import {getManufacturer, getUniqueId} from 'react-native-device-info';

const {GPSServices} = NativeModules;

const InitScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      initApplication();
    }, 3000);
  }, []);

  const initApplication = async () => {
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const forgroundStatus = await checkForgroundLocation();
    const backgroundStatus = await checkBackgroundLocation();
    const isGPSEnabled = await GPSServices.isGPSEnabled();
    const batteryStatus = await checkUnrestrictedBattery();

    await dispatch(fetchRecords(`${manufacturer}:${deviceId}`));
    navigate(
      forgroundStatus && backgroundStatus && isGPSEnabled && batteryStatus
        ? 'main'
        : 'instructions',
    );
  };

  const CustomBackground = () => {
    const colors = [Colors.white, Colors.primary, Colors.primary];

    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: Colors.white,
          },
        ]}>
        <View style={[styles.inner]}>
          <LinearGradient
            colors={colors}
            style={{
              width: PropDimensions.circleButton,
              height: PropDimensions.circleButton,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'dark-content'}
        backgroundColor={Colors.white}
      />
      <CustomBackground />
      <TextElement fontWeight={'bold'}>
        <TextElement
          fontSize={'xl'}
          fontWeight={'bold'}
          cStyle={{color: Colors.primary}}>
          R
        </TextElement>
        <TextElement fontSize={'xl'} fontWeight={'bold'}>
          oad Recorder
        </TextElement>
      </TextElement>
      <TextElement fontSize={'lg'}>Get ready for your next trip</TextElement>
      <LottieView
        autoPlay
        loop
        source={require('../assets/animations/splash_animation.json')}
        style={styles.lottie}
      />
      <LottieView
        autoPlay
        loop
        source={require('../assets/animations/road_animation.json')}
        style={styles.roadLottie}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: PropDimensions.fullWidth * 0.8,
    height: PropDimensions.fullWidth * 0.8,
  },
  roadLottie: {
    position: 'absolute',
    bottom: '-10%',
    transform: [{rotate: '90deg'}],
    opacity: 0.5,
    width: PropDimensions.fullWidth,
    height: PropDimensions.fullWidth,
  },
  inner: {
    alignSelf: 'center',
    borderRadius: 150,
    overflow: 'hidden',
    transform: [{scale: 6.2}],
    position: 'absolute',
    bottom: 0,
  },
  spinner: {
    position: 'absolute',
    bottom: '5%',
  },
});

export default InitScreen;
