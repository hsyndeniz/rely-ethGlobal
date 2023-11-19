import React from 'react';
import Toast from 'react-native-toast-message';
import { useFlipper } from '@react-navigation/devtools';
import { SafeAreaView, StatusBar, Text } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { HeaderButtonsProvider } from 'react-navigation-header-buttons';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { LinkingOptions } from '@react-navigation/native/src/types';
import { DrawerNavigator } from '@/navigators';
import { useTheme } from '@/hooks';

const linking: LinkingOptions<any> = {
  prefixes: [
    'wc://',
    'rely://',
    'wallet://',
    'ethereum://',
    'solana://',
    'https://craftlabs.tech',
    'https://*.craftlabs.tech',
    'https://getrely.io',
    'https://*.getrely.io',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'startup',
    screens: {
      startup: 'startup',
      login: 'login',
      tabs: {
        path: 'tabs',
        screens: {
          home: 'home',
          account: 'account/:address',
        },
      },
    },
  },
};

const ApplicationNavigator = () => {
  const { darkMode, Colors, Layout, NavigationTheme } = useTheme();

  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={NavigationTheme}
      linking={linking}
      fallback={<Text>Loading...</Text>}>
      <HeaderButtonsProvider stackType="native">
        <BottomSheetModalProvider>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <SafeAreaView style={[Layout.fill, { backgroundColor: Colors.background }]}>
            <DrawerNavigator />
            <Toast />
          </SafeAreaView>
        </BottomSheetModalProvider>
      </HeaderButtonsProvider>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
