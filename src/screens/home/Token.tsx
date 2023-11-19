import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import { useTheme } from '@/hooks';
import { getTokenImage } from '@/theme/Images';

const Item = React.memo(({ token }: any) => {
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();

  return (
    <View
      style={[
        Layout.row,
        Layout.fullWidth,
        Gutters.xxsmallPadding,
        Common.borderBottom,
        { borderBottomColor: Colors.border_01 },
      ]}>
      <Image style={[Common.largeAvatar]} source={getTokenImage(token)} />
      <View style={[Layout.justifyContentCenter, Layout.alignItemsStart, Gutters.smallHPadding]}>
        <Text style={[Gutters.tinyVPadding, Fonts.titleSmall, Fonts.textBold]}>
          0.32 {token.toUpperCase()}
        </Text>
        <Text style={[Gutters.tinyVPadding, Fonts.titleXSmall]}>$40.323</Text>
      </View>
      <View style={[Layout.fill, Layout.row, Layout.justifyContentEnd, Layout.alignItemsCenter]}>
        <TouchableOpacity style={Gutters.smallHPadding}>
          <Entypo style={Fonts.textBold} name="chevron-right" size={24} color={Colors.text_02} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const Token = React.memo(() => {
  const { Common, Fonts, Gutters, Layout } = useTheme();

  return (
    <View style={[Layout.fill, Layout.center]}>
      <FlatList
        data={['eth', 'usdt', 'matic']}
        style={[Layout.fill, Layout.fullWidth]}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Item token={item} />}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        ListFooterComponent={
          <View style={[Layout.center, Gutters.xxlargeVPadding]}>
            <Text style={Fonts.titleXSmall}>Don't see your asset?</Text>
            <TouchableOpacity style={[Common.button.base, Gutters.smallVPadding]}>
              <Text style={Fonts.buttonText}>Import Token</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
});

export default Token;
