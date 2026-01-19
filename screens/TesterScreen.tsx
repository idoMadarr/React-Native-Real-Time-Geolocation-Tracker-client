import React, {useContext, useEffect, useRef} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {useMeasurement} from '../utils/useMeasurement';
import ButtonElement from '../components/Resuable/ButtonElement';
import {MeasurementContext} from '../context/MeasurementContext';
import MapView, {LatLng, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {PropDimensions} from '../services/dimensions';
import TextElement from '../components/Resuable/TextElement';

const {ForegroundServiceModule} = NativeModules;

const TesterScreen = () => {
  const {startLocationUpdatesNative, stopLocationUpdatesNative} =
    useMeasurement();

  const {directionRef} = useContext(MeasurementContext);

  const mapRef = useRef(null);
  const [points, setPoints] = React.useState([]);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(ForegroundServiceModule);
    const subscription = eventEmitter.addListener(
      'onLocationUpdate',
      location => {
        // console.log(location);
        directionRef.current.push(location);
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints([...directionRef.current]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const onCheck = () => {
    Alert.alert('Direction Data', JSON.stringify(directionRef.current));
    console.log(directionRef.current, 'checked');
  };

  return (
    <ScrollView style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={{width: PropDimensions.fullWidth, height: 350}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        {points?.direction?.length && (
          <Polyline
            coordinates={points?.direction.map((item: LatLng) => item)}
            strokeWidth={3}
            strokeColor={'blue'}
          />
        )}
      </MapView>

      <ButtonElement
        title={'Start JS Measurement'}
        titleColor={'white'}
        backgroundColor={'blue'}
        onPress={startLocationUpdatesNative}
        cStyle={styles.button}
      />
      <ButtonElement
        title={'Check Coords'}
        titleColor={'white'}
        backgroundColor={'blue'}
        onPress={onCheck}
        cStyle={styles.button}
      />
      {/* <ButtonElement
        title="Watch Mode"
        titleColor="white"
        backgroundColor="blue"
        onPress={watchGPSApproch}
        cStyle={styles.button}
      /> */}
      <ButtonElement
        title={'Stop JS Measurement'}
        titleColor={'white'}
        backgroundColor={'blue'}
        cStyle={styles.button}
        onPress={async () => {
          const res = stopLocationUpdatesNative();
          Alert.alert('Measurement Stopped', JSON.stringify(res));
          setPoints(res?.direction || []);
        }}
      />
      <ButtonElement
        title={'start Service'}
        titleColor={'white'}
        backgroundColor={'blue'}
        cStyle={styles.button}
        onPress={async () => {
          ForegroundServiceModule.initForegroundService();
        }}
      />

      {points.map((point, index) => (
        <TextElement fontSize={'s'} key={index}>
          Lat: {point.coords.latitude}, Lon: {point.coords.longitude}
        </TextElement>
      ))}
    </ScrollView>
  );
};

export default TesterScreen;

const styles = StyleSheet.create({
  button: {
    width: PropDimensions.fullWidth * 0.85,
  },
});
