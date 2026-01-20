import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import StatusBarElement from '../components/Resuable/StatusBarElement';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Colors from '../assets/colors/palette.json';
import TextElement from '../components/Resuable/TextElement';
import {PropDimensions} from '../services/dimensions';
import ButtonElement from '../components/Resuable/ButtonElement';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const PermissionsScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBarElement
        barStyle={'light-content'}
        backgroundColor={Colors.white}
      />
      <View style={styles.permissionContainer}>
        <View style={styles.permissionHead}>
          <TextElement fontWeight="bold" cStyle={styles.stateText}>
            {'Location*'}
          </TextElement>
          <ButtonElement
            title={'Request'}
            fontSize={'s'}
            titleColor={Colors.white}
            backgroundColor={Colors.primary}
            onPress={() => {}}
            cStyle={styles.permissionButton}
          />
        </View>
        <TextElement fontSize="s" cStyle={{opacity: 0.5, marginTop: '4%'}}>
          In order to being able to record your trips, the app needs access to
          your location. Please choose "While in use" and leave the precision on
          "high".
        </TextElement>
      </View>

      <View style={styles.permissionContainer}>
        <View style={styles.permissionHead}>
          <TextElement fontWeight="bold" cStyle={styles.stateText}>
            {'Background Location*'}
          </TextElement>
          <ButtonElement
            title={'Allow'}
            fontSize={'s'}
            titleColor={Colors.white}
            backgroundColor={Colors.primary}
            onPress={() => {}}
            cStyle={styles.permissionButton}
          />
        </View>
        <TextElement fontSize="s" cStyle={{opacity: 0.5, marginTop: '4%'}}>
          Background location access allows us to track your trips even if you
          lock your phone, switch apps, or setting the app in the background, So
          your trips continue recording seamlessly while you drive.
        </TextElement>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Dimensions.get('window').height * 0.02,
  },
  permissionContainer: {
    width: PropDimensions.standardWidth,
    // height: Dimensions.get('window').height * 0.3,
    // justifyContent: 'center',
    // paddingHorizontal: '4%',
    backgroundColor: Colors.white,
    // elevation: 12,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: '6%',
    padding: '4%',
  },
  permissionHead: {
    paddingVertical: '4%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.placeholder,
  },
  permissionButton: {
    width: 85,
    height: 30,
  },
  stateText: {
    color: Colors.dark,
  },
});

export default PermissionsScreen;
