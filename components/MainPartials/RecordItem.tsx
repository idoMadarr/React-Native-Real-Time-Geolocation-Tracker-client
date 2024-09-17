import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RecordType} from '../../redux/slices/mainSlice';
import TextElement from '../Resuable/TextElement';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';

const RecordItem: React.FC<RecordType> = ({startTime}) => {
  return (
    <View style={styles.recordContainer}>
      <TextElement>{startTime.toString()}</TextElement>
    </View>
  );
};

const styles = StyleSheet.create({
  recordContainer: {
    elevation: 3,
    borderRadius: 16,
    backgroundColor: Colors.white,
    height: PropDimensions.fullHeight * 0.2,
    width: PropDimensions.fullWidth * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordItem;
