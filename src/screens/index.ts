export const wallet = {
  welcome: require('./wallet/welcome/Welcome').default,
  getStarted: require('./wallet/common/GetStarted').default,
  notification: require('./wallet/common/Notification').default,
  biometric: require('./wallet/common/Biometric').default,
  create: {
    mnemonic: require('./wallet/create/Mnemonic').default,
    password: require('./wallet/create/Password').default,
  },
  import: {
    mnemonic: require('./wallet/import/Mnemonic').default,
  },
};

export const screens = {
  wallet,
  startup: require('./startup/Startup').default,
  onboarding: require('./onboarding/Onboarding').default,
  login: require('./login/Login').default,
  home: require('./home/Home').default,
  explore: require('./explore/Explore').default,
  browser: require('./browser/Browser').default,
  scan: require('./scan/Scan').default,
  social: require('./social/Social').default,
  chat: require('./chat/Chat').default,
};
