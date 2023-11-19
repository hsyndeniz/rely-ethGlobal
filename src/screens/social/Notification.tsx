import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import { channels, pushAPI, user } from '@/services/push';
import { notifyClient } from '@/services/walletconnect';
import { useWallet } from '@/utils/wallet';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

const Notification = () => {
  const wallet = useWallet();
  const { Colors, Common, Fonts, Images, Gutters, Layout } = useTheme();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [spamNotifications, setSpamNotifications] = useState<any[]>([]);
  const [webconnectNotifications, setWebconnectNotifications] = useState<any[]>([]);

  const initPush = async () => {
    try {
      const account = `eip155:1:${wallet?.address}`;
      const inboxNotifications = await pushAPI.notification.list('INBOX', { account });
      console.log('inboxNotifications', inboxNotifications.length);

      // List spam notifications
      const spams = await pushAPI.notification.list('SPAM', { account });
      console.log('spams', spams.length);
      setSpamNotifications(spams);

      const accountSubscriptions = notifyClient.getActiveSubscriptions({
        account: `eip155:1:${wallet?.address}`,
      });
      console.log('accountSubscriptions', accountSubscriptions.length);

      const topic = 'bed297fdd0a036f6a68c08daa0a70b9a61b60bf874450dabf2d0bb4a18e11abd';
      const messages = await notifyClient.getMessageHistory({ topic });
      console.log('messages', Object.keys(messages).length);
      console.log('notifications', notifications.length);
      const allMessages = Object.values(messages).map((message: any) => {
        return {
          notification: {
            title: message.message.title,
            body: message.message.body,
          },
          icon: message.message.icon,
          url: message.message.url,
          ...message,
        };
      });

      setNotifications([...inboxNotifications, ...allMessages]);

      // Push channel address
      const pushChannelAdress = '0x2f7662cD8E784750E116E44a536278d2b429167E';

      // Subscribe to push channel
      await pushAPI.notification.subscribe(
        `eip155:11155111:${pushChannelAdress}`, // channel address in CAIP format
      );

      // Send notification, provided userAlice has a channel
      // const response = await pushAPI.channel.send(["*"], {
      //   notification: {
      //     title: "You awesome notification",
      //     body: "from your amazing protocol",
      //   },
      // });

      // console.log(response);

      const channelInfo = await pushAPI.channel.info();
      console.log('channelInfo', channelInfo);

      const channelSubscribers = await channels.getSubscribers({
        channel: pushChannelAdress,
        env: ENV.STAGING,
      });
      console.log('channelSubscribers', channelSubscribers);

      const userSubscriptions = await user.getSubscriptions({
        env: ENV.STAGING,
        user: wallet?.address as string,
      });
      console.log('userSubscriptions', userSubscriptions);

      return inboxNotifications;
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    initPush();
  }, []);

  return (
    <View style={[Layout.fill, Layout.fullWidth, Layout.fullHeight]}>
      {notifications.length === 0 && (
        <View style={[Layout.fill, Layout.center, Gutters.xlargePadding]}>
          {/* <Instagram height={device.getDeviceHeight() * 0.4} /> */}
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
        // style={[Layout.fill, Layout.fullWidth]}
        // contentContainerStyle={[Layout.fill, Layout.fullWidth, Layout.fullHeight]}
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.url) {
                  Linking.openURL(item.url);
                } else {
                  console.log('no url');
                }
              }}
              style={[
                Layout.row,
                Layout.fullWidth,
                Gutters.smallPadding,
                Common.borderBottom,
                { borderBottomColor: Colors.border_01 },
              ]}>
              <View>
                <Image
                  source={{ uri: item.icon }}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: 48, height: 48 }}
                />
                <Image
                  source={Images.tokens.eth}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: 24, height: 24, position: 'absolute', bottom: -6, right: -6 }}
                />
              </View>
              <View style={[Layout.justifyContentCenter, Gutters.xlargeLPadding, Layout.largeWidth]}>
                <Text style={[Fonts.titleSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
                  {item.notification.title}
                </Text>
                <Text style={[Fonts.titleXSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
                  {item.notification.body}
                </Text>
              </View>
              <View style={[Layout.fill, Layout.row, Layout.justifyContentEnd, Layout.alignItemsCenter]}>
                <Entypo style={Fonts.textBold} name="chevron-right" size={24} color={Colors.text_02} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Notification;
