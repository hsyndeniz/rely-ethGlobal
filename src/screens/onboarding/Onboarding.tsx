import React from 'react';
import { BackHandler, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { SetupStackScreenProps } from 'types/navigation';
import { setOnboarding } from '@/store/wallet';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

const OnboardingScreen = ({ navigation }: SetupStackScreenProps) => {
  const { t } = useTranslation('onboarding');
  const dispatch = useDispatch();
  const { Colors, Images } = useTheme();

  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

  const onDone = () => {
    backHandler.remove();
    dispatch(setOnboarding(true));
    navigation.navigate('welcome');
  };

  return (
    <Onboarding
      skipToPage={5}
      onDone={onDone}
      containerStyles={{ backgroundColor: Colors.background }}
      imageContainerStyles={{ backgroundColor: Colors.background }}
      titleStyles={{ color: Colors.text_01 }}
      subTitleStyles={{ color: Colors.text_02 }}
      bottomBarColor={Colors.background}
      pages={[
        {
          backgroundColor: Colors.background,
          image: <LottieView source={Images.onboarding.wallet} autoPlay loop style={styles.lottie} />,
          title: t('title1'),
          subtitle: t('subtitle1'),
        },
        {
          backgroundColor: Colors.background,
          image: <LottieView source={Images.onboarding.multiChain} autoPlay loop style={styles.lottie} />,
          title: t('title2'),
          subtitle: t('subtitle2'),
        },
        {
          backgroundColor: Colors.background,
          image: <LottieView source={Images.onboarding.secure} autoPlay loop style={styles.lottie} />,
          title: t('title3'),
          subtitle: t('subtitle3'),
        },
        {
          backgroundColor: Colors.background,
          image: <Image source={Images.onboarding.browser} style={styles.image} resizeMode="contain" />,
          title: t('title4'),
          subtitle: t('subtitle4'),
        },
        {
          backgroundColor: Colors.background,
          image: <LottieView source={Images.onboarding.defi} autoPlay loop style={styles.lottie} />,
          title: t('title5'),
          subtitle: t('subtitle5'),
        },
        {
          backgroundColor: Colors.background,
          image: <LottieView source={Images.onboarding.nft} autoPlay loop style={styles.lottie} />,
          title: t('title6'),
          subtitle: t('subtitle6'),
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const WIDTH = device.getDeviceWidth();

const styles = StyleSheet.create({
  image: {
    width: WIDTH / 1.8,
    height: WIDTH / 1.8,
  },
  lottie: {
    width: WIDTH,
    height: WIDTH / 1.6,
    maxHeight: WIDTH / 1.6,
  },
});
