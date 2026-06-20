import React, {useEffect, useRef} from 'react';
import {Dimensions, StyleSheet, View, AppState} from 'react-native';
import {PropDimensions} from '../services/dimensions';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {useMeasurement} from '../utils/useMeasurement';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import Colors from '../assets/colors/palette.json';
import TextElement from '../components/Resuable/TextElement';
import ButtonElement from '../components/Resuable/ButtonElement';
import LottieView from 'lottie-react-native';
import {useAppDispatch} from '../redux/hooks/hooks';
import {setBottomSheet} from '../redux/slices/mainSlice';
import {MessageBuilder} from '../models/MessageModel';
import {getManufacturer, getUniqueId} from 'react-native-device-info';
import {saveRecord} from '../redux/actions/mainActions';
import {navigate} from '../utils/rootNavigation';
import {ScreenType} from '../navigation/NavigationType';

const DriveScreen = () => {
  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);

  const {currentLocation, fetchCurrentLocation, stopLocationUpdatesNative} =
    useMeasurement();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      fetchCurrentLocation();
      interval = setInterval(fetchCurrentLocation, 10000);
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleAppStateChange = (state: string) => {
      if (state === 'active') {
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      stopPolling();
      subscription.remove();
    };
  }, []);

  const onDone = async () => {
    navigate(ScreenType.Main);
    dispatch(setBottomSheet(null));
  };

  const onSummarize = async () => {
    const measurement = stopLocationUpdatesNative();

    if (!measurement?.direction.length) {
      return handleInvalidRecord('No data recorded');
    }
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const body = {
      record: measurement.direction,
      deviceId: `${manufacturer}:${deviceId}`,
    };

    const invalidRecord = await dispatch(saveRecord(body));
    if (invalidRecord) {
      return handleInvalidRecord(
        invalidRecord.error || 'Unknown error occurred',
      );
    }

    navigate(ScreenType.Summary);
  };

  const handleInvalidRecord = (error: string) => {
    const errorMessage = new MessageBuilder(onDone)
      .setMessage('Tracker Failed:')
      .setContent(error)
      .setButtonTitle('close')
      .build();

    return setTimeout(() => {
      dispatch(setBottomSheet({type: 'message', content: errorMessage}));
    }, 600);
  };

  const onStop = async () => {
    const message = new MessageBuilder(onSummarize)
      .setMessage('End Drive')
      .setContent(
        'Are you sure you want to end the current drive? Your trip will stop being tracked, and all collected data will be saved. You can view the route and trip summary once the drive ends.',
      )
      .setButtonTitle('Summarize')
      .build();

    dispatch(setBottomSheet({type: 'message', content: message}));
  };

  return (
    <View style={styles.container}>
      <StatusBarElement
        barStyle={'dark-content'}
        backgroundColor={Colors.white}
      />

      {currentLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          followsUserLocation={true}
          showsUserLocation={true}
          showsMyLocationButton={false}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            // Delta values is the inital scoop view of the map (zoom)
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
          provider={PROVIDER_GOOGLE}></MapView>
      )}

      <View style={styles.descContainer}>
        <TextElement fontSize={'xl'} cStyle={{color: Colors.primary}}>
          Drive started!
        </TextElement>
        <TextElement cStyle={{marginVertical: '2%', textAlign: 'justify'}}>
          We're tracking after your location in real time. Just keep going and
          feel free to set the app to the background, we'll map your journey for
          you and give you some details about your trip.
        </TextElement>
      </View>
      <LottieView
        autoPlay
        loop
        source={require('../assets/animations/car_animation.json')}
        style={styles.lottie}
      />
      <ButtonElement
        title={'STOP'}
        titleColor={Colors.white}
        onPress={onStop}
        backgroundColor={Colors.primary}
        cStyle={styles.stopButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
  },
  map: {
    width: PropDimensions.fullWidth,
    height: Dimensions.get('window').height * 0.4,
    opacity: 0.4,
  },
  stopButton: {
    borderRadius: 150,
    width: PropDimensions.circleButton,
    height: PropDimensions.circleButton,
    elevation: 5,
    alignSelf: 'center',
    zIndex: 10,
  },
  lottie: {
    height: PropDimensions.fullHeight * 0.3,
    width: PropDimensions.fullWidth,
    position: 'absolute',
    bottom: -Dimensions.get('window').height * 0.05,
    zIndex: 5,
  },
});

export default DriveScreen;
