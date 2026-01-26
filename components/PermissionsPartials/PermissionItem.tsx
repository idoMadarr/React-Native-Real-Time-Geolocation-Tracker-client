import React from 'react';
import {View, StyleSheet} from 'react-native';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import Colors from '../../assets/colors/palette.json';
import {PropDimensions} from '../../services/dimensions';
interface PermissionItemPropsType {
  status: boolean;
  title: string;
  description: string;
  onPress: () => void;
}

const PermissionItem: React.FC<PermissionItemPropsType> = ({
  status,
  title,
  description,
  onPress,
}) => {
  const titleStatus = status ? 'Granted' : 'Enable';
  const colorStatus = status ? Colors.speed : Colors.placeholder;

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
