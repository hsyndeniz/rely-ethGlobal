module.exports = {
  project: {
    android: {
      unstable_reactLegacyComponentNames: ['CameraView', 'CKCameraManager'],
    },
    ios: {
      unstable_reactLegacyComponentNames: ['CameraView', 'CKCamera'],
    },
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    '@react-native-clipboard/clipboard': {
      platforms: {
        android: null,
      },
    },
    'react-native-vision-camera': {
      platforms: {
        android: null,
      },
    },
    /**
     * Disable Flipper on production and CI envs
     */
    'react-native-flipper': {
      platforms: {
        ios: null,
      },
    },
  },
};
