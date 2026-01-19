import React, {JSX, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import TextElement from './TextElement';
import Colors from '../../assets/colors/palette.json';

interface BouncyButtonElementType {
  title: string;
  onPress(): void;
  backgroundColor: string;
  titleColor: string;
  fontWeight?: string;
  fontSize?: string;
  enable?: boolean;
  isLoading?: boolean;
  cStyle?: {};
  children?: JSX.Element;
  iconPosition?: number | any;
}

const BouncyButtonElement: React.FC<BouncyButtonElementType> = ({
  title,
  onPress,
  backgroundColor,
  titleColor,
  fontWeight,
  fontSize,
  enable = true,
  isLoading = false,
  children,
  cStyle,
  iconPosition,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!enable || isLoading) {
      scaleAnim.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [enable, isLoading]);

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => {
        return {
          opacity: pressed && enable ? 0.7 : 1,
        };
      }}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {backgroundColor: enable ? backgroundColor : '#eee'},
          {...cStyle, transform: [{scale: scaleAnim}]},
        ]}>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={Colors.white} />
        ) : (
          <TextElement
            fontSize={fontSize || 'lg'}
            fontWeight={fontWeight || 'demi-bold'}
            cStyle={{
              color: enable ? titleColor : '#000000',
              textAlign: 'center',
            }}>
            {title}
          </TextElement>
        )}
        {children && (
          <View
            style={[
              styles.iconContainer,
              {
                right: iconPosition || '8%',
              },
            ]}>
            {children}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: PropDimensions.buttonWidth,
    height: PropDimensions.buttonHight,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
  },
});

export default BouncyButtonElement;
