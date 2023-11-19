import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHeaderHeight } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AUTHENTICATION_TYPE } from 'react-native-keychain';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, TextInput, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { addEthereumWallet, addSolanaWallet, setBiometrics, setInitialised } from '@/store/wallet';
import { getSupportedBiometryType, storeCredentials } from '@/services/keychain';
import { getHDWallet, validateMnemonic } from '@/utils/wallet';
import { SetupStackParamList } from 'types/navigation';
import { Header, Toolbar } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type Props = NativeStackScreenProps<SetupStackParamList, 'import-mnemonic'>;

const Mnemonic = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Colors, Common, Gutters, Layout } = useTheme();

  const headerHeight = useHeaderHeight();
  const statusBarHeight = Number(StatusBar.currentHeight);
  const keyboardVerticalOffset = headerHeight + statusBarHeight;
  const iosStatusBarHeight = device.getStatusBarHeight();

  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const validPassword = password.length >= 6 && password === confirmPassword;
  const validMnemonic = validateMnemonic(mnemonic.trimStart().trimEnd());

  const [loading, setLoading] = useState(false);

  const navigate = async () => {
    try {
      const trimmedMnemonic = mnemonic.trimStart().trimEnd();
      setLoading(true);
      const biometryType = await getSupportedBiometryType();
      if (biometryType) {
        setLoading(false);
        navigation.navigate('biometric-permission', { mnemonic: trimmedMnemonic, password, biometryType });
      } else {
        const wallet = await getHDWallet(trimmedMnemonic);
        const credentials = await storeCredentials(
          trimmedMnemonic,
          password,
          AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        );
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset + Number(iosStatusBarHeight) : 0}
      contentContainerStyle={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}
      style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <Header title={t('welcome:import:title')} />

      <View style={[Layout.fill, Layout.center, Layout.largeWidth]}>
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVPadding]}>
          <TextInput
            value={mnemonic}
            multiline={true}
            numberOfLines={4}
            autoFocus={true}
            style={Common.textArea}
            placeholder={t('mnemonic')}
            placeholderTextColor={Colors.text_02}
            onChangeText={text => setMnemonic(text)}
          />
        </View>
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVPadding]}>
          <TextInput
            value={password}
            style={Common.textInput}
            secureTextEntry={passwordVisible}
            placeholderTextColor={Colors.text_02}
            placeholder={t('welcome:password:create')}
            onChangeText={text => setPassword(text)}
            hitSlop={{ top: 0, bottom: 48, left: 0, right: 0 }}
          />
          <View style={[Layout.absolute, Layout.right0]}>
            <TouchableOpacity
              style={[Layout.fill, Layout.center, Gutters.largeRPadding]}
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                color={Colors.text_01}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVMargin]}>
          <TextInput
            value={confirmPassword}
            style={Common.textInput}
            editable={password.length >= 6}
            secureTextEntry={confirmPasswordVisible}
            placeholderTextColor={Colors.text_02}
            placeholder={t('welcome:password:confirm')}
            onChangeText={text => setConfirmPassword(text)}
            hitSlop={{ top: 0, bottom: 48, left: 0, right: 0 }}
          />
          <View style={[Layout.absolute, Layout.right0]}>
            <TouchableOpacity
              style={[Layout.fill, Layout.center, Gutters.largeRPadding]}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons
                name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={password.length >= 6 ? Colors.text_01 : Colors.text_02}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toolbar
        navigate={navigate}
        loading={loading}
        keyboardAvoidingView={true}
        disabled={!validMnemonic || !validPassword}
        hint={t('welcome:import:description')}
      />
    </KeyboardAvoidingView>
  );
};

export default Mnemonic;
