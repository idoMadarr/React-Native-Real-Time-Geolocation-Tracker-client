import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Colors from '../assets/colors/palette.json';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {PropDimensions} from '../services/dimensions';
import TextElement from '../components/Resuable/TextElement';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {setBottomSheet} from '../redux/slices/mainSlice';

const SummaryScreen = () => {
  const dispatch = useAppDispatch();

  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord!);

  const mapRef: any = useRef(MapView);

  useEffect(() => {
    if (mapRef.current && currentRecord.waypoints.length > 0) {
      mapRef.current.fitToCoordinates(currentRecord.waypoints, {
        edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
        animated: true,
      });
    }
  }, [currentRecord]);

  useEffect(() => {
    dispatch(setBottomSheet({type: 'summary', content: null}));
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarElement
        backgroundColor={Colors.white}
        barStyle={'dark-content'}
        translucent
      />
      <View style={styles.mapContainer}>
        <View style={styles.destinationContainer}>
          <View style={styles.destinationSection}>
            <TextElement fontSize={'s'}>Start point:</TextElement>
            <TextElement numberOfLines={1} fontSize={'s'} fontWeight={'bold'}>
              {currentRecord.pickupAddress}
            </TextElement>
          </View>
          <View style={styles.seperator} />
          <View style={styles.destinationSection}>
            <TextElement fontSize={'s'}>Destination:</TextElement>
            <TextElement numberOfLines={1} fontSize={'s'} fontWeight={'bold'}>
              {currentRecord.destinationAddress}
            </TextElement>
          </View>
        </View>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentRecord.waypoints[0].latitude,
            longitude: currentRecord.waypoints[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}>
          <Marker coordinate={currentRecord.waypoints[0]} />
          <Marker
            coordinate={
              currentRecord.waypoints[currentRecord.waypoints.length - 1]
            }
            pinColor={Colors.secondary}
          />
          <Polyline
            coordinates={currentRecord.waypoints.map((item: LatLng) => item)}
            strokeWidth={3}
            strokeColor={Colors.primary}
          />
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  headerContainer: {
    height: 60,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    marginBottom: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  mapContainer: {
    // flex: 1,
    width: PropDimensions.fullWidth /*  * 0.85 */,
    height: PropDimensions.fullHeight /* * 0.45 */,
    // backgroundColor: 'green',
    alignSelf: 'center',
    // borderRadius: 16,
    // overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  destinationContainer: {
    width: PropDimensions.standardWidth,
    height: Dimensions.get('window').height * 0.14,
    position: 'absolute',
    top: '2%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    zIndex: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  seperator: {
    height: 1,
    width: Dimensions.get('window').width * 0.7,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  destinationSection: {
    width: Dimensions.get('window').width * 0.7,
    height: '35%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default SummaryScreen;
