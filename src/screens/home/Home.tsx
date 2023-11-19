import React, { useEffect } from 'react';
import { BackHandler, Image, Share, StyleSheet, Text, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { MainStackScreenProps } from 'types/navigation';
import { Navbar, useBottomSheet } from '@/components';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';
import Token from './Token';
import NFT from './NFT';
import { useWallet } from '@/utils/wallet';

const Home = ({ navigation }: MainStackScreenProps) => {
  const wallet = useWallet();
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();
  const { BottomSheet, bottomSheetModalRef } = useBottomSheet();

  const [navigationState, setNavigationState] = React.useState({
    index: 0,
    routes: [
      { key: 'token', title: 'Tokens' },
      { key: 'nft', title: 'NFTs' },
    ],
  });

  useEffect(() => {
    console.log('Home mounted');
    console.log('Home navigation', navigation);
    BackHandler.addEventListener('hardwareBackPress', () => false);
  }, []);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={[styles.tabbar, { borderBottomColor: Colors.border_01 }]}
      activeColor={Colors.icon_04}
      indicatorStyle={{ backgroundColor: Colors.icon_04 }}
      // eslint-disable-next-line react-native/no-inline-styles
      labelStyle={[Fonts.titleSmall, { textTransform: 'none' }]}
    />
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'token':
        return <Token />;
      case 'nft':
        return <NFT />;
      default:
        return null;
    }
  };

  const goToScan = () => {
    navigation.navigate('scan');
  };

  const goToSocial = () => {
    navigation.navigate('social');
  };

  return (
    <View style={[Layout.fill, Layout.center]}>
      <Navbar scan={goToScan} social={goToSocial} />
      <View style={[Layout.fullWidth]}>
        {/* <Image
          source={require('@/theme/assets/images/global-eth.png')}
          style={{
            opacity: 0.2,
            position: 'absolute',
            top: 0,
            right: -30,
            width: 160,
            height: 160,
            //backgroundColor: 'red',
          }}
        /> */}
        <LinearGradient
          useAngle={true}
          angle={45}
          start={{ x: 0, y: 0 }} // Start at top-left
          end={{ x: 0, y: 1 }} // End at bottom
          // start={{ x: 0, y: 0 }} // Start at top-left
          // end={{ x: 1, y: 1 }} // End at bottom-right
          // style={StyleSheet.absoluteFill}
          // colors={['#D300B5', '#FF5400']}
          // colors={['#1565C0', '#b92b27']}
          // colors={['#4158D0', '#C850C0', '#FFCC70']}
          // colors={['#0088CC', '#00C08B']} // solana
          // colors={['#0F4B6E', '#6A0572']} // eth
          colors={['#480048', '#C04848']}
          style={[
            Gutters.xxlargeVPadding,
            {
              justifyContent: 'flex-start',
              borderRadius: 20,
              alignSelf: 'center',
              marginTop: 20,
              width: device.getDeviceWidth() - 40,
            },
          ]}>
          <View style={[Gutters.xxlargePadding, Common.zIndex, Layout.center]}>
            <Text style={[Gutters.smallVPadding, Fonts.textCenter, Fonts.titleRegular, Fonts.textShadow]}>
              10.435 ETH
            </Text>
            <Text style={[Gutters.xxlargeHPadding, Fonts.textCenter, Fonts.titleSmall, Fonts.textShadow]}>
              $40.323
            </Text>
          </View>
          <Image source={require('@/theme/assets/images/eth_coins.png')} style={styles.cover} />
        </LinearGradient>
      </View>
      <View
        style={[
          Layout.fullWidth,
          Layout.row,
          Layout.justifyContentAround,
          Gutters.xlargeVPadding,
          Gutters.xlargeHPadding,
        ]}>
        <View style={Layout.center}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.interactive_02,
              borderRadius: 12,
              width: 64,
              height: 64,
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('@/theme/assets/images/send-money.png')}
              style={{ width: 54, height: 54 }}
            />
          </TouchableOpacity>
          <Text style={Fonts.titleXSmall}>Send</Text>
        </View>
        <View style={Layout.center}>
          <TouchableOpacity
            onPress={() => bottomSheetModalRef.current?.present()}
            style={{
              backgroundColor: Colors.interactive_02,
              borderRadius: 12,
              width: 64,
              height: 64,
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={require('@/theme/assets/images/wallet-4.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
          <Text style={Fonts.titleXSmall}>Receive</Text>
        </View>
        <View style={Layout.center}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.interactive_02,
              borderRadius: 12,
              width: 64,
              height: 64,
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('@/theme/assets/images/credit-card-5.png')}
              style={{ width: 44, height: 44 }}
            />
          </TouchableOpacity>
          <Text style={Fonts.titleXSmall}>Buy</Text>
        </View>
        <View style={Layout.center}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.interactive_02,
              borderRadius: 12,
              width: 64,
              height: 64,
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={require('@/theme/assets/images/reload.png')} style={{ width: 42, height: 42 }} />
          </TouchableOpacity>
          <Text style={Fonts.titleXSmall}>Swap</Text>
        </View>
        <View style={Layout.center}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.interactive_02,
              borderRadius: 12,
              width: 64,
              height: 64,
              marginBottom: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('@/theme/assets/images/loop-arrow.png')}
              style={{ width: 48, height: 48 }}
            />
          </TouchableOpacity>
          <Text style={Fonts.titleXSmall}>Bridge</Text>
        </View>
      </View>
      <TabView
        swipeEnabled={true}
        navigationState={navigationState}
        sceneContainerStyle={[Layout.fill, { backgroundColor: Colors.background }]}
        pagerStyle={[Layout.fill, { backgroundColor: Colors.background }]}
        style={[Layout.fill, Layout.fullWidth]}
        renderTabBar={renderTabBar}
        initialLayout={{ width: device.getDeviceWidth() }}
        onIndexChange={index => setNavigationState({ ...navigationState, index })}
        renderScene={renderScene}
      />
      <BottomSheet
        content={
          <View style={[Layout.fill, Layout.alignItemsCenter, Layout.fullWidth, Layout.justifyContentStart]}>
            <View
              style={[
                Layout.rowCenter,
                Layout.fullWidth,
                Layout.alignSelfStart,
                Layout.justifyContentAround,
                Gutters.xxlargeTPadding,
              ]}>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fvxwti%2Flogo%2F1678645512720_Screen%20Shot%202023-03-12%20at%2011.25.01%20AM.png',
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  opacity: 0.9,
                  marginLeft: 6,
                }}
              />
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fpn953%2Flogo%2F1680188467903_aVevg5nN_400x400.jpeg',
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  opacity: 0.9,
                }}
              />
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fne1ef%2Flogo%2F1664911892604_ens.png',
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  opacity: 0.9,
                  marginLeft: 6,
                }}
              />
              <Image
                source={{
                  uri: 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/28/cb/53/28cb5353-2c7f-355e-1332-959a933e79ce/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/460x0w.webp',
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  opacity: 0.9,
                  marginLeft: 6,
                }}
              />
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2F3zpxc%2Fimages%2Fapple-touch-icon%20(1).png',
                }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 6,
                  opacity: 1,
                  marginLeft: 6,
                }}
              />
            </View>
            <Text style={{ color: Colors.text_01, paddingVertical: 24 }}>
              All your Web 3.0 identities in one place.{'\n'}
            </Text>
            <QRCode
              size={200}
              value={wallet.address}
              logoSize={70}
              logoBackgroundColor={Colors.background}
              logoBorderRadius={35}
              logoMargin={0}
              backgroundColor={Colors.background}
              color={Colors.text_01}
              logo={require('@/theme/assets/images/tokens/eth.png')}
            />
            <TouchableOpacity
              onPress={() => {
                Share.open({
                  title: 'My Wallet Address',
                  message: wallet.address,
                });
              }}
              style={{
                backgroundColor: Colors.positive_01,
                margin: 24,
                height: 36,
                width: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name="share-social-sharp" size={24} color={Colors.text_01} />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  tabbar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 2,
    backgroundColor: 'transparent',
  },
  cover: {
    opacity: 0.4,
    position: 'absolute',
    top: 0,
    right: -20,
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});
