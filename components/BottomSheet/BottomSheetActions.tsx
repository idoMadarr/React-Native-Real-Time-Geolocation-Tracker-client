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

interface BottomSheetActionsPropsType2 {
  closeBottomSheet(): void;
  extendBottomsheet(): void;
}

const BottomSheetActions: React.FC<BottomSheetActionsPropsType2> = ({
  closeBottomSheet,
  extendBottomsheet,
}) => {
  const dispatch = useAppDispatch();

  const currentRecord = useAppSelector(state => state.mainSlice.currentRecord);
  const bottomSheet = useAppSelector(state => state.mainSlice.bottomSheet);

  const stopDriveRef = useSharedValue(1);
  const saveDriveRef = useSharedValue(0);

  const onDone = async (actions?: BottomSheetActionsPropsType) => {
    closeBottomSheet();
    setTimeout(() => {
      if (actions && 'onSave' in actions) actions.onSave();
      stopDriveRef.value = 1;
      saveDriveRef.value = 0;
      dispatch(setBottomSheet(null));
    }, 500);
  };

  const onSummarize = async (actions: BottomSheetActionsPropsType) => {
    const measurement = await actions.fetchMeasurement();
    if (!measurement.direction.length) {
      return handleInvalidRecord('No data recorded', actions);
    }
    const deviceId = await getUniqueId();
    const manufacturer = await getManufacturer();

    const body = {
      record: measurement.direction,
      deviceId: `${manufacturer}:${deviceId}`,
    };

    const invalidRecord = await dispatch(saveRecord(body));
    if (invalidRecord) {
      return handleInvalidRecord(invalidRecord.error, actions);
    }

    stopDriveRef.value = 0;
    saveDriveRef.value = 1;
    extendBottomsheet();
  };

  const handleInvalidRecord = (
    error: string,
    actions: BottomSheetActionsPropsType,
  ) => {
    closeBottomSheet();

    const errorMessage = new MessageBuilder(onDone.bind(this, actions))
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
          onPress={onSummarize.bind(
            this,
            bottomSheet?.content as BottomSheetActionsPropsType,
          )}
        />
      </Animated.View>
      <Animated.View style={[saveDriveOpacityAnimation]}>
        {currentRecord && (
          <SummarizeModal
            onDone={onDone.bind(
              this,
              bottomSheet?.content as BottomSheetActionsPropsType,
            )}
            buttonTitle={'Save & Done'}
            currentRecord={currentRecord}
          />
        )}
      </Animated.View>
    </Fragment>
  );
};

export default BottomSheetActions;
