import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import TextElement from '../Resuable/TextElement';
import {LineChart} from 'react-native-gifted-charts';
import {useAppSelector} from '../../redux/hooks/hooks';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';

const StatisticBottomSheet = () => {
  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord!);

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

  let elapsed = 0;

  const lineData = currentRecord?.segments?.map((seg, index) => {
    elapsed += seg.time / 1000; // seconds

    // format as mm:ss
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    const label = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
      value: seg.speed, // Y-axis
      label: index % 2 === 0 ? label : '', // X-axis
      dataPointText: seg.speed.toFixed(1),
    };
  });

  // Calculate max value rounded up to nearest 10 for Y-axis
  const maxSpeed = Math.max(
    ...(currentRecord?.segments?.map(seg => seg.speed) || [0]),
  );
  const maxValue = Math.ceil(maxSpeed / 10) * 10;
  const noOfSections = maxValue / 10;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.datesContainer}>
        <View style={styles.dateSection}>
          <TextElement fontSize={'s'}>Start Time</TextElement>
          <TextElement fontWeight={'bold'}>{recordStartTime}</TextElement>
        </View>
        <View style={styles.seperator} />
        <View style={styles.dateSection}>
          <TextElement fontSize={'s'}>End Time:</TextElement>
          <TextElement fontWeight={'bold'}>{recordEndTime}</TextElement>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>Distance</TextElement>
          <TextElement fontWeight={'bold'}>{`${currentRecord.distance.toFixed(
            2,
          )} km`}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>A. Speed</TextElement>
          <TextElement
            fontWeight={'bold'}>{`${currentRecord.averageSpeed.toFixed(
            0,
          )} km/h`}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>Max Speed</TextElement>
          <TextElement>{currentRecord.maxSpeed}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>Min Speed</TextElement>
          <TextElement>{currentRecord.minSpeed}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>Time</TextElement>
          <TextElement>{currentRecord.durationFormatted}</TextElement>
        </View>
        <View style={styles.section}>
          <TextElement fontSize={'s'}>Stops</TextElement>
          <TextElement>{currentRecord.stops}</TextElement>
        </View>
      </View>

      <View style={styles.segmentContainer}>
        <TextElement cStyle={styles.textAlign} fontWeight={'bold'}>
          {'Segments'}
        </TextElement>
        <LineChart
          data={lineData}
          curved
          showVerticalLines
          spacing={40}
          isAnimated={true}
          thickness={3}
          yAxisLabelSuffix={'km/h'}
          maxValue={maxValue}
          noOfSections={noOfSections}
          color={Colors.secondary}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          width={PropDimensions.standardWidth}
          height={Dimensions.get('window').height * 0.2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: '8%',
  },
  datesContainer: {
    marginBottom: '4%',
  },
  dateSection: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
  },
  seperator: {
    height: 1,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: '2%',
  },
  details: {
    // flex: 1,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    // paddingVertical: '4%',
    // justifyContent: 'space-between',
  },
  section: {
    margin: '2%',
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // elevation: 2,
    // overflow: 'hidden',
    borderColor: '#ccc',
    backgroundColor: 'white',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // flexDirection: 'row',
  },
  segmentContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
  },
  yAxisTextStyle: {
    color: Colors.secondary,
    fontWeight: 'bold',
    width: 75,
  },
  xAxisLabelTextStyle: {
    fontWeight: 'bold',
  },
  textAlign: {
    textAlign: 'center',
  },
});

export default StatisticBottomSheet;
