/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.json'],
        alias: {
          '@': './src',
          types: './@types',
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
        },
      },
    ],
    'inline-dotenv',
    '@babel/plugin-transform-flow-strip-types', // flatlist getItem error related
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-proposal-class-properties',
    'react-native-reanimated/plugin', // needs to be last
  ],
};
