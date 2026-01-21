import React from 'react';
import {
  Dimensions,
  Linking,
  NativeModules,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Colors from '../assets/colors/palette.json';
import TextElement from '../components/Resuable/TextElement';
import {PropDimensions} from '../services/dimensions';
import ButtonElement from '../components/Resuable/ButtonElement';
import {permissions} from '../fixtures/permissions.json';
import {useAppSelector} from '../redux/hooks/hooks';
import {askForgroundLocation} from '../utils/permissions';
import PermissionItem from '../components/PermissionsPartials/PermissionItem';

const {GPSServices} = NativeModules;

const PermissionsScreen = () => {
  const {
    gps,
    location,
    backgroundLocation,
    batteryOptimization,
    notifications,
    overlay,
  } = useAppSelector(state => state.mainSlice.permissions);

  const onPress = (type: string) => {
    if (type === 'gps') {
      if (gps) return;

      GPSServices.openGPSSettings();
    }

    if (type === 'location') {
      if (location) return;

      askForgroundLocation();
    }

    if (type === 'background_location') {
      if (backgroundLocation) return;

      Linking.openSettings();
    }

    if (type === 'battery_optimization') {
      if (batteryOptimization) return;

      Linking.openSettings();
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.white}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {permissions.map((permission, index) => {
          // let titleStatus = '';
          // let colorStatus = Colors.placeholder;

          // switch (permission.type) {
          //   case 'gps':
          //     titleStatus = gps ? 'Granted' : 'Enable';
          //     colorStatus = gps ? Colors.speed : Colors.placeholder;
          //     break;
          //   case 'location':
          //     titleStatus = location ? 'Granted' : 'Enable';
          //     colorStatus = location ? Colors.speed : Colors.placeholder;
          //     break;
          //   case 'background_location':
          //     titleStatus = backgroundLocation ? 'Granted' : 'Enable';
          //     colorStatus = backgroundLocation
          //       ? Colors.speed
          //       : Colors.placeholder;
          //     break;
          //   case 'battery_optimization':
          //     titleStatus = batteryOptimization ? 'Granted' : 'Enable';
          //     colorStatus = batteryOptimization
          //       ? Colors.speed
          //       : Colors.placeholder;
          //     break;
          //   case 'notifications':
          //     titleStatus = notifications ? 'Granted' : 'Enable';
          //     colorStatus = notifications ? Colors.speed : Colors.placeholder;
          //     break;
          //   case 'overlay':
          //     titleStatus = overlay ? 'Granted' : 'Enable';
          //     colorStatus = overlay ? Colors.speed : Colors.placeholder;
          //     break;
          // }

          return (
            <PermissionItem
              key={index}
              title={permission.title}
              description={permission.description}
              type={permission.type}
              onPress={onPress.bind(this, permission.type)}
            />
          );
        })}
      </ScrollView>

      <ButtonElement
        title={'ALL SET'}
        titleColor={Colors.white}
        backgroundColor={Colors.primary}
        onPress={() => {}}
        cStyle={styles.button}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  button: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    marginBottom: '4%',
  },
});

export default PermissionsScreen;
