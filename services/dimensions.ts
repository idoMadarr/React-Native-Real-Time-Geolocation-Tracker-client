import {Dimensions} from 'react-native';

export enum PropDimensions {
  fullWidth = Dimensions.get('window').width,
  fullHeight = Dimensions.get('window').height,
  buttonWidth = Dimensions.get('window').width * 0.35,
  buttonHight = Dimensions.get('window').height * 0.05,
  sectionHeight = Dimensions.get('window').height * 0.25,
  standardWidth = Dimensions.get('window').width * 0.85,
  circleButton = Dimensions.get('window').width * 0.32,
}
