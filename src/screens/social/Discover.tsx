import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { notifyClient } from '@/services/walletconnect';
import { invertColor } from '@/theme/Fonts';
import { useWallet } from '@/utils/wallet';
import { pushAPI } from '@/services/push';
import { useTheme } from '@/hooks';
import LottieView from 'lottie-react-native';
import { device } from '@/utils/device';

const Discover = () => {
  const wallet = useWallet();
  console.log('discover wallet', wallet?.address);
  const { Colors, Common, Fonts, FontSize, Gutters, Layout, MetricsSizes } = useTheme();

  const [activeSubscriptions, setActiveSubscriptions] = useState<any>(
    notifyClient?.getActiveSubscriptions() || {},
  );
  const [activeChannels, setActiveChannels] = useState([]);

  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const projectId = process.env.WALLETCONNECT_PROJECT_ID || 'd122748298f9416e11d4671b4591f30e';
  const explorer = `https://explorer-api.walletconnect.com/v3/dapps?projectId=${projectId}&entries=10&page=1`;

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(explorer);
      const data = await res.json();

      let listings = Object.values(data.listings);
      console.log('listings', listings.length);

      const activeSubs = activeSubscriptions
        ? Object.values(activeSubscriptions).map((sub: any) => sub.metadata.name)
        : [];

      console.log('activeSubs', activeSubs);
      listings = listings.map((listing: any) => {
        console.log(listing);
        listing.source = 'walletconnect';
        listing.homepage = listing.url;
        if (listing.url?.startsWith('www')) {
          listing.homepage = 'https://' + listing.url;
        }
        listing.isSubscribed = isSubscribed(listing);
        return listing;
      });

      listings = listings.sort((a: any, b: any) => {
        if (activeSubs.includes(a.name) && !activeSubs.includes(b.name)) {
          return -1;
        }
        if (!activeSubs.includes(a.name) && activeSubs.includes(b.name)) {
          return 1;
        }
        return 0;
      });

      console.log('listings', listings.length);

      console.log('pushAPI', pushAPI);
      const userSubscriptions = await pushAPI.notification.subscriptions();

      setActiveChannels(userSubscriptions);
      console.log('userSubscriptions', userSubscriptions);

      let searchedChannels: any[] = await pushAPI.channel.search('rel', { page: 1, limit: 10 });

      searchedChannels = searchedChannels.map((channel: any) => {
        return { source: 'push', ...channel, isSubscribed: isSubscribed(channel) };
      });
      let allSubs = listings.concat(searchedChannels);
      allSubs = allSubs.sort((a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      allSubs = allSubs.sort((a: any, b: any) => {
        if (a.isSubscribed && !b.isSubscribed) {
          return -1;
        }
        if (!a.isSubscribed && b.isSubscribed) {
          return 1;
        }
        return 0;
      });

      setSubscriptions(allSubs);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const isSubscribed = (item: any) => {
    if (item.source === 'walletconnect') {
      return Object.values(activeSubscriptions).some((sub: any) => sub === item.name);
    } else {
      console.log(item.channel, activeChannels);
      return activeChannels.some((sub: any) => sub.channel.toLowerCase() === item.channel.toLowerCase());
    }
  };

  return (
    <View style={[Layout.fill, { backgroundColor: Colors.ui_02 }]}>
      {subscriptions.length === 0 && (
        <View style={[Layout.fill, Layout.center, Gutters.xlargePadding]}>
          <LottieView
            source={require('@/theme/assets/lottie/loading.lottie')}
            style={[
              Layout.fill,
              {
                // 4282528.lottie or 4118891.lottie
                width: device.getDeviceWidth() * 0.5,
                height: device.getDeviceWidth() * 0.5,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}
            autoPlay={true}
            loop={true}
          />
        </View>
      )}
      <FlatList
        data={subscriptions}
        style={[Layout.fill, Layout.fullWidth, Gutters.regularTPadding]}
        keyExtractor={(item: any, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: any) => {
          const color = Colors.positive_01;
          const colors = [];
          if (item.source === 'push') {
            colors.push('#AA076B');
            colors.push('#61045F');
          } else {
            if (item.metadata.colors.primary && item.metadata.colors.secondary) {
              invertColor(item.metadata.colors.primary)
                ? colors.push(item.metadata.colors.primary)
                : colors.push('#AA076B');
              colors.push(item.metadata.colors.secondary);
            } else {
              colors.push('#AA076B');
              colors.push('#61045F');
            }
          }
          return (
            <View style={[Layout.fill, Layout.center, Gutters.regularVPadding, Gutters.xlargeHPadding]}>
              <LinearGradient
                useAngle={true}
                angle={45}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={colors}
                style={[
                  Common.border,
                  Layout.fullWidth,
                  Layout.alignItemsStart,
                  Layout.justifyContentStart,
                  Gutters.xlargeBPadding,
                  {
                    maxHeight: MetricsSizes.xlarge * 10,
                    borderRadius: MetricsSizes.large,
                    paddingHorizontal: MetricsSizes.large,
                    borderColor: Colors.border_01,
                  },
                ]}>
                <View
                  style={[
                    Layout.mediumWidth,
                    {
                      height: MetricsSizes.xxlarge * 4.6,
                      paddingVertical: MetricsSizes.large,
                      gap: MetricsSizes.xsmall,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.titleRegular,
                      Fonts.textLeft,
                      {
                        fontSize: FontSize.regular,
                        color: Colors.white,
                      },
                    ]}>
                    {item.name} {item.source === 'push' ? ' 🔔' : '  📣'}
                  </Text>
                  <Text
                    style={[
                      Fonts.titleSmall,
                      Fonts.textLeft,
                      {
                        fontSize: FontSize.xsmall,
                        color: color,
                      },
                    ]}>
                    {/* {new URL(item.homepage).hostname} */}
                    {item.homepage}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={[
                      Fonts.textXSmall,
                      Fonts.textLeft,
                      Fonts.overflowHidden,
                      {
                        fontSize: FontSize.xsmall,
                        color: Colors.text_03,
                      },
                    ]}>
                    {item.source === 'push' ? item.info : item.description}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    Layout.row,
                    Common.zIndex,
                    Common.border,
                    Layout.center,
                    Layout.halfWidth,
                    Layout.alignSelfStart,
                    Gutters.smallPadding,
                    {
                      borderColor: Colors.border_02,
                      backgroundColor: Colors.ui_01,
                      borderRadius: MetricsSizes.xxlarge,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.textCenter,
                      Fonts.titleRegular,
                      {
                        color: !isSubscribed(item) ? Colors.text_01 : Colors.text_02,
                        fontSize: FontSize.xsmall,
                      },
                    ]}>
                    {!isSubscribed(item) ? 'Subscribe' : 'Subscribed   ✓  '}
                  </Text>
                  <Image
                    resizeMode="contain"
                    resizeMethod="resize"
                    source={
                      item.source === 'walletconnect'
                        ? require('../../theme/assets/images/wc3.png')
                        : require('../../theme/assets/images/push4.png')
                    }
                    style={{
                      height: MetricsSizes.regular * 2,
                      width: MetricsSizes.regular * 2,
                      marginLeft: MetricsSizes.small,
                      borderRadius: MetricsSizes.large,
                      opacity: isSubscribed(item) ? 0.7 : 1,
                    }}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: item.source === 'push' ? item.icon : item.image_url.lg }}
                  style={[
                    Common.zIndex,
                    Layout.absolute,
                    {
                      opacity: MetricsSizes.small / 10 + 1,
                      top: MetricsSizes.xlarge,
                      right: MetricsSizes.xlarge,
                      width: MetricsSizes.large * 10.6,
                      height: MetricsSizes.large * 10.6,
                      borderRadius: MetricsSizes.xxlarge,
                    },
                  ]}
                />
              </LinearGradient>
            </View>
          );
        }}
        contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
      />
    </View>
  );
};

export default Discover;
