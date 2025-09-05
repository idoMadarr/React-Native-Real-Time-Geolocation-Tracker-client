import React, {RefObject} from 'react';
import {View, TextInput, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import EStyleSheet from 'react-native-extended-stylesheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PropDimensions} from '../../services/dimensions';
import Colors from '../../assets/colors/palette.json';

// Components
import TextElement from './TextElement';

interface InputElementType {
  inputRef: RefObject<TextInput>;
  value: string;
  label: string;
  onChangeText(type: string): void;
  onBlur?(): void;
  keyboardType?: 'numeric' | 'number-pad' | 'default';
  maxLength?: number;
  error?: string;
  cStyle?: {};
  testID?: string;
}

const InputElement: React.FC<InputElementType> = ({
  value,
  label,
  onChangeText,
  onBlur,
  keyboardType,
  maxLength,
  error,
  inputRef,
  cStyle,
}) => {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withTiming(offset.value * 5)}],
    };
  });

  const focusAnimation = () => {
    offset.value = -6;
  };

  const blurAnimation = () => {
    if (value?.length) return;
    if (onBlur) onBlur();
    offset.value = 0;
  };

  const onPlaceHolder = () => {
    focusAnimation();
    inputRef?.current?.focus();
  };

  const displayPlaceholder = (
    <Animated.View style={[animatedStyle, styles.holderContainer]}>
      <TouchableOpacity onPress={onPlaceHolder} activeOpacity={0.9}>
        <TextElement
          cStyle={{
            zIndex: 1500,
            color: error ? Colors.warning : Colors.dark,
          }}>
          {label}
        </TextElement>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.inputElementConainer]}>
      {displayPlaceholder}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={focusAnimation}
        onBlur={blurAnimation}
        keyboardType={keyboardType ? keyboardType : 'default'}
        maxLength={maxLength}
        allowFontScaling={false}
        accessible={true}
        ref={inputRef}
        style={[
          styles.input,
          {
            borderColor: error ? Colors.warning : Colors.placeholder,
          },
          cStyle,
        ]}
      />
    </View>
  );
};

const styles = EStyleSheet.create({
  inputElementConainer: {
    alignSelf: 'center',
  },
  input: {
    height: Dimensions.get('window').height * 0.07,
    width: PropDimensions.standardWidth,
    borderWidth: 1,
    borderRadius: 6,
    fontFamily: 'PloniMLv2AAA-Regular',
    paddingHorizontal: '5%',
    backgroundColor: Colors.white,
    fontSize: '1.2rem',
    color: Colors.primary,
  },
  holderContainer: {
    position: 'absolute',
    top: '34%',
    left: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    zIndex: 2000,
    paddingHorizontal: '1%',
    borderRadius: 6,
  },
});

export default InputElement;
