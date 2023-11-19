'use strict';

import { Dimensions, Platform } from 'react-native';
import { getModel, hasNotch } from 'react-native-device-info';

class Device {
  static getDeviceWidth() {
    return Dimensions.get('window').width;
  }

  static getDeviceHeight() {
    return Dimensions.get('window').height;
  }

  // TODO: test it on all models
  static getStatusBarHeight() {
    if (this.isIos()) {
      if (this.isIphoneSE()) {
        return 20;
      }
      if (this.isIphone11()) {
        return 44;
      }
      if (this.isIphoneX()) {
        return 66;
      }
      if (this.isIphone12()) {
        return 66;
      }
      if (this.isIphone13()) {
        return 66;
      }
      if (this.isIphone14()) {
        return 66;
      }
      if (this.isIphone15()) {
        return 66;
      }
    }
  }

  static getToastOffset() {
    return Number(this.getStatusBarHeight()) + 52;
  }

  static isIos() {
    return Platform.OS === 'ios';
  }

  static isAndroid() {
    return Platform.OS === 'android';
  }

  static isIpad() {
    return this.getDeviceWidth() >= 1000 || this.getDeviceHeight() >= 1000;
  }

  static isLandscape() {
    return this.getDeviceWidth() > this.getDeviceHeight();
  }

  static isIphone5() {
    return this.getDeviceWidth() === 320;
  }

  static isIphone5S() {
    return this.getDeviceWidth() === 320;
  }

  static isIphone6() {
    return this.getDeviceWidth() === 375;
  }

  static isIphone6Plus() {
    return this.getDeviceWidth() === 414;
  }

  static isIphone6SPlus() {
    return this.getDeviceWidth() === 414;
  }

  static isIphoneSE() {
    return this.getDeviceWidth() === 375;
  }

  static isIphoneX() {
    return this.getDeviceWidth() >= 375 && this.getDeviceHeight() >= 812;
  }

  static isIpadPortrait9_7() {
    return this.getDeviceHeight() === 1024 && this.getDeviceWidth() === 736;
  }
  static isIpadLandscape9_7() {
    return this.getDeviceHeight() === 736 && this.getDeviceWidth() === 1024;
  }

  static isIpadPortrait10_5() {
    return this.getDeviceHeight() === 1112 && this.getDeviceWidth() === 834;
  }
  static isIpadLandscape10_5() {
    return this.getDeviceWidth() === 1112 && this.getDeviceHeight() === 834;
  }

  static isIpadPortrait12_9() {
    return this.getDeviceWidth() === 1024 && this.getDeviceHeight() === 1366;
  }

  static isIpadLandscape12_9() {
    return this.getDeviceWidth() === 1366 && this.getDeviceHeight() === 1024;
  }

  static isSmallDevice() {
    return this.getDeviceHeight() < 600;
  }

  static isMediumDevice() {
    return this.getDeviceHeight() < 736;
  }

  static isLargeDevice() {
    return this.getDeviceHeight() > 736;
  }

  static isIphone11() {
    const model = getModel();
    const models = ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max'];
    return models.includes(model);
  }

  static isIphone12() {
    const model = getModel();
    const models = ['iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max'];
    return models.includes(model);
  }

  static isIphone13() {
    const model = getModel();
    const models = ['iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max'];
    return models.includes(model);
  }

  static isIphone14() {
    const model = getModel();
    const models = ['iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max'];
    return models.includes(model);
  }

  static isIphone15() {
    const model = getModel();
    const models = ['iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'];
    return models.includes(model);
  }

  static hasNotch() {
    return hasNotch();
  }
}

export { Device as device };
