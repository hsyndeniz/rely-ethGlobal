import React, { useCallback, useMemo, useRef } from 'react';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import { useTheme } from '@/hooks';

export const useBottomSheet = () => {
  const { Colors, Layout } = useTheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['60%', '60%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} enableTouchThrough={true} pressBehavior="close" />
    ),
    [],
  );

  const BottomSheet = useCallback(
    ({ content }: { content: JSX.Element }) => (
      <BottomSheetModal
        index={1}
        snapPoints={snapPoints}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        containerStyle={[{ backgroundColor: Colors.blurred_bg }]}
        backgroundStyle={[{ backgroundColor: Colors.background }]}
        handleIndicatorStyle={[{ backgroundColor: Colors.interactive_04 }]}>
        <View style={[Layout.fill, Layout.center, Layout.fullWidth]}>{content}</View>
      </BottomSheetModal>
    ),
    [],
  );

  return {
    BottomSheet,
    bottomSheetModalRef,
  };
};
