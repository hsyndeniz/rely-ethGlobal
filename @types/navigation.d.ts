import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type DrawerParamList = {
  startup: undefined;
  main: NavigatorScreenParams<MainStackParamList>;
  setup: NavigatorScreenParams<SetupStackParamList>;
};

export type TabParamList = {
  home: undefined;
  explore: undefined;
  browser: undefined;
  defi: undefined;
  history: undefined;
};

export type MainStackParamList = {
  login: undefined;
  tabs: NavigatorScreenParams<TabParamList>;
  scan: undefined;
  social: undefined;
  chat: { chat: any };
};

export type SetupStackParamList = {
  onboarding: undefined;
  welcome: undefined;
  'create-password': undefined;
  'generate-mnemonic': { password: string; biometryType: string | null };
  'confirm-mnemonic': undefined;
  'import-mnemonic': undefined;
  'biometric-permission': { mnemonic: string; password: string; biometryType: string };
  'notification-permission': undefined;
  'get-started': undefined;
};

export type DrawerScreenProps = DrawerScreenProps<DrawerParamList>;
export type TabScreenProps = BottomTabScreenProps<TabParamList>;
export type SetupStackScreenProps = NativeStackScreenProps<SetupStackParamList>;
export type MainStackScreenProps = NativeStackScreenProps<MainStackParamList>;
