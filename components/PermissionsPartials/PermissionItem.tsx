import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import Colors from '../../assets/colors/palette.json';
import {PropDimensions} from '../../services/dimensions';
import {useAppSelector} from '../../redux/hooks/hooks';

interface PermissionItemPropsType {
  type: string;
  title: string;
  description: string;
  onPress: () => void;
}

const PermissionItem: React.FC<PermissionItemPropsType> = ({
  title,
  description,
  type,
  onPress,
}) => {
  const {
    gps,
    location,
    backgroundLocation,
    batteryOptimization,
    notifications,
    overlay,
  } = useAppSelector(state => state.mainSlice.permissions);

  const [titleStatus, setTitleStatus] = useState<string>(
    type === 'gps'
      ? gps
        ? 'Granted'
        : 'Enable'
      : type === 'location'
      ? location
        ? 'Granted'
        : 'Enable'
      : type === 'background_location'
      ? backgroundLocation
        ? 'Granted'
        : 'Enable'
      : type === 'battery_optimization'
      ? batteryOptimization
        ? 'Granted'
        : 'Enable'
      : type === 'notifications'
      ? notifications
        ? 'Granted'
        : 'Enable'
      : type === 'overlay'
      ? overlay
        ? 'Granted'
        : 'Enable'
      : 'Enable',
  );
  const [colorStatus, setColorStatus] = useState<string>(
    type === 'gps'
      ? gps
        ? Colors.speed
        : Colors.placeholder
      : type === 'location'
      ? location
        ? Colors.speed
        : Colors.placeholder
      : type === 'background_location'
      ? backgroundLocation
        ? Colors.speed
        : Colors.placeholder
      : type === 'battery_optimization'
      ? batteryOptimization
        ? Colors.speed
        : Colors.placeholder
      : type === 'notifications'
      ? notifications
        ? Colors.speed
        : Colors.placeholder
      : type === 'overlay'
      ? overlay
        ? Colors.speed
        : Colors.placeholder
      : Colors.placeholder,
  );

  // const updateState = () => {
  //     switch (type) {
  //         case 'gps':
  //           setTitleStatus(gps ? 'Granted' : 'Enable');
  //           setColorStatus(gps ? Colors.speed : Colors.placeholder);
  //           break;
  //         case 'location':
  //           setTitleStatus(location ? 'Granted' : 'Enable');
  //           setColorStatus(location ? Colors.speed : Colors.placeholder);
  //           break;
  //         case 'background_location':
  //           setTitleStatus(backgroundLocation ? 'Granted' : 'Enable');
  //           setColorStatus(backgroundLocation
  //             ? Colors.speed
  //             : Colors.placeholder;
  //           break;
  //         case 'battery_optimization':
  //           setTitleStatus(batteryOptimization ? 'Granted' : 'Enable');
  //           setColorStatus(batteryOptimization
  //             ? Colors.speed
  //             : Colors.placeholder;
  //           break;
  //         case 'notifications':
  //           setTitleStatus(notifications ? 'Granted' : 'Enable');
  //           setColorStatus(notifications ? Colors.speed : Colors.placeholder);
  //           break;
  //         case 'overlay':
  //           setTitleStatus(overlay ? 'Granted' : 'Enable');
  //           setColorStatus(overlay ? Colors.speed : Colors.placeholder);
  //           break;
  //       }
  // };

  return (
    <View style={styles.permissionContainer}>
      <View style={styles.permissionHead}>
        <TextElement fontWeight={'bold'} cStyle={styles.stateText}>
          {title}
        </TextElement>
        <ButtonElement
          title={titleStatus}
          fontSize={'s'}
          titleColor={Colors.white}
          backgroundColor={colorStatus}
          onPress={onPress}
          cStyle={styles.permissionButton}
        />
      </View>
      <TextElement fontSize={'s'} cStyle={{opacity: 0.5, marginTop: '4%'}}>
        {description}
      </TextElement>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    width: PropDimensions.standardWidth,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignSelf: 'center',
    padding: '4%',
    marginVertical: '4%',
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

export default PermissionItem;
