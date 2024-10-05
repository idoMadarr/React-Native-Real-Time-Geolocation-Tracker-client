import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import TextElement from '../Resuable/TextElement';
import ButtonElement from '../Resuable/ButtonElement';
import * as Colors from '../../assets/colors/palette.json';

interface StepPropsType {
  id: number;
  title: string;
  description: string;
  asset: string;
  action: string;
  handleProgress(): void;
  statusButton: boolean;
  fetchPrivacyPolicy(): void;
  children: JSX.Element;
}

const Step: React.FC<StepPropsType> = ({
  id,
  title,
  description,
  asset,
  action,
  handleProgress,
  statusButton,
  fetchPrivacyPolicy,
  children,
}) => {
  const privacyPolicyTitle =
    id === 1 ? (
      <TouchableOpacity onPress={fetchPrivacyPolicy} activeOpacity={0.6}>
        {/* @ts-ignore: */}
        <TextElement cStyle={styles.notice}>
          * Click here to check our full{' '}
          <TextElement fontWeight={'bold'} cStyle={styles.desc}>
            Privacy Policy
          </TextElement>{' '}
          for more inforamtion.
        </TextElement>
      </TouchableOpacity>
    ) : null;

  return (
    <View style={styles.screen}>
      <View style={styles.imageSection}>{children}</View>
      <View style={styles.descriptionSection}>
        <View>
          <TextElement
            fontWeight={'bold'}
            cStyle={styles.title}
            fontSize={'lg'}>
            {title}
          </TextElement>
          <TextElement cStyle={styles.desc}>{description}</TextElement>
          {privacyPolicyTitle}
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
    height: PropDimensions.fullHeight * 0.3,
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
  notice: {
    marginTop: '3%',
    color: Colors.placeholder,
  },
});

export default Step;
