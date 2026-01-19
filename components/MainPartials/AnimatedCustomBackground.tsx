import {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import * as Colors from '../../assets/colors/palette.json';
import LinearGradient from 'react-native-linear-gradient';
import {PropDimensions} from '../../services/dimensions';

const AnimatedCustomBackground = () => {
  const scale = useRef(new Animated.Value(7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 6.6,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 7,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const colors = [
    Colors.primary,
    Colors.primary,
    Colors.primary,
    Colors.primary,
    Colors.secondary,
  ];

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.customBackground]}>
      <Animated.View style={[styles.inner, {transform: [{scale}]}]}>
        <LinearGradient
          colors={colors}
          style={{
            width: PropDimensions.circleButton,
            height: PropDimensions.circleButton,
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  customBackground: {
    backgroundColor: Colors.white,
  },
  inner: {
    alignSelf: 'center',
    borderRadius: 150,
    overflow: 'hidden',
  },
});

export default AnimatedCustomBackground;
