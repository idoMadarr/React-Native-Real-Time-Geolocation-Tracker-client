import React from 'react';
import {Image, StyleSheet, View, Pressable} from 'react-native';
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
  pickupAddress,
  destinationAddress,
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
    <Pressable
      onPress={onRecord}
      style={({pressed}) => {
        return [styles.mainContainer, {opacity: pressed ? 0.7 : 1}];
      }}>
      <View style={styles.dateContainer}>
        <TextElement fontWeight={'bold'} fontSize={'s'} numberOfLines={2}>
          {`${recordStartTime}`}
        </TextElement>
      </View>
      <View style={styles.recordContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            resizeMode={imageResize}
            style={imageStyle}
          />
        </View>
        <View style={styles.textContainer}>
          <TextElement fontSize={'s'} numberOfLines={2}>
            {`From: ${pickupAddress}`}
          </TextElement>
          <TextElement fontSize={'s'} numberOfLines={2}>
            {`To: ${destinationAddress}`}
          </TextElement>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    elevation: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    height: PropDimensions.fullHeight * 0.18,
    width: PropDimensions.fullWidth * 0.85,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: '3%',
  },
  dateContainer: {
    marginBottom: '2%',
    opacity: 0.5,
  },
  recordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    height: PropDimensions.fullWidth * 0.24,
    width: PropDimensions.fullWidth * 0.24,
  },
  image: {
    height: '100%',
    width: '100%',
    opacity: 0.4,
    borderRadius: 12,
  },
  noGpsImage: {
    transform: [{scale: 0.5}],
    opacity: 0.08,
  },
  textContainer: {
    width: PropDimensions.fullWidth * 0.52,
    paddingLeft: '4%',
    opacity: 0.5,
  },
});

export default RecordItem;
