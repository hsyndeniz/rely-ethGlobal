import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '@/hooks';

type CustomBackdropProps = BottomSheetBackdropProps & { dismiss: () => void };

const CustomBackdrop = ({ animatedIndex, style, dismiss }: CustomBackdropProps) => {
  const { Colors, Layout } = useTheme();
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolate.CLAMP),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: Colors.backdrop,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable style={[Layout.fill, Layout.fullWidth, Layout.fullHeight]} onPress={dismiss} />
    </Animated.View>
  );
};

export default CustomBackdrop;
