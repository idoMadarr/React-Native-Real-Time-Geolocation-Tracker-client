import React, {useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
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
import {BottomSheetTypes} from '../components/BottomSheet/BottomSheetTypes';

const DriveScreen = () => {
  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);

  const {currentLocation} = useMeasurement();

  const onStop = async () => {
    dispatch(setBottomSheet({type: BottomSheetTypes.ACTIONS}));
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

      <ButtonElement
        title={'STOP'}
        titleColor={Colors.white}
        onPress={onStop}
        backgroundColor={Colors.primary}
        cStyle={styles.stopButton}
      />

      <LottieView
        autoPlay
        loop
        source={require('../assets/animations/car_animation.json')}
        style={styles.lottie}
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
    height: Dimensions.get('window').height * 0.5,
    opacity: 0.4,
  },
  stopButton: {
    borderRadius: 150,
    width: PropDimensions.circleButton,
    height: PropDimensions.circleButton,
    elevation: 5,
    alignSelf: 'center',
  },
  lottie: {
    height: PropDimensions.fullHeight * 0.3,
    width: PropDimensions.fullWidth,
    position: 'absolute',
    bottom: -Dimensions.get('window').height * 0.1,
    opacity: 0.5,
  },
});

export default DriveScreen;
