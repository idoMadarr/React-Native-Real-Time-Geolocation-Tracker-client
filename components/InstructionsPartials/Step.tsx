import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import * as Colors from '../../assets/colors/palette.json';

interface StepPropsType {
  title: string;
  description: string;
  asset: string;
  action: string;
  handleProgress(): void;
  statusButton: boolean;
}

const Step: React.FC<StepPropsType> = ({
  title,
  description,
  asset,
  action,
  handleProgress,
  statusButton,
}) => {
  return (
    <View style={styles.screen}>
      <View style={styles.imageSection}>
        <Image
          source={require(`../../assets/images/folded-map.png`)}
          style={styles.image}
        />
      </View>
      <View style={styles.descriptionSection}>
        <View>
          <TextElement
            fontWeight={'bold'}
            cStyle={styles.title}
            fontSize={'lg'}>
            {title}
          </TextElement>
          <TextElement cStyle={styles.desc}>{description}</TextElement>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <ButtonElement
            title={action}
            titleColor={Colors.white}
            onPress={handleProgress}
            backgroundColor={'orange'}
            enable={statusButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: PropDimensions.fullWidth,
    height: PropDimensions.fullHeight,
    alignItems: 'center',
  },
  imageSection: {
    height: PropDimensions.fullHeight * 0.6,
    justifyContent: 'center',
  },
  descriptionSection: {
    height: PropDimensions.fullHeight * 0.28,
    paddingHorizontal: '8%',
    justifyContent: 'space-between',
  },
  image: {
    width: PropDimensions.fullWidth / 1.8,
    height: PropDimensions.fullWidth / 1.8,
  },
  title: {
    color: Colors.white,
    marginBottom: '4%',
  },
  desc: {
    color: Colors.white,
  },
});

export default Step;
