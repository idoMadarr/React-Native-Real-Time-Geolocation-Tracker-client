import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import RecordItem from '../components/MainPartials/RecordItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigate} from '../utils/rootNavigation';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import Colors from '../assets/colors/palette.json';
import {RecordType, setCurrentRecord} from '../redux/slices/mainSlice';
import {PropDimensions} from '../services/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import EmptyTrips from '../components/TripsPartials/EmptyTrips';
// import {recordMockList} from '../fixtures/trip-mock.json';

const CustomBackground = () => {
  const colors = [
    Colors.secondary,
    Colors.secondary,
    Colors.secondary,
    Colors.secondary,
    Colors.white,
    Colors.white,
  ];

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.customBackground]}>
      <View style={styles.inner}>
        <LinearGradient
          colors={colors}
          style={{
            width: PropDimensions.circleButton,
            height: PropDimensions.circleButton,
          }}
        />
      </View>
    </View>
  );
};

const TripsScreen = () => {
  const dispatch = useAppDispatch();

  const recordList = useAppSelector(state => state.mainSlice.recordList);

  const onRecord = (item: RecordType) => {
    dispatch(setCurrentRecord(item));
    navigate('summary');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        backgroundColor={Colors.white}
        barStyle={'dark-content'}
      />
      <CustomBackground />
      <FlatList
        data={recordList}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{
          height: Dimensions.get('window').height * 0.1,
        }}
        // data={recordMockList}
        keyExtractor={(_i, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        style={styles.flatlist}
        renderItem={({item}) => (
          <RecordItem {...item} onRecord={onRecord.bind(this, item)} />
        )}
        ListEmptyComponent={<EmptyTrips />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatlist: {
    paddingTop: '5%',
  },
  customBackground: {
    backgroundColor: Colors.white,
  },
  inner: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    borderRadius: 80,
    overflow: 'hidden',
    opacity: 0.2,
    transform: [{scale: 8.8}],
  },
  seperator: {
    height: 1,
    width: PropDimensions.fullWidth * 0.5,
    backgroundColor: Colors.placeholder,
    marginVertical: '4%',
    alignSelf: 'center',
    opacity: 0.2,
  },
});

export default TripsScreen;
