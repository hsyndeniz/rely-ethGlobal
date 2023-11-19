import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { Easing } from 'react-native-reanimated';
import { DrawerScreenProps } from 'types/navigation';
import { initWalletConnect } from '@/services/walletconnect';
import { initPushProtocol } from '@/services/push';
import { initLensProtocol } from '@/services/lens';
import { useWallet } from '@/utils/wallet';
import { RootState } from '@/store';
import { useTheme } from '@/hooks';

const Startup = ({ navigation }: DrawerScreenProps) => {
  const { Colors, Gutters, Images, Layout } = useTheme();

  const initialized = useSelector((state: RootState) => state.wallet.initialized);
  const onboarding = useSelector((state: RootState) => state.wallet.onboarding);

  const value = new Animated.Value(1);
  const opacity = new Animated.Value(1);
  const lottieRef = useRef<LottieView>(null);

  const wallet = useWallet();

  useEffect(() => {
    console.log('wallet', wallet);
    if (wallet && wallet.address) {
      initLensProtocol();
      initPushProtocol(wallet);
      initWalletConnect(wallet);
    }
    playAnimation();
    return () => {
      value.removeAllListeners();
      opacity.removeAllListeners();
    };
  }, [wallet]);

  const playAnimation = () => {
    lottieRef.current?.play();

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        delay: 1600,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(value, {
        toValue: 3,
        delay: 1600,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => navigate());
  };

  const navigate = () => {
    if (!onboarding) {
      navigation.navigate('setup', { screen: 'onboarding' });
      return;
    }
    if (!initialized) {
      navigation.navigate('setup', { screen: 'welcome' });
      return;
    }
    navigation.navigate('main', { screen: 'login' });
  };

  return (
    <View style={[Layout.fill, { backgroundColor: Colors.background }]}>
      <Animated.View
        style={[
          Layout.fill,
          {
            transform: [{ scale: value }],
            opacity: opacity,
          },
        ]}>
        <LottieView
          source={require('@/theme/assets/lottie/4282528.lottie')}
          // source={require('@/theme/assets/lottie/4118891.lottie')}
          style={[Layout.fill, Gutters.xxlargeMargin]}
          autoPlay={true}
          loop={true}
          ref={lottieRef}
        />
      </Animated.View>
    </View>
  );
};

export default Startup;
