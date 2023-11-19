/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

import { ThemeNavigationColors } from '../../@types/theme';

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  //Typography
  textGray800: '#000000',
  textGray400: '#4D4D4D',
  textGray200: '#A1A1A1',
  primary: '#E14032',
  success: '#28a745',
  error: '#dc3545',
  //ComponentColors
  circleButtonBackground: '#E1E1EF',
  circleButtonColor: '#44427D',

  positive_01: 'rgba(68,208,88,1)',
  positive_02: 'rgba(78,188,96,0.1)',
  positive_03: 'rgba(78,188,96,1)',
  negative_01: 'rgba(255,45,85,1)',
  negative_02: 'rgba(255,45,85,0.1)',
  warning_01: 'rgba(255, 202, 15, 1)',
  warning_02: 'rgba(255, 202, 15, 0.1)',
  interactive_01: 'rgba(67,96,223,1)',
  interactive_02: 'rgba(236,239,252,1)',
  interactive_03: 'rgba(255,255,255,0.1)',
  interactive_04: 'rgba(147,155,161,1)',
  background: 'rgba(255,255,255,1)',
  ui_01: 'rgba(238,242,245,1)',
  ui_02: 'rgba(0,0,0,0.1)',
  ui_03: 'rgba(0,0,0,0.86)',
  text_01: 'rgba(0,0,0,1)',
  text_02: 'rgba(147,155,161,1)',
  text_03: 'rgba(255,255,255,0.7)',
  text_04: 'rgba(67,96,223,1)',
  text_05: 'rgba(255,255,255,1)',
  icon_01: 'rgba(0,0,0,1)',
  icon_02: 'rgba(147,155,161,1)',
  icon_03: 'rgba(255,255,255,0.4)',
  icon_04: 'rgba(67,96,223,1)',
  icon_05: 'rgba(255,255,255,1)',
  shadow_01: 'rgba(0,9,26,0.12)',
  backdrop: 'rgba(0,0,0,0.4)',
  border_01: 'rgba(238,242,245,1)',
  border_02: 'rgba(67, 96, 223, 0.1)',
  highlight: 'rgba(67,96,223,0.4)',
  blurred_bg: 'rgba(255,255,255,0.3)',
};

export const NavigationColors: Partial<ThemeNavigationColors> = {
  primary: Colors.primary,
  background: Colors.background,
  card: '#EFEFEF',
};

/**
 * FontSize
 */
export const FontSize = {
  tiny: 10,
  xxsmall: 11,
  xsmall: 12,
  small: 15,
  regular: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 36,
};

/**
 * Metrics Sizes
 */
export const MetricsSizes = {
  tiny: 2,
  xxxsmall: 3,
  xxsmall: 4,
  xsmall: 6,
  small: 8,
  regular: 10,
  large: 12,
  xlarge: 16,
  xxlarge: 24,
  xxxlarge: 32,
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
};
