import React, { useState } from 'react';
import { Text, View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { OneSignal } from 'react-native-onesignal';
import { useTranslation } from 'react-i18next';
import { SetupStackParamList } from 'types/navigation';
import { Header, Toolbar } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type Props = NativeStackScreenProps<SetupStackParamList, 'notification-permission'>;

const Permission = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { Colors, Common, Fonts, Gutters, Images, Layout } = useTheme();

  const [loading, setLoading] = useState(false);

  const allow = async () => {
    try {
      setLoading(true);

      console.log('OneSignal: initialised');
      const hasPermission = OneSignal.Notifications.hasPermission();
      console.log('OneSignal: has permission:', hasPermission);
      if (hasPermission) {
        setLoading(false);
        navigation.navigate('get-started');
        return;
      }
      OneSignal.Notifications.requestPermission(true)
        .then(accepted => {
          console.log('OneSignal: accepted:', accepted);
          setLoading(false);
          navigation.navigate('get-started');
        })
        .catch(error => {
          console.log('OneSignal: error:', error);
          setLoading(false);
          navigation.navigate('get-started');
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      navigation.navigate('get-started');
    }
  };

  const skip = () => {
    navigation.navigate('get-started');
  };

  return (
    <View style={[Layout.fill, Layout.alignItemsCenter, Layout.justifyContentAround]}>
      <Header
        style={Layout.fill}
        title={t('welcome:permissions:enable')}
        subtitle={t('welcome:permissions:hint')}
      />

      <View style={[Layout.fill, Layout.center]}>
        <Image source={Images.common.notification} resizeMode="contain" style={styles.image} />
      </View>

      <View style={[Layout.fill, Layout.center]}>
        <TouchableOpacity
          style={[Common.button.rounded, Layout.mediumWidth, Gutters.smallVMargin]}
          onPress={allow}>
          {loading ? (
            <ActivityIndicator color={Colors.text_01} />
          ) : (
            <Text style={Fonts.buttonText}>{t('welcome:permissions:allow')}</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toolbar
        navigate={skip}
        disabled={false}
        keyboardAvoidingView={false}
        hint={t('welcome:permissions:hint')}
      />
    </View>
  );
};

export default Permission;

const styles = StyleSheet.create({
  image: {
    width: device.getDeviceWidth() / 1.5,
    alignSelf: 'center',
  },
});
