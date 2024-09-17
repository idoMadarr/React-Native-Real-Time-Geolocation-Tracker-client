import React from 'react';
import {Text} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

interface TextElementType {
  children: JSX.Element | JSX.Element[] | string;
  fontSize?: string;
  fontWeight?: string;
  cStyle?: object;
  numberOfLines?: number;
}

const TextElement: React.FC<TextElementType> = ({
  children,
  fontSize,
  fontWeight,
  cStyle = {},
  numberOfLines,
}) => {
  const setFontSize = (size: string = 'm') => {
    const fontSize =
      size === 's'
        ? '0.9rem'
        : size === 'm'
        ? '1rem'
        : size === 'lg'
        ? '1.4rem'
        : '2.2rem';

    return fontSize;
  };

  const setFontFamily = (font?: string) => {
    return font === 'bold'
      ? 'PloniMLv2AAA-Bold'
      : font === 'light'
      ? 'PloniMLv2AAA-Light'
      : 'PloniMLv2AAA-Regular';
  };

  const styles = EStyleSheet.create({
    constants: {
      fontSize: setFontSize(fontSize),
      fontFamily: setFontFamily(fontWeight),
    },
  });

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.constants, {...cStyle}]}
      allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default TextElement;
