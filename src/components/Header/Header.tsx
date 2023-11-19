import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import makeBlockie from 'ethereum-blockies-base64';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ImageData, getNounData } from '@nouns/assets';
import { SvgXml } from 'react-native-svg';
import { buildSVG } from '@nouns/sdk';
import { RootState } from '@/store';
import { useTheme } from '@/hooks';
import { useBottomSheet } from '@/components';

const seed = {
  background: 0,
  body: 22,
  accessory: 29,
  head: 63,
  glasses: 2,
};
const { parts, background } = getNounData(seed);
console.log('parts', parts);
console.log('background', background);
const { bgcolors, palette, images } = ImageData;
const svgBinary = buildSVG(parts, palette, background);

const Header = ({ scan, social }: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();
  const { BottomSheet, bottomSheetModalRef } = useBottomSheet();

  const eth_wallets = useSelector((state: RootState) => state.wallet.ethereum.wallets);
  const sol_wallets = useSelector((state: RootState) => state.wallet.solana.wallets);

  const selected_eth_wallet = useSelector((state: RootState) => state.wallet.active_ethereum_wallet);
  const selected_sol_wallet = useSelector((state: RootState) => state.wallet.active_solana_wallet);

  let eth_wallet = eth_wallets[selected_eth_wallet];
  let sol_wallet = sol_wallets[selected_sol_wallet];

  return (
    <View
      style={[
        Layout.row,
        Layout.top0,
        Layout.fullWidth,
        Common.borderBottom,
        Gutters.largeHPadding,
        Gutters.smallVPadding,
        { backgroundColor: Colors.background, borderBottomColor: Colors.border_01 },
      ]}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={{ overflow: 'hidden', borderRadius: 6 }}>
        {/* <Image style={Common.avatar} source={{ uri: makeBlockie(eth_wallet?.address) }} /> */}
        <SvgXml xml={svgBinary} width={48} height={48} />
      </TouchableOpacity>
      <View style={[Layout.col, Layout.justifyContentCenter, Gutters.largeHPadding]}>
        <Text style={[Fonts.titleSmall, Fonts.textLeft]}>
          {eth_wallet?.address.slice(0, 6) + '...' + eth_wallet?.address.slice(-4)}
        </Text>
        <Text style={[Fonts.titleSmall, Fonts.textLeft]}>{'Polygon Mumbai'}</Text>
      </View>
      <View style={[Layout.fill, Layout.row, Layout.justifyContentEnd, Layout.alignItemsCenter]}>
        <TouchableOpacity style={Gutters.smallHPadding}>
          <Ionicons style={Fonts.textBold} name="copy-outline" size={24} color={Colors.text_01} />
        </TouchableOpacity>
        <TouchableOpacity style={Gutters.smallHPadding} onPress={scan}>
          <Ionicons style={Fonts.textBold} name="scan" size={24} color={Colors.text_01} />
        </TouchableOpacity>
        <TouchableOpacity style={Gutters.smallHPadding} onPress={social}>
          <Ionicons style={Fonts.textBold} name="chatbox-outline" size={24} color={Colors.text_01} />
        </TouchableOpacity>
      </View>
      <BottomSheet content={<Text style={[Fonts.titleRegular]}>Hello</Text>} />
    </View>
  );
};

export default Header;
