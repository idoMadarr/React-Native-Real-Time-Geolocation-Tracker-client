import React from 'react';
import {
  Linking,
  NativeModules,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Colors from '../assets/colors/palette.json';
import {PropDimensions} from '../services/dimensions';
import ButtonElement from '../components/Resuable/ButtonElement';
import {permissionsList} from '../fixtures/permissions.json';
import {useAppDispatch, useAppSelector} from '../redux/hooks/hooks';
import {askForgroundLocation} from '../utils/permissions';
import PermissionItem from '../components/PermissionsPartials/PermissionItem';
import {updatePermission} from '../redux/slices/mainSlice';
import {navigate} from '../utils/rootNavigation';
import LinearGradient from 'react-native-linear-gradient';
import TextElement from '../components/Resuable/TextElement';

const {GPSServices, OverlayPermission} = NativeModules;

const CustomBackground = () => {
  const colors = [
    Colors.secondary,
    Colors.secondary,
    Colors.secondary,
    Colors.white,
    Colors.white,
    Colors.white,
  ];

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={styles.inner}>
        <LinearGradient
          colors={colors}
          style={{
            width: PropDimensions.circleButton,
            height: PropDimensions.circleButton,
          }}
        />
      </View>
    </View>
  );
};

const PermissionsScreen = () => {
  const dispatch = useAppDispatch();

  const permissions = useAppSelector(state => state.mainSlice.permissions);

  const onPress = (type: string) => {
    if (type === 'gps') {
      if (permissions.gps) return;

      GPSServices.openGPSSettings();
    }

    if (type === 'location') {
      if (permissions.location) return;

      askForgroundLocation(() => {
        dispatch(updatePermission({type, value: true}));
      });
    }

    if (type === 'backgroundLocation') {
      if (permissions.backgroundLocation) return;

      Linking.openSettings();
    }

    if (type === 'batteryOptimization') {
      if (permissions.batteryOptimization) return;

      Linking.openSettings();
    }

    if (type === 'overlay') {
      if (permissions.overlay) return;

      OverlayPermission.requestOverlayPermission();
    }
  };

  const onReady = () => {
    if (isEnabled) navigate('main');
  };

  const onPrivacyPolicy = () => Linking.openURL(Config.privacyPolicy!);

  const isEnabled =
    permissions.gps &&
    permissions.location &&
    permissions.backgroundLocation &&
    permissions.batteryOptimization;

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.white}
      />
      <CustomBackground />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.policyContainer}>
          <Pressable onPress={onPrivacyPolicy}>
            <TextElement>
              {'* Click here to check our full '}
              <TextElement fontWeight={'bold'} cStyle={styles.policyText}>
                {'Privacy Policy'}
              </TextElement>
              {' for more inforamtion.'}
            </TextElement>
          </Pressable>
        </View>
        {permissionsList.map((permission, index) => {
          return (
            <PermissionItem
              key={index}
              title={permission.title}
              description={permission.description}
              // @ts-ignore:
              status={permissions[permission.type]}
              onPress={onPress.bind(this, permission.type)}
            />
          );
        })}
      </ScrollView>

      <ButtonElement
        title={isEnabled ? 'READY' : 'Please allow device permissions'}
        titleColor={Colors.white}
        fontSize={'s'}
        enable={isEnabled}
        backgroundColor={Colors.secondary}
        onPress={onReady}
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
    width: PropDimensions.fullWidth,
    borderRadius: 0,
    alignSelf: 'center',
  },
  inner: {
    position: 'absolute',
    bottom: -100,
    alignSelf: 'center',
    borderRadius: 80,
    overflow: 'hidden',
    opacity: 0.1,
    transform: [{scale: 6.0}],
  },
  policyContainer: {
    width: PropDimensions.standardWidth,
    alignSelf: 'center',
    marginTop: '4%',
  },
  policyText: {
    textDecorationLine: 'underline',
    color: Colors.secondary,
  },
});

export default PermissionsScreen;
