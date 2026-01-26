import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigate = (screen: string, payload?: object) => {
  if (navigationRef.isReady()) {
    // @ts-ignore:
    navigationRef.navigate(screen, payload);
  }
};

export const replace = (screen: string, payload?: any) => {
  if (navigationRef.isReady()) {
    const action = StackActions.replace(screen, payload);
    navigationRef.dispatch(action);
  }
};

export const getCurrentRoute = () => navigationRef.getCurrentRoute();

export const goBack = () => navigationRef.goBack();
