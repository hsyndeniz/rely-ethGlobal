import React, { useCallback, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Keychain from 'react-native-keychain';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { addEthereumWallet, addSolanaWallet, setBiometrics, setInitialised } from '@/store/wallet';
import { SetupStackParamList } from 'types/navigation';
import { storeCredentials } from '@/services/keychain';
import { getHDWallet, generateSeed } from '@/utils/wallet';
import { Header, Toolbar } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type FooterProps = { mnemonic: string };

const Footer = ({ mnemonic }: FooterProps) => {
  const { t } = useTranslation();
  const { Colors, Fonts, Gutters, Layout } = useTheme();

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(mnemonic);
    console.log('copied to clipboard', mnemonic);
    Toast.show({
      type: 'success',
      text1: t('common:copiedToClipboard'),
      position: 'top',
      topOffset: device.getToastOffset(),
    });
  }, [mnemonic]);

  return (
    <TouchableOpacity onPress={copyToClipboard} style={[Layout.rowCenter, Gutters.xxlargePadding]}>
      <Ionicons name="copy-outline" size={24} color={Colors.text_01} />
      <Text style={[Fonts.titleSmall, Gutters.largeLPadding, { color: Colors.text_01 }]}>
        {t('common:copyToClipboard')}
      </Text>
    </TouchableOpacity>
  );
};

const Loading = () => {
  const { Colors, Layout } = useTheme();

  return (
    <View style={[Layout.fill, Layout.center]}>
      <ActivityIndicator size="large" color={Colors.text_01} />
    </View>
  );
};

type RecoveryPhrasesListProps = { mnemonic: string };

const RecoveryPhrasesList = ({ mnemonic }: RecoveryPhrasesListProps) => {
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();

  return (
    <FlatList
      data={mnemonic.split(' ')}
      style={Layout.fullWidth}
      contentContainerStyle={[Layout.justifyContentBetween, Gutters.regularPadding]}
      renderItem={({ item, index }) => (
        <View style={[Common.button.chip, Gutters.xsmallMargin]}>
          <Text style={[Layout.center, Fonts.titleSmall, Gutters.smallHPadding]}>{index + 1}</Text>
          <View style={[Layout.fill, Layout.center]}>
            <Text style={[Fonts.titleSmall, { color: Colors.text_01 }]}>{item}</Text>
          </View>
        </View>
      )}
      numColumns={2}
      ListFooterComponent={<Footer mnemonic={mnemonic} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

type Props = NativeStackScreenProps<SetupStackParamList, 'generate-mnemonic'>;

const Mnemonic = ({ navigation, route }: Props) => {
  const { password, biometryType } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Layout } = useTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [mnemonic, setMnemonic] = useState<string>('');

  useEffect(() => {
    createWallet();
  }, []);

  const createWallet = useCallback(async () => {
    try {
      const secrets = generateSeed();
      setMnemonic(secrets.mnemonic);
      console.log(secrets);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const navigate = async () => {
    try {
      if (biometryType) {
        navigation.navigate('biometric-permission', { mnemonic, password, biometryType });
      } else {
        setLoading(true);
        const credentials = await storeCredentials(
          mnemonic,
          password,
          Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        );
        const wallet = await getHDWallet(mnemonic);
        console.log(wallet);
        console.log(credentials);
        dispatch(setInitialised(true));
        dispatch(setBiometrics(false));
        dispatch(
          addSolanaWallet({
            publicKey: wallet.solana.publicKey,
            privateKey: wallet.solana.secretKey,
            balance: 0,
          }),
        );
        dispatch(
          addEthereumWallet({
            address: wallet.ethereum.address,
            privateKey: wallet.ethereum.privateKey,
            balance: 0,
          }),
        );
        setLoading(false);
        navigation.navigate('notification-permission');
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Keychain error! Please try again',
        text2: 'Please contact support if the problem persists',
      });
    }
  };

  return (
    <View style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <Header title={t('welcome:mnemonic:title')} />
      <View style={[Layout.fill, Layout.center, Layout.fullWidth]}>
        {loading ? <Loading /> : <RecoveryPhrasesList mnemonic={mnemonic} />}
      </View>
      <Toolbar
        navigate={navigate}
        disabled={loading}
        keyboardAvoidingView={true}
        hint={t('welcome:mnemonic:description')}
      />
    </View>
  );
};

export default Mnemonic;
