import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonElement from '../Resuable/ButtonElement';
import Colors from '../../assets/colors/palette.json';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {PropDimensions} from '../../services/dimensions';
import TextElement from '../Resuable/TextElement';
import {useAppSelector} from '../../redux/hooks/hooks';

interface SummarizeModalPropsType {
  onDone(): void;
}

const SummarizeModal: React.FC<SummarizeModalPropsType> = ({onDone}) => {
  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord);

  const mapRef: any = useRef(MapView);

  if (!currentRecord) return;
  const recordStartTime = new Date(currentRecord.startTime).toLocaleString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );

  const recordEndTime = new Date(currentRecord.endTime).toLocaleString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={{width: '100%', height: '100%'}}
          initialRegion={{
            latitude: currentRecord.waypoints[0].latitude,
            longitude: currentRecord.waypoints[0].longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={true}>
          <Marker coordinate={currentRecord.waypoints[0]} />
          <Marker
            coordinate={
              currentRecord.waypoints[currentRecord.waypoints.length - 1]
            }
          />
          <Polyline
            coordinates={currentRecord.waypoints.map((item: LatLng) => item)}
            strokeWidth={4}
            strokeColor={'#000dff'}
          />
        </MapView>
      </View>
      <View style={styles.details}>
        <TextElement>{`Total Distance: ${currentRecord.distance} km`}</TextElement>
        <TextElement>{`Average Speed: ${currentRecord.averageSpeed} km/h`}</TextElement>
        <TextElement>{`Start Time: ${recordStartTime}`}</TextElement>
        <TextElement>{`End Time: ${recordEndTime}`}</TextElement>
      </View>
      <ButtonElement
        title={'Save & Done'}
        titleColor={Colors.white}
        backgroundColor={Colors.primary}
        onPress={onDone}
        cStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PropDimensions.fullHeight * 0.74,
    justifyContent: 'space-between',
    borderRadius: 16,
    overflow: 'hidden',
  },
  details: {
    flex: 1,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    paddingVertical: '4%',
    justifyContent: 'space-between',
  },
  section: {
    height: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  map: {
    width: PropDimensions.fullWidth,
    height: PropDimensions.fullHeight * 0.5,
  },
  button: {
    alignSelf: 'center',
    width: PropDimensions.standardWidth,
  },
});

export default SummarizeModal;
