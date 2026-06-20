import React from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {PropDimensions} from '../../services/dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import TextElement from '../Resuable/TextElement';
import {BackIcon, ListIcon, StatisticIcon} from '../../assets/svgs';
import {goBack, navigate} from '../../utils/rootNavigation';
import Colors from '../../assets/colors/palette.json';
import {useAppSelector} from '../../redux/hooks/hooks';

interface GenericHeaderPropsType {
  title: string;
  description?: string;
  backDestination?: string;
}

const GenericHeader: React.FC<GenericHeaderPropsType> = ({
  title,
  description,
  backDestination,
}) => {
  const appReady = useAppSelector(state => state.mainSlice.appReady);

  const onPress = () => {
    if (backDestination) {
      return navigate(backDestination);
    }

    goBack();
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.content}>
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
        <TextElement fontSize={'s'} cStyle={styles.description}>
          {description}
        </TextElement>
      </View>
      {appReady && (
        <View style={styles.content}>
          <Pressable
            onPress={onPress}
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
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: PropDimensions.genericHeaderHeight,
    width: PropDimensions.fullWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: '5%',
    paddingHorizontal: '18%',
    backgroundColor: Colors.primary,
  },
  content: {
    height: Dimensions.get('window').height * 0.1,
  },
  rotate: {
    transform: [{rotate: '180deg'}],
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    color: Colors.white,
  },
  description: {
    opacity: 0.6,
  },
});

export default GenericHeader;
