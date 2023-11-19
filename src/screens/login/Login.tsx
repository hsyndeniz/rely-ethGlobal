import React, { useEffect, useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Switch, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BIOMETRY_TYPE, AUTHENTICATION_TYPE } from 'react-native-keychain';
import { getCredentials, getSupportedBiometryType } from '@/services/keychain';
import { MainStackScreenProps } from 'types/navigation';
import { setBiometrics } from '@/store/wallet';
import { device } from '@/utils/device';
import { RootState } from '@/store';
import { useTheme } from '@/hooks';

const Login = ({ navigation }: MainStackScreenProps) => {
  const { Common, Colors, Images, Fonts, Gutters, Layout } = useTheme();
  const { t } = useTranslation('login');
  const dispatch = useDispatch();
  const lottieRef = useRef<LottieView>(null);
  const [password, setPassword] = useState('');
  const [biometryType, setBiometryType] = useState<BIOMETRY_TYPE | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const biometryEnabled = useSelector((state: RootState) => state.wallet.biometrics);

  useEffect(() => {
    const fetchBiometryType = async () => {
      const supportedBiometryType = await getSupportedBiometryType();
      setBiometryType(supportedBiometryType);
    };
    fetchBiometryType();
  }, []);

  const toggleBiometry = () => {
    dispatch(setBiometrics(!biometryEnabled));
  };

  const unlock = useCallback(
    (authenticationType: AUTHENTICATION_TYPE) => {
      lottieRef.current?.play();
      getCredentials(authenticationType)
        .then(credentials => {
          if (credentials) {
            // TODO: ecnrypt / decrypt wallet
            // out animation
            navigation.navigate('tabs', { screen: 'home' });
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    },
    [biometryEnabled, biometryType],
  );

  return (
    <KeyboardAvoidingView
      behavior={device.isIos() ? 'padding' : 'height'}
      contentContainerStyle={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}
      style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <View style={[Layout.fill, Layout.center, Layout.fullWidth]}>
        <LottieView
          loop={true}
          autoPlay={false}
          ref={lottieRef}
          style={styles.lottie}
          source={Images.lottie.wallet}
        />
      </View>
      <View style={[Layout.fill, Layout.center, Layout.largeWidth]}>
        <Text style={[Fonts.titleXSmall, Layout.alignSelfStart]}>{t('password')}</Text>
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVPadding]}>
          <TextInput
            autoFocus={true}
            value={password}
            style={Common.textInput}
            secureTextEntry={!passwordVisible}
            placeholderTextColor={Colors.text_02}
            placeholder={t('password')}
            onChangeText={setPassword}
            hitSlop={{ top: 0, bottom: 48, left: 0, right: 0 }}
          />
          <View style={[Layout.absolute, Layout.right0]}>
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              hitSlop={{ top: 0, bottom: 48, left: 0, right: 0 }}
              style={[Layout.fill, Layout.center, Gutters.largeRPadding]}>
              <Ionicons
                name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                color={Colors.text_01}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        {biometryType && (
          <View
            style={[
              Layout.row,
              Layout.fullWidth,
              Gutters.smallHPadding,
              Gutters.regularVPadding,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <Text style={[Fonts.titleSmall]}>{t('signInWith', { provider: biometryType })}</Text>
            <Switch
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              onValueChange={toggleBiometry}
              value={biometryEnabled}
            />
          </View>
        )}
        <View style={[Layout.rowCenter, Layout.fullWidth]}>
          <TouchableOpacity
            style={[Common.button.rounded, Gutters.xxlargeVMargin, Gutters.xxxlargeHPadding]}
            onPress={() => unlock(AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS)}>
            <Text style={[Fonts.buttonText]}>{t('unlockWallet')}</Text>
          </TouchableOpacity>
          {biometryType && biometryEnabled && (
            <TouchableOpacity
              style={[Common.button.rounded, Gutters.xxlargeVMargin, Gutters.regularLMargin]}
              onPress={() => unlock(AUTHENTICATION_TYPE.BIOMETRICS)}>
              {biometryType === BIOMETRY_TYPE.FACE_ID ? (
                <MCIcons name="face-recognition" color={Colors.text_01} size={20} />
              ) : (
                <MCIcons name="fingerprint" color={Colors.text_01} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={[Gutters.xxlargeBMargin, Fonts.buttonText]}>{t('forgotPassword')}</Text>
    </KeyboardAvoidingView>
  );
};

const WIDTH = device.getDeviceWidth();

const styles = StyleSheet.create({
  lottie: {
    top: 0,
    position: 'absolute',
    width: WIDTH * 0.6,
    maxWidth: WIDTH * 0.6,
    height: WIDTH * 0.6,
    maxHeight: WIDTH * 0.6,
  },
});

export default Login;
