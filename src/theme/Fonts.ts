/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native';
import { ThemeVariables } from 'types/theme';

export default function ({ FontSize, Colors }: ThemeVariables) {
  return StyleSheet.create({
    textTiny: {
      fontSize: FontSize.tiny,
      fontFamily: 'Inter-Regular',
    },
    textXXSmall: {
      fontSize: FontSize.xxsmall,
      fontFamily: 'Inter-Regular',
    },
    textXSmall: {
      fontSize: FontSize.xsmall,
      fontFamily: 'Inter-Regular',
    },
    textSmall: {
      fontSize: FontSize.small,
      fontFamily: 'Inter-Regular',
    },
    textRegular: {
      fontSize: FontSize.regular,
      fontFamily: 'Inter',
    },
    textLarge: {
      fontSize: FontSize.large,
      fontFamily: 'Inter-Bold',
    },
    textXLarge: {
      fontSize: FontSize.xlarge,
      fontFamily: 'Inter-Bold',
    },
    textXXLarge: {
      fontSize: FontSize.xxlarge,
      fontFamily: 'Inter-Bold',
    },
    buttonText: {
      fontSize: FontSize.small,
      fontFamily: 'Inter',
      fontWeight: '500',
      textAlign: 'center',
      color: Colors.text_04,
    },
    titleXSmall: {
      fontSize: FontSize.xsmall,
      fontFamily: 'Inter',
      fontWeight: '500',
      textAlign: 'center',
      color: Colors.text_02,
    },
    titleSmall: {
      fontSize: FontSize.small,
      fontFamily: 'Inter',
      fontWeight: '500',
      textAlign: 'center',
      color: Colors.text_02,
    },
    titleRegular: {
      fontSize: FontSize.regular * 1.2, // 16 * 1.25 = 20
      fontFamily: 'Inter-Bold',
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.text_01,
    },
    titleLarge: {
      fontSize: FontSize.large,
      fontFamily: 'Inter-Bold',
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.text_01,
    },
    titleXLarge: {
      fontSize: FontSize.xlarge,
      fontFamily: 'Inter-Bold',
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.text_01,
    },
    textBold: {
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
    },
    textSemiBold: {
      fontWeight: '600',
      fontFamily: 'Inter',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    textLowercase: {
      textTransform: 'lowercase',
    },
    textCenter: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textShadow: {
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 5,
    },
    overflowHidden: {
      overflow: 'hidden',
    },
  });
}

export function invertColor(bgColor: string): boolean {
  if (!bgColor || typeof bgColor !== 'string' || !/^#([0-9A-F]{3}){1,2}$/i.test(bgColor)) {
    // Handle invalid or missing bgColor
    return false;
  }

  // Convert the hex color to RGB
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate the relative luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose white or black text based on luminance
  return luminance > 0.5 ? false : true;
}
