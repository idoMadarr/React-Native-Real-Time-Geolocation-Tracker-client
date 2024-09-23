import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../../assets/colors/palette.json';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import {PropDimensions} from '../../services/dimensions';
import {MessageType} from '../../models/MessageModel';

const MessageBottomSheet: React.FC<MessageType> = ({
  title,
  content,
  buttonTitle,
  onPress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    await onPress();
    // setIsLoading(false);
  };

  return (
    <View style={styles.modalContainer}>
      <TextElement fontSize={'lg'} fontWeight={'bold'}>
        {title}
      </TextElement>
      <TextElement cStyle={{textAlign: 'justify'}}>{content}</TextElement>
      <ButtonElement
        title={buttonTitle}
        fontSize={'m'}
        cStyle={styles.button}
        titleColor={Colors.white}
        isLoading={isLoading}
        backgroundColor={Colors.secondary}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: PropDimensions.fullHeight * 0.22,
    width: PropDimensions.fullWidth,
    justifyContent: 'space-evenly',
    paddingHorizontal: '5%',
  },
  button: {
    width: 100,
    height: 35,
  },
});

export default MessageBottomSheet;
