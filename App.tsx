import React, {useEffect} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Provider} from 'react-redux';
import AppNavigation from './navigation/AppNavigation';
import store from './redux/store/store';

EStyleSheet.build({});

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default App;
