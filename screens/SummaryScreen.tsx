import React, {useCallback, useRef, useState} from 'react';
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
import {useAppSelector} from '../redux/hooks/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import StatisticBottomSheet from '../components/SummaryPartials/StatisticBottomSheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {FlagIcon, TripIcon} from '../assets/svgs';

const SummaryScreen = () => {
  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord!);

  const [currentPhase, setCurrentPhase] = useState(1);

  const mapRef: any = useRef(MapView);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const destinationTranslateX = useSharedValue(0);

  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentPhase(index);
      updateLayout();
    },
    [currentPhase],
  );

  const updateLayout = () => {
    if (mapRef.current && currentRecord.waypoints.length > 0) {
      destinationTranslateX.value = currentPhase === 0 ? -200 : 0;
      const paddingAValue = Dimensions.get('window').width * 0.2;
      const paddingBValue = Dimensions.get('window').width * 0.3;

      const positionA = {
        top: paddingAValue,
        right: paddingAValue,
        bottom: paddingAValue * 2,
        left: paddingAValue,
      };
      const positionB = {
        top: paddingBValue,
        right: paddingBValue,
        bottom: paddingBValue * 5,
        left: paddingBValue,
      };

      mapRef.current.fitToCoordinates(currentRecord.waypoints, {
        edgePadding: currentPhase ? positionA : positionB,
        animated: true,
      });
    }
  };

  const destinationContainerAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withTiming(destinationTranslateX.value)}],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBarElement
        backgroundColor={Colors.white}
        barStyle={'dark-content'}
        translucent
      />
      <View style={styles.mapContainer}>
        <Animated.View
          style={[styles.destinationContainer, destinationContainerAnimation]}>
          <View style={styles.destinationSection}>
            <FlagIcon width={28} height={28} />
            <View style={styles.destinationTextContainer}>
              <TextElement
                fontWeight={'bold'}
                cStyle={{color: Colors.primary}}
                fontSize={'s'}>
                Start point:
              </TextElement>
              <TextElement numberOfLines={1} fontSize={'s'}>
                {currentRecord.pickupAddress}
              </TextElement>
            </View>
          </View>
          <View style={styles.destinationSection}>
            <TripIcon width={28} height={28} />
            <View style={styles.destinationTextContainer}>
              <TextElement
                fontWeight={'bold'}
                cStyle={{color: Colors.tertiary}}
                fontSize={'s'}>
                Destination:
              </TextElement>
              <TextElement numberOfLines={1} fontSize={'s'}>
                {currentRecord.destinationAddress}
              </TextElement>
            </View>
          </View>
        </Animated.View>
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
          showsMyLocationButton={false}
          onMapReady={updateLayout}>
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
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['25%', '65%']}
        index={0}
        enableDynamicSizing={false}
        animationConfigs={{duration: 450}}
        handleStyle={{backgroundColor: Colors.white}}
        handleIndicatorStyle={{backgroundColor: Colors.dark}}>
        <BottomSheetScrollView>
          <StatisticBottomSheet />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  mapContainer: {
    width: PropDimensions.fullWidth,
    height: PropDimensions.fullHeight,
    alignSelf: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  destinationContainer: {
    width: PropDimensions.standardWidth,
    height: Dimensions.get('window').height * 0.14,
    position: 'absolute',
    top: '4%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    zIndex: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  destinationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.7,
    height: '35%',
  },
  destinationTextContainer: {
    marginLeft: '6%',
  },
});

export default SummaryScreen;
