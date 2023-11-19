import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Header, Toolbar } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

const GetStarted = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { Images, Layout } = useTheme();

  const ref = useRef<ConfettiCannon>(null);

  const getStarted = () => {
    navigation.navigate('main', { screen: 'login' });
  };

  return (
    <View style={[Layout.fill, Layout.center]}>
      <ConfettiCannon
        count={200}
        origin={{ x: 0, y: 0 }}
        ref={ref}
        autoStart={true}
        autoStartDelay={500}
        fadeOut={true}
        explosionSpeed={500}
      />
      <Header title={t('common:congratulations')} subtitle={t('welcome:getStarted:description')} />

      <View style={[Layout.fill, Layout.center]}>
        <LottieView source={Images.onboarding.wallet} autoPlay loop style={styles.image} />
      </View>

      <Toolbar
        navigate={getStarted}
        disabled={false}
        keyboardAvoidingView={false}
        hint={t('welcome:getStarted:description')}
      />
    </View>
  );
};

export default GetStarted;

const WIDTH = device.getDeviceWidth();

const styles = StyleSheet.create({
  image: {
    width: WIDTH,
    height: WIDTH / 1.6,
    maxHeight: WIDTH / 1.6,
  },
});
