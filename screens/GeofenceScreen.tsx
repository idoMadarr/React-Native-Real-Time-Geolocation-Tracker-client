import React, {Fragment, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import MapView, {
  Marker,
  Circle,
  Polygon,
  MapPressEvent,
} from 'react-native-maps';
import ButtonElement from '../components/Resuable/ButtonElement';
import TextElement from '../components/Resuable/TextElement';
import {NativeModules} from 'react-native';
import {PropDimensions} from '../services/dimensions';
import Colors from '../assets/colors/palette.json';
import {point, booleanPointInPolygon} from '@turf/turf';
import {useMeasurement} from '../utils/useMeasurement';
import {goBack} from '../utils/rootNavigation';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import InputElement from '../components/Resuable/InputElement';
import Config from 'react-native-config';
import {ISRAEL_POLYGON_GEOJSON, RNM_ISRAEL_POLYGON} from '../utils/polygon';
import axios from 'axios';
import {useAppDispatch} from '../redux/hooks/hooks';
import {MessageBuilder} from '../models/MessageModel';
import {setBottomSheet} from '../redux/slices/mainSlice';
import {saveToStorage} from '../utils/asyncstorage';

const {GeofenceModule} = NativeModules;

const API_KEY = Config.geocode_maps_key;

const idoHome = {
  latitude: 31.9688586,
  longitude: 34.8021378,
};

const geofenceRadius = 150; // meters

const DestinationScreen = () => {
  const dispatch = useAppDispatch();
  const {currentLocation} = useMeasurement();

  const [address, setAddress] = useState<string>('');
  const [geofence, setGeofence] = useState<any>(null);

  const inputRef = useRef(null);
  const mapRef = useRef(null);

  // const mapNavigate = async (id: string, address: any) => {
  //   // @ts-ignore:
  //   mapRef.current?.animateToRegion(
  //     {
  //       latitude: address.latitude,
  //       longitude: address.longitude,
  //       latitudeDelta: 0.01,
  //       longitudeDelta: 0.01,
  //     },
  //     2000
  //   );

  //   GeofenceModule.addGeofence(id, address.latitude, address.longitude, 150);
  // };

  const isSnappingRef = useRef(false);
  const lastValidRegionRef = useRef({
    latitude: 31.7683,
    longitude: 35.2137,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const handleRegionChange = (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    if (isSnappingRef.current) return; // ignore the event triggered by our own animation

    const center = point([region.longitude, region.latitude]);
    const inside = booleanPointInPolygon(center, ISRAEL_POLYGON_GEOJSON);

    if (!inside) {
      isSnappingRef.current = true;
      // Snap back to the last valid region (smoother than jumping to a fixed location)
      // @ts-ignore:
      mapRef.current?.animateToRegion(lastValidRegionRef.current, 300);
      // allow events again after the animation
      setTimeout(() => {
        isSnappingRef.current = false;
      }, 350);
      return;
    }

    // Update last valid region only when inside
    lastValidRegionRef.current = region;
  };

  const onDetect = async () => {
    if (!address) return;

    Keyboard.dismiss();

    try {
      const encodedAddress = encodeURIComponent(address);
      const res = await axios(
        `https://geocode.maps.co/search?q=${encodedAddress}&api_key=${API_KEY}`,
      );
      if (res.data[0].lat) {
        setGeofence({
          latitude: Number(res.data[0].lat),
          longitude: Number(res.data[0].lon),
        });
        // @ts-ignore:
        mapRef.current?.animateToRegion(
          {
            latitude: Number(res.data[0].lat),
            longitude: Number(res.data[0].lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          2000,
        );
      }
    } catch (error) {
      const errorMessage = new MessageBuilder()
        .setMessage(`Falied to fetch address`)
        .setContent("Can't detect any address, please try again")
        .setButtonTitle('Ok')
        .build();

      dispatch(setBottomSheet({type: 'message', content: errorMessage}));
    }
  };

  const onSetAlert = async () => {
    if (!geofence) return;

    try {
      if (Platform.OS === 'android') {
        await GeofenceModule.addGeofence(
          'geofence_id',
          Number(geofence.latitude),
          Number(geofence.longitude),
          geofenceRadius,
        );
      } else {
        // Implement ios module ...
      }
    } catch (error) {
      const failedMessage = new MessageBuilder()
        .setMessage(`Something went wrong:`)
        .setContent("Can't set geofence, please try again")
        .setButtonTitle('Ok')
        .build();

      dispatch(setBottomSheet({type: 'message', content: failedMessage}));
    }

    const successMessage = new MessageBuilder()
      .setMessage(`Geofence Set`)
      .setContent("You'll receive a local notification when you reach the area")
      .setButtonTitle('Got it')
      .build();

    dispatch(setBottomSheet({type: 'message', content: successMessage}));
  };

  const onClear = async () => {
    await GeofenceModule.removeGeofence('geofence_id');
    setGeofence(null);

    const clearMessage = new MessageBuilder()
      .setMessage(`Geofence Cleared`)
      .setContent("You won't receive any notifications")
      .setButtonTitle('Ok')
      .build();

    dispatch(setBottomSheet({type: 'message', content: clearMessage}));
  };

  const onIOSTag = () => {
    // @ts-ignore: Change to user location
    mapRef.current?.animateToRegion({
      latitude: idoHome.latitude,
      longitude: idoHome.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const tapOnMap = (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setGeofence({latitude: latitude, longitude: longitude});
  };

  const iosTAG = (
    <TouchableOpacity onPress={onIOSTag} style={styles.iosTag}>
      <TextElement>📍</TextElement>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'dark-content'}
        backgroundColor={Colors.white}
      />
      <View style={styles.searchContainer}>
        <InputElement
          inputRef={inputRef}
          value={address}
          label={'Address'}
          onChangeText={text => setAddress(text)}
        />
        <ButtonElement
          title={'Detect'}
          onPress={onDetect}
          backgroundColor={
            address.length ? Colors.secondary : Colors.placeholder
          }
          titleColor={Colors.white}
          cStyle={{
            width: PropDimensions.standardWidth,
            marginTop: '2%',
          }}
        />
      </View>
      {currentLocation && (
        <Fragment>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsBuildings={true}
            showsUserLocation={true}
            followsUserLocation={true}
            // Add onRegionChangeComplete to restrict user to specific area
            // onRegionChangeComplete={handleRegionChange}
            onPress={tapOnMap}
            initialRegion={{
              longitude: currentLocation.coords.longitude,
              latitude: currentLocation.coords.latitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Polygon
              coordinates={RNM_ISRAEL_POLYGON}
              strokeColor="rgba(0,0,255,0.8)"
              fillColor="rgba(0,0,255,0.1)"
              strokeWidth={2}
            />

            {Platform.OS === 'ios' && iosTAG}
            {geofence && (
              <View>
                <Marker
                  coordinate={{
                    latitude: Number(geofence.latitude),
                    longitude: Number(geofence.longitude),
                  }}
                  title={'יעד'}
                />
                <Circle
                  center={{
                    latitude: Number(geofence.latitude),
                    longitude: Number(geofence.longitude),
                  }}
                  radius={geofenceRadius}
                  strokeWidth={2}
                  strokeColor="rgba(0, 150, 255, 0.8)"
                  fillColor="rgba(0, 150, 255, 0.2)"
                />
              </View>
            )}
          </MapView>
          <View style={styles.buttonsContainer}>
            <ButtonElement
              title={'Set Alert'}
              backgroundColor={Colors.secondary}
              titleColor={'white'}
              cStyle={styles.setNotificationButton}
              enable={geofence ? true : false}
              onPress={onSetAlert}
            />
            <ButtonElement
              title={'Clear'}
              onPress={onClear}
              cStyle={styles.removeNotificationButton}
              titleColor={Colors.white}
              backgroundColor={Colors.placeholder}
            />
            <ButtonElement
              title={'Back'}
              onPress={goBack}
              backgroundColor={Colors.white}
              titleColor={Colors.dark}
              cStyle={styles.backButton}
            />
          </View>
        </Fragment>
      )}
    </SafeAreaView>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  searchContainer: {
    position: 'absolute',
    top: '8%',
    width: PropDimensions.fullWidth,
    alignItems: 'center',
    zIndex: 100,
  },
  map: {
    flex: 1,
    width: PropDimensions.fullWidth,
  },
  iosTag: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    opacity: 0.6,
    elevation: 4,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: '4%',
    width: PropDimensions.standardWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  setNotificationButton: {
    width: PropDimensions.fullWidth * 0.4,
    borderWidth: 0,
  },
  removeNotificationButton: {
    width: PropDimensions.fullWidth * 0.2,
  },
  backButton: {
    width: PropDimensions.fullWidth * 0.2,
  },
});
