import { ThemeNavigationColors } from '../../../../@types/theme';

export const Colors = {
  primary: '#7454a5',
  textGray800: '#E0E0E0',
  textGray400: '#969696',
  textGray200: '#BABABA',
  inputBackground: '#3a3a3a',
  circleButtonBackground: '#252732',

  positive_01: 'rgba(68,208,88,1)',
  positive_02: 'rgba(78,188,96,0.1)',
  positive_03: 'rgba(78,188,96,1)',
  negative_01: 'rgba(252,95,95,1)',
  negative_02: 'rgba(252,95,95,0.1)',
  warning_01: 'rgba(255, 202, 15, 1)',
  warning_02: 'rgba(255, 202, 15, 0.1)',
  interactive_01: 'rgba(97,119,229,1)',
  interactive_02: 'rgba(35,37,47,1)',
  interactive_03: 'rgba(255,255,255,0.1)',
  interactive_04: 'rgba(131,140,145,1)',
  background: 'rgba(20,20,20,1)',
  ui_01: 'rgba(37,37,40,1)',
  ui_02: 'rgba(0,0,0,0.1)',
  ui_03: 'rgba(0,0,0,0.86)',
  text_01: 'rgba(255,255,255,1)',
  text_02: 'rgba(131,140,145,1)',
  text_03: 'rgba(255,255,255,0.7)',
  text_04: 'rgba(97,119,229,1)',
  text_05: 'rgba(20,20,20,1)',
  icon_01: 'rgba(255,255,255,1)',
  icon_02: 'rgba(131,140,145,1)',
  icon_03: 'rgba(255,255,255,0.4)',
  icon_04: 'rgba(97,119,229,1)',
  icon_05: 'rgba(20,20,20,1)',
  shadow_01: 'rgba(0,0,0,0.75)',
  backdrop: 'rgba(0,0,0,0.4)',
  border_01: 'rgba(37,37,40,1)',
  border_02: 'rgba(97,119,229,0.1)',
  highlight: 'rgba(67,96,223,0.4)',
  blurred_bg: 'rgba(0,0,0,0.3)',
};

export const NavigationColors: Partial<ThemeNavigationColors> = {
  primary: Colors.primary,
  background: Colors.background,
  card: '#1B1A23',
};

export default {
  Colors,
  NavigationColors,
};
