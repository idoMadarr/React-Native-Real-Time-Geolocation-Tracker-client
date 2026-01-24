import {Dimensions, StyleSheet, View} from 'react-native';
import React, {Fragment} from 'react';
import TextElement from '../Resuable/TextElement';
import {LineChart} from 'react-native-gifted-charts';
import {useAppSelector} from '../../redux/hooks/hooks';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';
import {
  DestinationIcon,
  SpeedIcon,
  StopIcon,
  TimeIcon,
  TurnsIcon,
} from '../../assets/svgs';
import {samplePoints} from '../../utils/helpers';

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

  const chartData = samplePoints(lineData ?? [], 200);

  // Calculate max value rounded up to nearest 10 for Y-axis
  const maxSpeed = Math.max(
    ...(currentRecord?.segments?.map(seg => seg.speed) || [0]),
  );
  const maxValue = Math.ceil(maxSpeed / 10) * 10;
  const noOfSections = maxValue / 10;

  const chartWidth = Dimensions.get('window').width * 0.75;
  const spacing = chartWidth / (lineData?.length || 10);

  return (
    <Fragment>
      <View style={styles.datesContainer}>
        <View style={styles.dateSection}>
          <TextElement fontWeight="bold" fontSize={'s'}>
            Start Time
          </TextElement>
          <TextElement>{recordStartTime}</TextElement>
        </View>
        <View style={styles.dateSection}>
          <TextElement fontWeight="bold" fontSize={'s'}>
            End Time:
          </TextElement>
          <TextElement>{recordEndTime}</TextElement>
        </View>
      </View>
      <View style={styles.seperator} />
      <View style={styles.details}>
        <View style={styles.section}>
          <DestinationIcon style={styles.icon} width={28} height={28} />
          <TextElement fontWeight={'bold'}>{`(km)`}</TextElement>
          <TextElement fontSize={'s'}>{`${currentRecord.distance.toFixed(
            2,
          )}`}</TextElement>
        </View>
        <View style={styles.section}>
          <TimeIcon style={styles.icon} width={28} height={28} />
          <TextElement fontSize={'s'} fontWeight={'bold'}>
            {currentRecord.durationFormatted}
          </TextElement>
        </View>
        <View style={styles.section}>
          <StopIcon style={styles.icon} width={28} height={28} />
          <TextElement fontWeight={'bold'}>{`(Stops)`}</TextElement>
          <TextElement fontSize={'s'}>{`${currentRecord.stops} `}</TextElement>
        </View>
        <View style={styles.section}>
          <SpeedIcon
            fill={Colors.speed}
            style={styles.icon}
            width={28}
            height={28}
          />
          <TextElement
            fontWeight={'bold'}
            fontSize={'s'}>{`(km/h)`}</TextElement>
          <TextElement fontSize={'s'}>{`A. ${currentRecord.averageSpeed.toFixed(
            2,
          )}`}</TextElement>
          <TextElement fontSize={'s'}>{`Max ${currentRecord.maxSpeed?.toFixed(
            2,
          )}`}</TextElement>
          <TextElement fontSize={'s'}>{`Min ${currentRecord.minSpeed?.toFixed(
            2,
          )}`}</TextElement>
        </View>
        <View style={styles.section}>
          <TurnsIcon style={styles.icon} width={28} height={28} />
          <TextElement fontWeight={'bold'}>{`Turns`}</TextElement>
          <TextElement
            fontSize={'s'}>{`Sharp ${currentRecord.sharpTurns} `}</TextElement>
          <TextElement
            fontSize={'s'}>{`Uturns ${currentRecord.uTurns} `}</TextElement>
        </View>
      </View>

      <View style={styles.segmentContainer}>
        <LineChart
          data={chartData}
          curved
          showVerticalLines={false}
          spacing={spacing}
          isAnimated={false}
          thickness={2}
          // yAxisLabelSuffix={'km/h'}
          disableScroll={true}
          maxValue={maxValue}
          noOfSections={noOfSections}
          color={Colors.secondary}
          hideDataPoints={true}
          yAxisTextStyle={styles.yAxisTextStyle}
          xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
          width={PropDimensions.standardWidth}
          height={Dimensions.get('window').height * 0.3}
        />
        <TextElement cStyle={styles.unit} fontSize={'s'}>
          {'* Unit: km/h'}
        </TextElement>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  datesContainer: {
    marginBottom: '4%',
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    marginTop: '2%',
  },
  seperator: {
    height: 1,
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    backgroundColor: '#b9b9b9',
    marginVertical: '2%',
  },
  details: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: '3%',
  },
  section: {
    margin: 1,
    width: Dimensions.get('window').width * 0.22,
    alignItems: 'center',
  },
  segmentContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    overflow: 'hidden',
    marginRight: '5%',
  },
  yAxisTextStyle: {
    color: Colors.secondary,
  },
  xAxisLabelTextStyle: {
    display: 'none',
  },
  textAlign: {
    textAlign: 'center',
  },
  unit: {
    color: Colors.placeholder,
  },
  icon: {
    marginBottom: '2%',
    opacity: 0.8,
  },
});

export default StatisticBottomSheet;
