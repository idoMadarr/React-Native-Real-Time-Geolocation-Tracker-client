import React, {Fragment} from 'react';
import MessageBottomSheet from '../MainPartials/MessageBottomSheet';
import SummarizeModal from '../MainPartials/SummarizeModal';
import {useAppDispatch, useAppSelector} from '../../redux/hooks/hooks';
import {
  BottomSheetActionsPropsType,
  setBottomSheet,
} from '../../redux/slices/mainSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {MessageBuilder} from '../../models/MessageModel';
import {getManufacturer, getUniqueId} from 'react-native-device-info';
import {saveRecord} from '../../redux/actions/mainActions';
import {useMeasurement} from '../../utils/useMeasurement';
import {goBack} from '../../utils/rootNavigation';

const BottomSheetActions: React.FC<BottomSheetActionsPropsType> = ({
  closeBottomSheet,
  extendBottomsheet,
}) => {
  const {stopLocationUpdatesNative} = useMeasurement();

  const dispatch = useAppDispatch();

  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord);

  const stopDriveRef = useSharedValue(1);
  const saveDriveRef = useSharedValue(0);

  const onDone = async () => {
    closeBottomSheet();
    setTimeout(() => {
      goBack();
      stopDriveRef.value = 1;
      saveDriveRef.value = 0;
      dispatch(setBottomSheet(null));
    }, 500);
  };

  const onSummarize = async () => {
    const measurement = stopLocationUpdatesNative();

    if (!measurement?.direction.length) {
      return handleInvalidRecord('No data recorded');
    }
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const body = {
      record: measurement.direction,
      deviceId: `${manufacturer}:${deviceId}`,
    };

    const invalidRecord = await dispatch(saveRecord(body));
    if (invalidRecord) {
      return handleInvalidRecord(
        invalidRecord.error || 'Unknown error occurred',
      );
    }

    stopDriveRef.value = 0;
    saveDriveRef.value = 1;
    extendBottomsheet();
  };

  const handleInvalidRecord = (error: string) => {
    closeBottomSheet();

    const errorMessage = new MessageBuilder(onDone)
      .setMessage('Tracker Failed:')
      .setContent(error)
      .setButtonTitle('close')
      .build();

    return setTimeout(() => {
      dispatch(setBottomSheet({type: 'message', content: errorMessage}));
    }, 600);
  };

  const stopDriveOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(stopDriveRef.value),
      display: stopDriveRef.value === 0 ? 'none' : 'flex',
    };
  });

  const saveDriveOpacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: withTiming(saveDriveRef.value),
      display: saveDriveRef.value === 0 ? 'none' : 'flex',
    };
  });

  return (
    <Fragment>
      <Animated.View style={[stopDriveOpacityAnimation]}>
        <MessageBottomSheet
          title={'End Drive'}
          content={
            'Are you sure you want to end the current drive? Your trip will stop being tracked, and all collected data will be saved. You can view the route and trip summary once the drive ends.'
          }
          buttonTitle={'Summarize'}
          onPress={onSummarize}
        />
      </Animated.View>
      <Animated.View style={[saveDriveOpacityAnimation]}>
        {currentRecord && (
          <SummarizeModal
            onDone={onDone}
            buttonTitle={'Save & Done'}
            currentRecord={currentRecord}
          />
        )}
      </Animated.View>
    </Fragment>
  );
};

export default BottomSheetActions;
