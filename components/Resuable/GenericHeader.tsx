import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import TextElement from '../Resuable/TextElement';
import {BackIcon, ListIcon, StatisticIcon} from '../../assets/svgs';
import {goBack} from '../../utils/rootNavigation';
import Colors from '../../assets/colors/palette.json';
interface GenericHeaderPropsType {
  title: string;
  description?: string;
}

const GenericHeader: React.FC<GenericHeaderPropsType> = ({
  title,
  description,
}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View>
        <View style={styles.titleContainer}>
          {title === 'Trips History' ? (
            <ListIcon width={28} height={28} color={Colors.dark} />
          ) : (
            <StatisticIcon width={28} height={28} color={Colors.dark} />
          )}
          <TextElement
            fontSize={'lg'}
            cStyle={styles.title}
            fontWeight={'bold'}>
            {title}
          </TextElement>
        </View>
        <TextElement fontSize={'m'} cStyle={styles.description}>
          {description}
        </TextElement>
      </View>
      <Pressable
        onPress={goBack}
        style={({pressed}) => {
          return {
            opacity: pressed ? 0.7 : 1,
          };
        }}>
        <BackIcon
          width={28}
          height={28}
          color={Colors.black}
          style={styles.rotate}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: PropDimensions.genericHeaderHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    elevation: 5,
  },
  rotate: {
    transform: [{rotate: '180deg'}],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    color: Colors.dark,
  },
  description: {
    opacity: 0.5,
  },
});

export default GenericHeader;
