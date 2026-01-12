import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

interface StatusBarElementType {
  barStyle: 'default' | 'light-content' | 'dark-content';
  backgroundColor: string;
  translucent?: boolean;
}

const StatusBarElement: React.FC<StatusBarElementType> = ({
  barStyle,
  backgroundColor,
  translucent,
}) => {
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar
      translucent={translucent}
      barStyle={barStyle}
      backgroundColor={backgroundColor}
    />
  ) : null;
};

export default StatusBarElement;
