import { StyleSheet } from 'react-native';
import { CommonParams } from 'types/theme';

export default function <C>({ Colors, Gutters, Layout, MetricsSizes }: CommonParams<C>) {
  const base = {
    ...Layout.center,
    ...Gutters.regularPadding,
  };
  const rounded = {
    ...base,
    borderRadius: MetricsSizes.xsmall,
    backgroundColor: Colors.interactive_02,
  };
  const circle = {
    ...Layout.center,
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.circleButtonBackground,
    color: Colors.circleButtonColor,
    fill: Colors.circleButtonColor,
  };
  const chip = {
    ...Layout.fill,
    ...Layout.rowCenter,
    ...Gutters.smallVPadding,
    ...Gutters.regularHPadding,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Colors.border_01,
  };

  return StyleSheet.create({
    base,
    rounded,
    circle,
    chip,
    outline: {
      ...base,
      backgroundColor: Colors.transparent,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    outlineRounded: {
      ...rounded,
      backgroundColor: Colors.transparent,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    actionButton: {
      ...rounded,
      backgroundColor: Colors.interactive_01,
    },
  });
}
