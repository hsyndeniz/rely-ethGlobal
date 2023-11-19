/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native';
import buttonStyles from './components/Buttons';
import { CommonParams } from '../../@types/theme';
import { device } from '@/utils/device';

export default function <C>({ Colors, ...args }: CommonParams<C>) {
  return {
    button: buttonStyles({ Colors, ...args }),
    ...StyleSheet.create({
      backgroundPrimary: {
        backgroundColor: Colors.primary,
      },
      backgroundReset: {
        backgroundColor: Colors.transparent,
      },
      textInput: {
        ...args.Layout.fill,
        ...args.Layout.center,
        padding: args.MetricsSizes.large,
        borderRadius: args.MetricsSizes.xsmall,
        color: Colors.text_01,
        backgroundColor: Colors.ui_01,
      },
      textArea: {
        ...args.Layout.fill,
        ...args.Layout.center,
        padding: args.MetricsSizes.large,
        borderRadius: args.MetricsSizes.xsmall,
        color: Colors.text_01,
        backgroundColor: Colors.ui_01,
        minHeight: 76,
      },
      avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
      largeAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
      },
      image: {
        width: device.getDeviceWidth() / 1.5,
        height: device.getDeviceWidth() / 1.5,
      },
      border: {
        borderWidth: 1,
      },
      borderTop: {
        borderTopWidth: 1,
      },
      borderBottom: {
        borderBottomWidth: 1,
      },
      shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.1)', // Black color with 10% opacity
        shadowOffset: {
          width: 2,
          height: 12,
        },
        shadowOpacity: 0.5, // Increase shadow opacity for a stronger effect
        shadowRadius: 2, // Increase shadow radius for a larger spread
        elevation: 24, // Android-specific shadow
      },
      zIndex: {
        zIndex: 1,
      },
    }),
  };
}
