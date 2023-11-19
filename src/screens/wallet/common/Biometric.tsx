import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Keychain from 'react-native-keychain';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { addEthereumWallet, addSolanaWallet, setBiometrics, setInitialised } from '@/store/wallet';
import { storeCredentials } from '@/services/keychain';
import { SetupStackParamList } from 'types/navigation';
import { Header, Toolbar } from '@/components';
import { getHDWallet } from '@/utils/wallet';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type Props = NativeStackScreenProps<SetupStackParamList, 'biometric-permission'>;

const WIDTH = device.getDeviceWidth();

const Bimetrics = ({ navigation, route }: Props) => {
  const { mnemonic, password, biometryType } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { Colors, Common, Fonts, Gutters, Images, Layout } = useTheme();

  const [loading, setLoading] = useState(false);

  const handlePermission = async (authenticationType: Keychain.AUTHENTICATION_TYPE) => {
    try {
      setLoading(true);
      const credentials = await storeCredentials(mnemonic, password, authenticationType);
      console.log(credentials);
      const wallet = await getHDWallet(mnemonic);
      console.log(wallet);
      dispatch(setInitialised(true));
      dispatch(setBiometrics(authenticationType === Keychain.AUTHENTICATION_TYPE.BIOMETRICS));
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
    } catch (error) {
      console.error(error);
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Keychain error! Please try again',
        text2: 'Please contact support if the problem persists',
      });
    }
  };

  return (
    <View style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <Header
        style={Layout.fill}
        title={t('welcome:biometrics:title', { biometryType })}
        subtitle={t('welcome:biometrics:description', { biometryType })}
      />

      <View style={[Layout.fill, Layout.center]}>
        <LottieView source={Images.onboarding.secure} autoPlay loop style={styles.lottie} />
      </View>

      <View style={[Layout.fill, Layout.center]}>
        <TouchableOpacity
          style={[Common.button.rounded, Layout.mediumWidth, Gutters.smallVMargin]}
          disabled={loading}
          onPress={() => handlePermission(Keychain.AUTHENTICATION_TYPE.BIOMETRICS)}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.text_01} />
          ) : (
            <Text style={Fonts.buttonText}>{t('welcome:biometrics:title', { biometryType })}</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toolbar
        disabled={loading}
        keyboardAvoidingView={true}
        navigate={() => handlePermission(Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS)}
        hint={t('welcome:biometrics:description', { biometryType })}
      />
    </View>
  );
};

export default Bimetrics;

const styles = StyleSheet.create({
  lottie: {
    width: WIDTH,
    height: WIDTH / 1.6,
    maxHeight: WIDTH / 1.6,
  },
});
