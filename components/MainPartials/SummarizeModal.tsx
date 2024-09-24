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
import ViewShot from 'react-native-view-shot';
import {PropDimensions} from '../../services/dimensions';
import TextElement from '../Resuable/TextElement';
import {useAppDispatch} from '../../redux/hooks/hooks';
import {updateScreenShot} from '../../redux/actions/mainActions';
import {RecordType} from '../../redux/slices/mainSlice';

interface SummarizeModalPropsType {
  onDone(): void;
  buttonTitle: string;
  currentRecord: RecordType;
}

const SummarizeModal: React.FC<SummarizeModalPropsType> = ({
  onDone,
  buttonTitle,
  currentRecord,
}) => {
  const dispatch = useAppDispatch();

  const mapRef: any = useRef(MapView);
  const viewshotRef: any = useRef();

  const saveNDone = async () => {
    if (buttonTitle === 'Close') {
      return onDone();
    }

    viewshotRef.current.capture().then(async (file: string) => {
      await dispatch(updateScreenShot(currentRecord._id, file));
      onDone();
    });
  };

  const recordStartTime = new Date(currentRecord.startTime).toLocaleString(
    'en-US',
    {
      // year: 'numeric',
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
      // year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );

  return (
    <View style={styles.container}>
      <ViewShot ref={viewshotRef} style={styles.viewShotContainer}>
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
      </ViewShot>
      <View style={styles.details}>
        <View style={styles.section}>
          <TextElement>Total Distance:</TextElement>
          <TextElement fontWeight={'bold'}>{`${currentRecord.distance.toFixed(
            2,
          )} km`}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement>Average Speed:</TextElement>
          <TextElement
            fontWeight={'bold'}>{`${currentRecord.averageSpeed.toFixed(
            0,
          )} km/h`}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement>Start Time:</TextElement>
          <TextElement fontWeight={'bold'}>{recordStartTime}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement>End Time:</TextElement>
          <TextElement fontWeight={'bold'}>{recordEndTime}</TextElement>
        </View>
      </View>
      <ButtonElement
        title={buttonTitle}
        titleColor={Colors.white}
        backgroundColor={Colors.primary}
        onPress={saveNDone}
        cStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PropDimensions.fullHeight * 0.85,
    justifyContent: 'space-between',
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: '4%',
  },
  viewShotContainer: {
    width: PropDimensions.fullWidth * 0.9,
    height: PropDimensions.fullHeight * 0.6,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    paddingVertical: '4%',
    justifyContent: 'space-between',
  },
  section: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    alignSelf: 'center',
    width: PropDimensions.standardWidth,
  },
});

export default SummarizeModal;
