import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createWeb3Modal, defaultWagmiConfig, W3mButton, Web3Modal } from '@web3modal/wagmi-react-native';
import { mainnet, polygon, arbitrum } from 'viem/chains';
import { WagmiConfig } from 'wagmi';
import { SetupStackScreenProps } from 'types/navigation';
import { pair } from '@/services/walletconnect';
import { device } from '@/utils/device';
import { Header } from '@/components';
import { useTheme } from '@/hooks';

// 1. Get projectId
const projectId = process.env.WALLETCONNECT_PROJECT_ID || '';

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

const chains = [mainnet, polygon, arbitrum];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
});

const WIDTH = device.getDeviceWidth();

const Welcome = ({ navigation }: SetupStackScreenProps) => {
  const { t } = useTranslation();
  const { Fonts, Common, Colors, Gutters, Images, Layout } = useTheme();

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

  const createWallet = () => {
    backHandler.remove();
    navigation.navigate('create-password');
  };

  const importWallet = () => {
    // backHandler.remove();
    navigation.navigate('import-mnemonic');
    // const walletConnect = WalletConnect.get();
    // pair({
    //   uri: 'wc:1dff711d122b2111718306215dc310dfdd2d405dde091365e4ace95fd3395ae7@2?relay-protocol=irn&symKey=f2d4482078fa4ba951899bcd586ede8b2b5332e7f25e8a115cbc74e82a3d3c07',
    // });
  };

  useEffect(() => {
    // disconnect();
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <View style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
        <Header title={t('welcome:wallet:title')} subtitle={t('welcome:wallet:description')} />
        <Image source={Images.wallet.wallet} style={{ width: WIDTH * 0.6, height: WIDTH * 0.6 }} />

        <View style={[Layout.center, Layout.fullWidth]}>
          <TouchableOpacity
            onPress={createWallet}
            style={[Common.button.rounded, Layout.mediumWidth, Gutters.smallVMargin]}>
            <Text style={Fonts.buttonText}>{t('welcome:wallet:create')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={importWallet}
            style={[Common.button.rounded, Layout.mediumWidth, Gutters.smallVMargin]}>
            <Text style={Fonts.buttonText}>{t('welcome:wallet:import')}</Text>
          </TouchableOpacity>
          <W3mButton
            label="Connect with WalletConnect"
            connectStyle={[
              Common.border,
              Common.button.rounded,
              Layout.mediumWidth,
              Gutters.smallVMargin,
              {
                backgroundColor: Colors.ui_03,
                borderColor: Colors.border_01,
              },
            ]}
          />
        </View>
      </View>
      <Web3Modal />
    </WagmiConfig>
  );
};

export default Welcome;
