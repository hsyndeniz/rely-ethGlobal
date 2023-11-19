import { getUniqueIdSync } from 'react-native-device-info';
import { LogLevel, OneSignal } from 'react-native-onesignal';

export const initOneSignal = () => {
  // use env variables to set log level
  OneSignal.Debug.setLogLevel(LogLevel.Debug);
  console.log('OneSignal: initializing...', process.env.ONESIGNAL_APP_ID);
  OneSignal.initialize(process.env.ONESIGNAL_APP_ID || '');
  // get the user's id to login
  const uniqueId = getUniqueIdSync();
  console.log('OneSignal: uniqueId:', uniqueId);
  OneSignal.login(uniqueId);

  onesignalEventListener();
};

const onesignalEventListener = () => {
  // TODO: Handle push notifications and deep links
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });
};
