import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
  CameraPosition,
} from 'react-native-vision-camera';
import { HeaderButtonProps, HeaderButton, defaultRenderVisibleButton } from 'react-navigation-header-buttons';
import { MainStackScreenProps } from 'types/navigation';
import { useBottomSheet } from '@/components';
import { useTheme } from '@/hooks';
import Header from './Header';

const Scan = ({ navigation }: MainStackScreenProps) => {
  const { Layout, Fonts, Images, Common, Gutters } = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const device = useCameraDevice(cameraPosition);

  const { BottomSheet, bottomSheetModalRef } = useBottomSheet();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => <Header cameraPosition={cameraPosition} setCameraPosition={setCameraPosition} />,
    });
  }, [cameraPosition]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: string | any[]) => codes.length > 0 && handleScan(codes),
  });

  const handleScan = (codes: string | any[]) => {
    console.log('Scanned', JSON.stringify(codes, null, 2));
    const value = codes[0].value;
    if (value.startsWith('http://') || value.startsWith('https://')) {
      console.log('it is a url');
    } else if (/^wc:.+@.+\?.+/.test(value)) {
      console.log('it is a walletconnect uri');
      presentModal();
      // pair with walletconnect or reject
    }
  };

  const presentModal = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View style={[Layout.fill, Layout.fullWidth]}>
      {!hasPermission ? (
        <View style={[Layout.fill, Layout.center, Gutters.xxxlargeHPadding]}>
          <Image source={Images.common.cameraPermission} style={[Common.image]} />
          <Text style={[Fonts.titleSmall]}>Please allow camera permission to scan QR code!</Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={[Common.button.rounded, Gutters.xxxlargeVMargin, Gutters.xxxlargeHPadding]}>
            <Text style={[Fonts.buttonText]}>Allow Camera Permission</Text>
          </TouchableOpacity>
        </View>
      ) : device ? (
        <Camera codeScanner={codeScanner} isActive={true} device={device} style={Layout.fill} />
      ) : (
        <View style={[Layout.fill, Layout.center, Gutters.xxxlargeHPadding]}>
          <Image source={Images.common.cameraError} style={[Common.image]} />
          <Text style={Fonts.titleSmall}>
            Failed to access camera. Please make sure you have camera permission enabled and your camera is
            working properly.
          </Text>
        </View>
      )}
      <BottomSheet
        content={
          <View style={[Layout.fill, Gutters.xxxlargePadding]}>
            <Text style={[Fonts.titleSmall, Fonts.textCenter, Gutters.largeBMargin]}>
              Pair with WalletConnect?
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('pair');
              }}
              style={[Common.button.rounded, Gutters.largeVMargin, Gutters.largeHPadding]}>
              <Text style={[Fonts.buttonText]}>Pair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('reject');
              }}
              style={[Common.button.rounded, Gutters.largeHPadding]}>
              <Text style={[Fonts.buttonText]}>Reject</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Scan;

export type HeaderButtonsComponentType = React.ComponentType<HeaderButtonProps>;

export const MaterialHeaderButton: HeaderButtonsComponentType = props => {
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  return (
    <HeaderButton
      // the usual way to render:
      // IconComponent={MaterialIcons}
      // iconSize={23}
      // you can customize the colors, by default colors from React navigation theme will be used
      // pressColor="blue"
      {...props}
      // alternative way to customize what is rendered:
      renderButton={itemProps => {
        // access anything that was defined on <Item ... />
        const { color, iconName } = itemProps;

        return iconName ? (
          <MaterialIcons name={iconName} color={color} size={23} />
        ) : (
          // will render text with default styles
          defaultRenderVisibleButton(itemProps)
        );
      }}
    />
  );
};
