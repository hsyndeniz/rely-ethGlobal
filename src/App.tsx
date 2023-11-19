import 'fast-text-encoding';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import '@walletconnect/react-native-compat';
import React from 'react';
import { Provider } from 'react-redux';
import { LogBox, StyleSheet } from 'react-native';
import Analytics from 'appcenter-analytics';
import * as Sentry from '@sentry/react-native';
import { Provider as UrqlProvider } from 'urql';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initOneSignal } from '@/services/onesignal';
import { initSentry } from '@/services/sentry';
import { urqlClient } from '@/services/lens';
import { RootNavigator } from '@/navigators';
import { store, persistor } from '@/store';
import '@/translations';

initSentry();
initOneSignal();
Analytics.setEnabled(true).then(() => Analytics.startSession().then(() => Analytics.trackEvent('start_app')));
LogBox.ignoreAllLogs(true);

const App = () => (
  <Provider store={store}>
    {/**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
     * for example `loading={<SplashScreen />}`.
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */}
    <PersistGate loading={null} persistor={persistor}>
      <UrqlProvider value={urqlClient}>
        <GestureHandlerRootView style={styles.container}>
          <RootNavigator />
        </GestureHandlerRootView>
      </UrqlProvider>
    </PersistGate>
  </Provider>
);

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
