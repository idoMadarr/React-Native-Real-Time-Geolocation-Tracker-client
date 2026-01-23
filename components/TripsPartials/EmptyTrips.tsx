import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import TextElement from '../Resuable/TextElement';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';

const EmptyTrips = () => {
  return (
    <View style={styles.mainContainer}>
      <TextElement cStyle={styles.title} fontSize={'xl'} fontWeight={'bold'}>
        {'No trips \nrecorded'}
      </TextElement>
      <TextElement cStyle={styles.description}>
        Your driving history will appear here once you start a trip, Hit the
        road and we’ll take care of the rest.
      </TextElement>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: Dimensions.get('window').height * 0.3,
    justifyContent: 'center',
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
  },
  title: {
    color: Colors.dark,
  },
  description: {
    opacity: 0.6,
  },
});

export default EmptyTrips;
