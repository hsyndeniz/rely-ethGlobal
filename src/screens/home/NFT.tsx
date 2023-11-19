import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@/hooks';

const Item = React.memo(({ token }: any) => {
  const { Colors, Fonts, MetricsSizes, Gutters, Layout } = useTheme();

  return (
    <View style={[Layout.fill, Gutters.smallPadding, styles.shadow]}>
      <ImageBackground
        resizeMode="cover"
        style={styles.card}
        imageStyle={{ borderRadius: MetricsSizes.xsmall }}
        source={require('@/theme/assets/images/space.jpeg')}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={[Layout.fill, styles.cover]}>
          <Text style={[Fonts.titleSmall, { color: Colors.white }]}>{token} Token</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
});

const NFT = React.memo(() => {
  const { Common, Fonts, Gutters, Layout } = useTheme();

  return (
    <View style={[Layout.fill, Layout.center]}>
      <FlatList
        numColumns={2}
        data={[1, 2, 3]}
        style={[Layout.fill, Layout.fullWidth, Gutters.smallPadding]}
        keyExtractor={item => item.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Item token={item} />}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
        ListFooterComponent={
          <View style={[Layout.center, Gutters.xxlargeVPadding]}>
            <Text style={Fonts.titleXSmall}>Don't see your asset?</Text>
            <TouchableOpacity style={[Common.button.base, Gutters.smallVPadding]}>
              <Text style={Fonts.buttonText}>Import NFT</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
});

export default NFT;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 96,
    borderRadius: 6,
  },
  cover: {
    borderRadius: 6,
    padding: 6,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5, // Increase shadow opacity for a stronger effect
    shadowRadius: 5, // Increase shadow radius for a larger spread
    elevation: 5, // Android-specific shadow
  },
});
