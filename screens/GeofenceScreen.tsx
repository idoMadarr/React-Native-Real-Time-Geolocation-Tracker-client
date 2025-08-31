import React, {Fragment, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Platform,
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
import {useAppDispatch} from '../redux/hooks/hooks';
import {PropDimensions} from '../services/dimensions';
import Colors from '../assets/colors/palette.json';
import {
  point,
  polygon as turfPolygon,
  booleanPointInPolygon,
  helpers,
} from '@turf/turf';
// import {ChevronIcon} from '../../../assets/icons';
import {useMeasurement} from '../utils/useMeasurement';
import {goBack} from '../utils/rootNavigation';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import InputElement from '../components/Resuable/InputElement';

const {GeofenceModule} = NativeModules;

const API_KEY = '68ab6e746ed33153667840dzi17bde8';

const RNM_ISRAEL_POLYGON = [
  {latitude: 31.4159371, longitude: 34.179993},
  {latitude: 30.4084454, longitude: 34.5375127},
  {latitude: 29.9041673, longitude: 34.7543693},
  {latitude: 29.6652335, longitude: 34.8309731},
  {latitude: 29.5560904, longitude: 34.8704995},
  {latitude: 29.4897335, longitude: 34.9008123},
  {latitude: 29.5303614, longitude: 34.976656},
  {latitude: 29.7494841, longitude: 35.0553198},
  {latitude: 30.1612612, longitude: 35.1790407},
  {latitude: 30.5850251, longitude: 35.2395876},
  {latitude: 30.9816023, longitude: 35.4327442},
  {latitude: 31.1278228, longitude: 35.47723},
  {latitude: 31.2669829, longitude: 35.4392391},
  {latitude: 31.4344305, longitude: 35.4933125},
  {latitude: 31.8133675, longitude: 35.5729754},
  {latitude: 32.3970664, longitude: 35.6122953},
  {latitude: 32.6301682, longitude: 35.6360865},
  {latitude: 32.7561244, longitude: 35.8040464},
  {latitude: 32.9076045, longitude: 35.9012818},
  {latitude: 33.3422077, longitude: 35.8225912},
  {latitude: 33.3323905, longitude: 35.6965542},
  {latitude: 33.2865965, longitude: 35.548519},
  {latitude: 33.1016756, longitude: 35.4946791},
  {latitude: 33.1257635, longitude: 35.0811803},
  {latitude: 32.9486574, longitude: 35.0568742},
  {latitude: 32.843148, longitude: 35.0334062},
  {latitude: 32.8419536, longitude: 34.9555323},
  {latitude: 32.7207934, longitude: 34.8896384},
  {latitude: 32.0956637, longitude: 34.6813488},
  {latitude: 31.6891933, longitude: 34.502306},
  {latitude: 31.4159371, longitude: 34.179993},
];

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
    // setGeofence({ latitude: Number(latitude), longitude: Number(longitude) });
  };

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

  const ISRAEL_POLYGON_GEOJSON = turfPolygon([
    (() => {
      const ring = RNM_ISRAEL_POLYGON.map(p => [p.longitude, p.latitude]);
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
      return ring;
    })(),
  ]);

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
    // if (!selectedCity || !selectedStreet || !houseNumber) return;
    // try {
    //   const encodedAddress = encodeURIComponent(
    //     `${selectedStreet} ${houseNumber}, ${selectedCity}`
    //   );
    //   const res = await axios(
    //     `https://geocode.maps.co/search?q=${encodedAddress}&api_key=${API_KEY}`
    //   );
    //   if (res.data[0].lat) {
    //     setGeofence({
    //       latitude: Number(res.data[0].lat),
    //       longitude: Number(res.data[0].lon),
    //     });
    //   }
    //   // @ts-ignore: Number(geofence.lat)
    //   mapRef.current?.animateToRegion(
    //     {
    //       latitude: Number(res.data[0].lat),
    //       longitude: Number(res.data[0].lon),
    //       latitudeDelta: 0.01,
    //       longitudeDelta: 0.01,
    //     },
    //     2000
    //   );
    // } catch (error) {
    //   Alert.alert("Cant detect the address");
    //   console.log(JSON.stringify(error), "error from on detect");
    // }
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
      Alert.alert('something went worng', JSON.stringify(error));
    }

    Alert.alert(
      'success!',
      'You will received a local notification when you reash to the area',
    );
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
      <ButtonElement
        title={'Back'}
        onPress={goBack}
        backgroundColor={Colors.transparent}
        titleColor={Colors.dark}
        fontWeight={'bold'}
        cStyle={{
          alignSelf: 'flex-end',
        }}
      />
      <InputElement
        inputRef={inputRef}
        value={address}
        label={'Rotshild St 12, Tel Aviv'}
        onChangeText={() => setAddress(address)}
      />
      {currentLocation && (
        <Fragment>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsBuildings={true}
            showsUserLocation={true}
            followsUserLocation={true}
            onRegionChangeComplete={handleRegionChange}
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
              backgroundColor={'red'}
              titleColor={'white'}
              cStyle={styles.setNotificationButton}
              onPress={onSetAlert}
            />
            <ButtonElement
              title={'Clear'}
              onPress={async () => {
                await GeofenceModule.removeGeofence('geofence_id');
                setGeofence(null);
                Alert.alert('Done', 'remove geofence');
              }}
              cStyle={styles.removeNotificationButton}
              titleColor="black"
              backgroundColor={'lightgrey'}
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
    width: PropDimensions.fullWidth * 0.6,
    backgroundColor: Colors.secondary,
    borderWidth: 0,
  },
  removeNotificationButton: {
    width: PropDimensions.fullWidth * 0.24,
  },
});
