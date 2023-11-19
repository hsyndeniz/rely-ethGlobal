# Rely Wallet

## About The Project

Rely Wallet is a mobile wallet that allows you to store, send, and receive tokens on any EVM compatible blockchain. Rely also supports Solana. You can use Rely to connect to any dApp on Ethereum or Solana.

- Send and receive tokens on any EVM compatible blockchain and Solana.
- Connect to any dApp on Ethereum or Solana.
- View your transaction history on various blockchains.
- View and manage your NFTs on various blockchains.

Rely is completely open source and free to use. Rely is built with React Native and uses the Moralis Stream API to send push notifications to users when they make a transaction or receive any tokens. Rely uses AWS API Gateway, AWS Lambda, and AWS DynamoDB to store user data and send push notifications. Only the user's public address and unique device ID are stored in the database. The user's private key is never stored on the server. Our Lambda functions are written in Node.js and the Lambda functions are open source and can be found [here](https://github.com/hsyndeniz/rely-lambda-functions).

## Screenshots

<div align="center" style="width: auto; display: flex; flex-wrap: wrap; justify-content: center;">

</div>

## Getting Started

**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions until the "Creating a new application" step before proceeding.

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript bundler that ships with React Native.

To start Metro, run the following command from the root of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its own terminal. Open a new terminal from the root of your React Native project. Run the following command to start your Android or iOS app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in your Android Emulator or iOS Simulator shortly, provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

### Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For Android: Press the **R** key twice or select **"Reload"** from the **Developer Menu** (Ctrl + M on Windows and Linux or Cmd ⌘ + M on macOS) to see your changes!
3. For iOS: Hit Cmd ⌘ + R in your iOS Simulator to reload the app and see your changes!

## Congratulations! 🎉

You've successfully run and modified your React Native App. 🥳

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

## Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an overview of React Native and how to set up your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a guided tour of the React Native basics.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native blog posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source GitHub repository for React Native.
