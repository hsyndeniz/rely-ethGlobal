import React from 'react';
import { View } from 'react-native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList, SetupStackParamList } from 'types/navigation';
import { screens } from '@/screens';
import { useTheme } from '@/hooks';
import TabNavigator from './Tab';

const SetupStack = createNativeStackNavigator<SetupStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const { Colors, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const options: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackTitleVisible: false,
    headerTintColor: colors.text,
    headerStyle: { backgroundColor: colors.background as string },
    contentStyle: { borderBottomColor: Colors.border_01, borderBottomWidth: 1 },
  };

  return (
    <MainStack.Navigator initialRouteName="tabs">
      <MainStack.Screen
        name="login"
        options={{ headerShown: false, gestureEnabled: false }}
        component={screens.login}
      />
      <MainStack.Screen
        name="tabs"
        options={{ headerShown: false, gestureEnabled: false }}
        component={TabNavigator}
      />
      <MainStack.Screen name="scan" options={options} component={screens.scan} />
      <MainStack.Screen name="social" options={options} component={screens.social} />
      <MainStack.Screen name="chat" options={options} component={screens.chat} />
    </MainStack.Navigator>
  );
};

const SetupNavigator = () => {
  const { Colors, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const options: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackTitleVisible: false,
    headerTintColor: colors.text,
    headerStyle: { backgroundColor: colors.background as string },
    contentStyle: { borderBottomColor: Colors.border_01, borderBottomWidth: 1 },
  };

  return (
    <SetupStack.Navigator initialRouteName="onboarding">
      <SetupStack.Screen name="onboarding" options={{ headerShown: false }} component={screens.onboarding} />
      <SetupStack.Screen name="welcome" options={{ headerShown: false }} component={screens.wallet.welcome} />
      <SetupStack.Group screenOptions={options}>
        <SetupStack.Screen name="generate-mnemonic" component={screens.wallet.create.mnemonic} />
        <SetupStack.Screen name="confirm-mnemonic" component={EmptyScreen} />
        <SetupStack.Screen name="import-mnemonic" component={screens.wallet.import.mnemonic} />
        <SetupStack.Screen name="biometric-permission" component={screens.wallet.biometric} />
        <SetupStack.Screen name="create-password" component={screens.wallet.create.password} />
        <SetupStack.Screen name="notification-permission" component={screens.wallet.notification} />
        <SetupStack.Screen name="get-started" component={screens.wallet.getStarted} />
      </SetupStack.Group>
    </SetupStack.Navigator>
  );
};

export default MainNavigator;
export { MainNavigator, SetupNavigator };

function EmptyScreen() {
  return <View />;
}
