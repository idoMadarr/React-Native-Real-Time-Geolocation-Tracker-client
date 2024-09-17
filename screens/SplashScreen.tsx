import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {navigate} from '../utils/rootNavigation';
import StatusBarElement from '../components/Resuable/StatusBarElement';

const SplashScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      initApplication();
    }, 3000);
  }, []);

  const initApplication = () => {
    navigate('instructions');
  };

  return (
    <View>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;
