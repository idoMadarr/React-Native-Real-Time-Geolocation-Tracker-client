import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {RecordType} from '../../redux/slices/mainSlice';
import TextElement from '../Resuable/TextElement';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';

interface RecordItemPropsType extends RecordType {
  onRecord(): void;
}

const noGpsImage = require('../../assets/images/no_gps.png');

const RecordItem: React.FC<RecordItemPropsType> = ({
  startTime,
  image,
  onRecord,
}) => {
  const recordStartTime = new Date(startTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const imageSource = image ? {uri: image} : noGpsImage;
  const imageStyle = image ? styles.image : [styles.image, styles.noGpsImage];
  const imageResize = image ? 'cover' : 'contain';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onRecord}
      style={styles.recordContainer}>
      <View style={styles.textContainer}>
        <TextElement fontSize={'lg'} cStyle={{color: Colors.dark}}>
          {recordStartTime}
        </TextElement>
      </View>
      <Image source={imageSource} resizeMode={imageResize} style={imageStyle} />
    </TouchableOpacity>
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
    overflow: 'hidden',
    marginRight: PropDimensions.fullWidth * 0.06,
  },
  image: {
    height: '90%',
    width: '90%',
    opacity: 0.4,
    borderRadius: 12,
  },
  noGpsImage: {
    transform: [{scale: 0.5}],
    opacity: 0.08,
  },
  textContainer: {
    zIndex: 10,
    position: 'absolute',
  },
});

export default RecordItem;
