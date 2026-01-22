import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {PropDimensions} from '../services/dimensions';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {useMeasurement} from '../utils/useMeasurement';
import TextElement from '../components/Resuable/TextElement';
import ButtonElement from '../components/Resuable/ButtonElement';
import * as Colors from '../assets/colors/palette.json';
import {useAppDispatch} from '../redux/hooks/hooks';
import {setAppReady} from '../redux/slices/mainSlice';
import {navigate} from '../utils/rootNavigation';
import {setDelay} from '../utils/helpers';
import {MapIcon, SettingsIcon} from '../assets/svgs';
import BouncyButtonElement from '../components/Resuable/BouncyButtonElement';
import AnimatedCustomBackground from '../components/MainPartials/AnimatedCustomBackground';

const MainScreen = () => {
  const {currentLocation, startLocationUpdatesNative} = useMeasurement();

  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setAppReady());
  }, [dispatch]);

  const onStart = async () => {
    setIsLoading(true);
    await setDelay(500);
    startLocationUpdatesNative();
    setIsLoading(false);
    navigate('drive');
  };

  const onTrips = () => {
    navigate('trips');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.primary}
      />
      <AnimatedCustomBackground />

      <View>
        <View style={styles.barContainer}>
          <Pressable
            onPress={onTrips}
            style={({pressed}) => {
              return {
                opacity: pressed ? 0.7 : 1,
                padding: '2%',
                justifyContent: 'center',
              };
            }}>
            <MapIcon width={32} height={32} />
            <TextElement cStyle={{color: 'white'}}>MY TRIPS</TextElement>
          </Pressable>
          {/* <Pressable
            onPress={() => navigate('testing')}
            style={({pressed}) => {
              return {
                opacity: pressed ? 0.7 : 1,
                padding: '2%',
                justifyContent: 'center',
              };
            }}>
            <MapIcon width={32} height={32} />
            <TextElement cStyle={{color: 'white'}}>Testing</TextElement>
          </Pressable> */}
          <Pressable
            onPress={() => navigate('permissions')}
            style={({pressed}) => {
              return {
                opacity: pressed ? 0.7 : 1,
                padding: '2%',
                alignItems: 'center',
              };
            }}>
            <SettingsIcon width={30} height={30} />
            <TextElement cStyle={{color: 'white'}}>{''}</TextElement>
          </Pressable>
        </View>

        <TextElement cStyle={styles.currentLocationText}>
          Current Location:
        </TextElement>
        <View style={styles.mapContainer}>
          <View style={styles.map}>
            {currentLocation ? (
              <MapView
                ref={mapRef}
                style={{flex: 1}}
                initialRegion={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                  // Delta values is the inital scoop view of the map (zoom)
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
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
        </View>
      </View>

      <View style={styles.geofenceContainer}>
        <ButtonElement
          backgroundColor={Colors.white}
          onPress={() => navigate('geofence')}
          title={'Set Geofence'}
          titleColor={Colors.secondary}
          fontSize={'s'}
          fontWeight={'bold'}
          cStyle={styles.geofenceButton}
        />
        <TextElement fontSize={'m'} cStyle={{color: Colors.white}}>
          * Get notification by location *
        </TextElement>
      </View>

      <View style={styles.startContainer}>
        <BouncyButtonElement
          backgroundColor={Colors.secondary}
          onPress={onStart}
          fontWeight={'bold'}
          title={'START'}
          titleColor={Colors.white}
          isLoading={isLoading}
          cStyle={styles.startButton}
        />
        <TextElement cStyle={{opacity: 0.5}} fontWeight={'demi-bold'}>
          Ready to hit the road? Press the button to start tracking your drive
          in real-time. We’ll capture your journey, providing accurate routes
          and distance details along the way!
        </TextElement>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: '10%',
  },
  barContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: '4%',
    flexDirection: 'row',
  },
  mapContainer: {
    alignSelf: 'center',
    height: PropDimensions.sectionHeight,
    width: PropDimensions.standardWidth,
    padding: 4,
    elevation: 5,
    backgroundColor: '#eee',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  currentLocationText: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    marginBottom: '2%',
    color: Colors.white,
  },
  map: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    opacity: 0.4,
  },
  startContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    width: PropDimensions.standardWidth,
  },
  startButton: {
    width: PropDimensions.circleButton,
    height: PropDimensions.circleButton,
    borderRadius: 90,
    marginBottom: '6%',
  },
  spinner: {
    position: 'absolute',
    left: '46%',
    top: '42%',
  },
  geofenceContainer: {
    height: Dimensions.get('window').height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '18%',
  },
  geofenceButton: {
    borderRadius: 90,
    elevation: 8,
    width: PropDimensions.fullWidth * 0.4,
    marginBottom: '2%',
  },
});

export default MainScreen;
