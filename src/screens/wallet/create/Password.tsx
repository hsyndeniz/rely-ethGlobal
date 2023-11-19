import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, TextInput, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { getSupportedBiometryType } from '@/services/keychain';
import { SetupStackParamList } from 'types/navigation';
import { Header, Toolbar } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type Props = NativeStackScreenProps<SetupStackParamList, 'create-password'>;

const Password = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { Colors, Common, Gutters, Layout } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const validPassword = password.length >= 6 && password === confirmPassword;

  const [biometryType, setBiometryType] = useState<string | null>(null);

  useEffect(() => {
    checkBiometry();
  }, []);

  const checkBiometry = useCallback(async () => {
    const type = await getSupportedBiometryType();
    setBiometryType(type);
  }, [biometryType]);

  const navigate = () => {
    navigation.navigate('generate-mnemonic', { password, biometryType });
  };

  const headerHeight = useHeaderHeight();
  const statusBarHeight = StatusBar.currentHeight;
  const keyboardVerticalOffset = headerHeight + statusBarHeight!;
  const iosStatusBarHeight = device.getStatusBarHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardVerticalOffset + Number(iosStatusBarHeight) : 0}
      contentContainerStyle={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}
      style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <Header title={t('welcome:password:create')} />

      <View style={[Layout.fill, Layout.center, Layout.largeWidth]}>
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVPadding]}>
          <TextInput
            value={password}
            autoFocus={true}
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
        <View style={[Layout.center, Layout.fullWidth, Layout.rowVCenter, Gutters.smallVPadding]}>
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
        disabled={!validPassword}
        keyboardAvoidingView={true}
        hint={t('welcome:password:hint')}
      />
    </KeyboardAvoidingView>
  );
};

export default Password;
