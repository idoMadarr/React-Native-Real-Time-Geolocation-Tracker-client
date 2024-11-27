import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import TextElement from './TextElement';
import Colors from '../../assets/colors/palette.json';
interface ButtonElementType {
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

const ButtonElement: React.FC<ButtonElementType> = ({
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
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.buttonContainer,
          {backgroundColor: enable ? backgroundColor : '#eee'},
          {...cStyle},
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
      </View>
    </TouchableOpacity>
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

export default ButtonElement;
