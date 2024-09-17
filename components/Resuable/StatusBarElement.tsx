import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

interface StatusBarElementType {
  barStyle: 'default' | 'light-content' | 'dark-content';
  backgroundColor: string;
}

const StatusBarElement: React.FC<StatusBarElementType> = ({
  barStyle,
  backgroundColor,
}) => {
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
  ) : null;
};

export default StatusBarElement;
