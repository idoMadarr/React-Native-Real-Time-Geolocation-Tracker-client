import {View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux/hooks/hooks';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {BottomSheetTypes} from './BottomSheetTypes';
import MessageBottomSheet from '../MainPartials/MessageBottomSheet';
import {MessageType} from '../../models/MessageModel';
import {setBottomSheet} from '../../redux/slices/mainSlice';
import Colors from '../../assets/colors/palette.json';

const MainBottomsheet = () => {
  const dispatch = useAppDispatch();

  const bottomSheet = useAppSelector(state => state.mainSlice.bottomSheet);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [bottomsheetHeight, setBottomsheetHeight] = useState<string>('60%');

  // Main Modal:
  useEffect(() => {
    handleMainBottomsheet();
  }, [bottomSheet]);

  useEffect(() => {
    if (!bottomSheet) bottomSheetRef.current?.close();
  }, [bottomSheet]);

  const handleMainBottomsheet = async () => {
    if (bottomSheet) {
      const currentMessage = bottomSheet.type;

      if (currentMessage === BottomSheetTypes.MESSAGE) {
        extendBottomsheet('34%');
        return;
      }
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    [],
  );

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const extendBottomsheet = (percentage: string) => {
    setBottomsheetHeight(percentage);
    bottomSheetRef.current?.expand();
  };

  let modalComponent: React.JSX.Element = <View />;

  if (bottomSheet) {
    switch (bottomSheet.type) {
      case BottomSheetTypes.MESSAGE:
        modalComponent = (
          <MessageBottomSheet
            {...(bottomSheet.content as MessageType)}
            closeBottomSheet={closeBottomSheet}
          />
        );
        break;
      default:
        break;
    }
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[bottomsheetHeight]}
      // Remove snapPonits and snapToIndex method for disable expanding - ONLY 'close with gesture' is allow
      // snapPoints={['25%', '35%', '46%', '75%', '85%', '100%']}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      enablePanDownToClose={true}
      animationConfigs={{duration: 450}}
      onChange={index => {
        if (index == -1) {
          dispatch(setBottomSheet(null));
        }
      }}
      handleStyle={{backgroundColor: Colors.transparent}}
      handleIndicatorStyle={{backgroundColor: Colors.dark}}
      backdropComponent={renderBackdrop}>
      <BottomSheetView>{modalComponent}</BottomSheetView>
    </BottomSheet>
  );
};

export default MainBottomsheet;
