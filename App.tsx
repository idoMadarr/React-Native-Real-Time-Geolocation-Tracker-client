import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Provider} from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import AppNavigation from './navigation/AppNavigation';
import store from './redux/store/store';
import {MeasurementProvider} from './context/MeasurementContext';

EStyleSheet.build({});

const App = () => {
  KeepAwake.activate();

  return (
    <Provider store={store}>
      <MeasurementProvider>
        <AppNavigation />
      </MeasurementProvider>
    </Provider>
  );
};

export default App;
