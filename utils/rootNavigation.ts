import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (screen: string, payload?: object) => {
  if (navigationRef.isReady()) {
    // @ts-ignore:
    navigationRef.navigate(screen, payload);
  }
};

export const getCurrentRoute = () => navigationRef.getCurrentRoute();

export const goBack = () => navigationRef.goBack();
