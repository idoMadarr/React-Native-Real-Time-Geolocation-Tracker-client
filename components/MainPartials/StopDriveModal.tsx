import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../../assets/colors/palette.json';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import {PropDimensions} from '../../services/dimensions';

interface StopDriveModalPropsType {
  onSummarize(): void;
}

const StopDriveModal: React.FC<StopDriveModalPropsType> = ({onSummarize}) => {
  return (
    <View style={styles.modalContainer}>
      <TextElement fontSize={'lg'} fontWeight={'bold'}>
        End Drive
      </TextElement>
      <TextElement cStyle={{textAlign: 'justify'}}>
        Are you sure you want to end the current drive? Your trip will stop
        being tracked, and all collected data will be saved. You can view the
        route and trip summary once the drive ends.
      </TextElement>
      <ButtonElement
        title={'Summarize'}
        fontSize={'m'}
        cStyle={{width: 100, height: 35}}
        titleColor={Colors.white}
        backgroundColor={Colors.secondary}
        onPress={onSummarize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: PropDimensions.fullHeight * 0.18,
    width: PropDimensions.fullWidth,
    justifyContent: 'space-evenly',
    paddingHorizontal: '5%',
  },
});

export default StopDriveModal;
