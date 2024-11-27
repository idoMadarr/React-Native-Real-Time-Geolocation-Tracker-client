import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppNavigation from './navigation/AppNavigation';
import {Provider} from 'react-redux';
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
