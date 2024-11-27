import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextElement from '../Resuable/TextElement';
import LottieView from 'lottie-react-native';
import ButtonElement from '../Resuable/ButtonElement';
import Colors from '../../assets/colors/palette.json';
import {PropDimensions} from '../../services/dimensions';

interface DriveModePropsType {
  onStop(): void;
}

const DriveMode: React.FC<DriveModePropsType> = ({onStop}) => {
  return (
    <View style={styles.container}>
      <View style={styles.descContainer}>
        <TextElement
          fontSize={'xl'}
          fontWeight={'bold'}
          cStyle={{color: Colors.primary}}>
          Drive started!
        </TextElement>
        <TextElement cStyle={{marginVertical: '8%', textAlign: 'justify'}}>
          We're tracking after your location in real time. Just keep going and
          feel free to set the app to the background, we'll map your journey for
          you and give you some details about your trip.
        </TextElement>
      </View>
      <LottieView
        autoPlay
        loop
        source={require('../../assets/animations/car_animation.json')}
        style={styles.lottie}
      />
      <ButtonElement
        title={'STOP'}
        titleColor={Colors.white}
        onPress={onStop}
        fontWeight={'bold'}
        backgroundColor={Colors.primary}
        cStyle={{
          width: PropDimensions.circleButton,
          height: PropDimensions.circleButton,
          borderRadius: 90,
          elevation: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    alignItems: 'center',
  },
  lottie: {
    height: PropDimensions.fullHeight * 0.3,
    width: PropDimensions.fullWidth,
  },
});

export default DriveMode;
