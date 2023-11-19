import * as Keychain from 'react-native-keychain';

export const getSupportedBiometryType = (): Promise<Keychain.BIOMETRY_TYPE | null> => {
  return new Promise((resolve, reject) => {
    Keychain.getSupportedBiometryType()
      .then(biometryType => {
        resolve(biometryType);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const storeCredentials = (
  mnemonic: string,
  password: string,
  authenticationType: Keychain.AUTHENTICATION_TYPE,
) => {
  const options = {
    authenticationPrompt: {
      title: 'Authentication needed',
      subtitle: 'Authentication is needed to confirm your identity.',
      description: 'Are you trying to access your wallet?',
      cancel: 'Cancel',
    },
    service: 'com.craftlabs',
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl:
      authenticationType === Keychain.AUTHENTICATION_TYPE.BIOMETRICS
        ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
        : Keychain.ACCESS_CONTROL.USER_PRESENCE,
    authenticationType: authenticationType,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
  };
  return new Promise((resolve, reject) => {
    if (authenticationType === Keychain.AUTHENTICATION_TYPE.BIOMETRICS) {
      /**
       * Let the user authenticate with either their device passcode or biometrics.
       * We may need passcode in case the biometric hardware is malfunctioning.
       */
      Keychain.setGenericPassword(mnemonic, password, options)
        .then(() => {
          console.log('Credentials saved successfully!');
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    } else {
      Keychain.setGenericPassword(mnemonic, password, options)
        .then(() => {
          console.log('Credentials saved successfully!');
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    }
  });
};

export const getCredentials = (
  authenticationType: Keychain.AUTHENTICATION_TYPE,
): Promise<Keychain.UserCredentials> => {
  const options = {
    authenticationPrompt: {
      title: 'Authentication needed',
      subtitle: 'Authentication is needed to confirm your identity.',
      description: 'Are you trying to access your wallet?',
      cancel: 'Cancel',
    },
    service: 'com.craftlabs',
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    accessControl:
      authenticationType === Keychain.AUTHENTICATION_TYPE.BIOMETRICS
        ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
        : Keychain.ACCESS_CONTROL.USER_PRESENCE,
    authenticationType: authenticationType,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE,
  };
  return new Promise((resolve, reject) => {
    Keychain.getGenericPassword(options)
      .then(credentials => {
        console.log('Credentials successfully loaded for user ' + credentials);
        resolve(credentials);
      })
      .catch(error => {
        console.log('Keychain could not be accessed!', error);
        reject(error);
      });
  });
};
