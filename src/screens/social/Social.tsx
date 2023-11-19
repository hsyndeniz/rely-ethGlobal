/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { MainStackParamList } from 'types/navigation';
import { lensClient, urqlClient } from '@/services/lens';
import { useWallet } from '@/utils/wallet';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';
import { storage } from '@/store';
import Header from './Header';
import Discover from './Discover';
import Notification from './Notification';
import { PolyfillCrypto } from '../../../index';
import LottieView from 'lottie-react-native';
import { chatAPI, pushAPI } from '@/services/push';
import { IFeeds } from '@pushprotocol/restapi';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const Tabs = createBottomTabNavigator<any>();
const TopTabs = createMaterialTopTabNavigator();

type Props = NativeStackScreenProps<MainStackParamList, 'social'>;

const Social = ({ navigation }: Props) => {
  const { Colors, NavigationTheme } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Social',
      headerStyle: {
        backgroundColor: Colors.background,
      },
      headerRight: Header,
    });
  }, [NavigationTheme.dark]);

  return (
    <>
      <PolyfillCrypto />
      <Tabs.Navigator
        backBehavior="initialRoute"
        initialRouteName="feed"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: Colors.background, borderColor: Colors.border_01 },
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon({ color, focused, size }) {
            color = focused ? Colors.text_04 : Colors.text_01;

            if (route.name === 'feed') {
              return <AntDesign name="home" size={size} color={color} />;
            }
            if (route.name === 'discover') {
              return <Entypo name="globe" size={size} color={color} />;
            }
            if (route.name === 'notifications') {
              return <Ionicons name="notifications" size={size} color={color} />;
            }
            if (route.name === 'chat') {
              return <Entypo name="chat" size={size} color={color} />;
            }
          },
        })}>
        <Tabs.Screen name="feed" component={Feed} />
        <Tabs.Screen name="discover" component={Discover} />
        <Tabs.Screen name="notifications" component={Notification} />
        <Tabs.Screen name="chat" component={Chat} />
      </Tabs.Navigator>
    </>
  );
};

const Feed = () => {
  const wallet = useWallet();
  const { Colors, Common, Gutters, Fonts, Layout, MetricsSizes } = useTheme();

  const [profile, setProfile] = React.useState<any>(null);
  const [input, setInput] = React.useState('');
  const [posts, setPosts] = React.useState<any[]>([]);

  useEffect(() => {
    if (wallet && wallet.address) {
      signIn();
      // getProfiles();
    }
  }, [wallet?.address]);

  const signIn = async () => {
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: '0x2f7662cD8E784750E116E44a536278d2b429167E',
      for: '0x01ed42',
    });
    console.log('id', id);
    console.log('text', text);
    console.log('wallet', wallet?.address);
    const signature = await wallet?.signMessage(text);
    const authenticate = `mutation authenticate($request: SignedAuthChallenge!) {
        authenticate(request: $request) {
          accessToken
          refreshToken
        }
      }
    `;
    console.log('signature', signature);
    const auth = await urqlClient.mutation(
      authenticate,
      {
        request: {
          id,
          signature,
        },
      },
      {
        requestPolicy: 'network-only',
        fetchOptions: {
          cache: 'no-cache',
        },
      },
    );
    console.log('auth', auth);
    storage.set('accessToken', auth.data.authenticate.accessToken);
    storage.set('refreshToken', auth.data.authenticate.refreshToken);
    getProfiles();
  };

  const getProfiles = async () => {
    console.log(await storage.getString('accessToken'));
    const getProfile = `query profiles($request: ProfilesRequest!) {
        profiles(request: $request) {
            items {
                id
                ownedBy {
                    address
                    chainId
                }
                txHash
                createdAt
                stats {
                    id
                    followers
                    following
                    comments
                    posts
                    mirrors
                    quotes
                    publications
                    reactions
                    reacted
                    countOpenActions
                }
                operations {
                    id
                    isBlockedByMe {
                        value
                        isFinalisedOnchain
                    }
                    hasBlockedMe {
                        value
                        isFinalisedOnchain
                    }
                    isFollowedByMe {
                        value
                        isFinalisedOnchain
                    }
                    isFollowingMe {
                        value
                        isFinalisedOnchain
                    }
                    canBlock
                    canUnblock
                    canFollow
                    canUnfollow
                }
                interests
                guardian {
                    protected
                    cooldownEndsOn
                }
                invitedBy {
                    id
                    txHash
                    createdAt
                    interests
                    invitesLeft
                    signless
                    sponsor
                }
                invitesLeft
                onchainIdentity {
                    proofOfHumanity
                    ens {
                        name
                    }
                    sybilDotOrg {
                        verified
                        source {
                            twitter {
                                handle
                            }
                        }
                    }
                    worldcoin {
                        isHuman
                    }
                }
                followNftAddress {
                    address
                    chainId
                }
                metadata {
                    displayName
                    bio
                    rawURI
                    appId
                    attributes {
                        type
                        key
                        value
                    }
                    picture {
                        ... on ImageSet {
                            raw {
                                mimeType
                                width
                                height
                                uri
                            }
                            optimized {
                                mimeType
                                width
                                height
                                uri
                            }
                        }
                        ... on NftImage {
                            tokenId
                            verified
                            collection {
                                address
                                chainId
                            }
                            image {
                                raw {
                                    mimeType
                                    width
                                    height
                                    uri
                                }
                                optimized {
                                    mimeType
                                    width
                                    height
                                    uri
                                }
                            }
                        }
                    }
                    coverPicture {
                        raw {
                            mimeType
                            width
                            height
                            uri
                        }
                        optimized {
                            mimeType
                            width
                            height
                            uri
                        }
                    }
                }
                handle {
                    id
                    fullHandle
                    namespace
                    localName
                    suggestedFormatted {
                        full
                        localName
                    }
                    linkedTo {
                        contract {
                            address
                            chainId
                        }
                        nftTokenId
                    }
                    ownedBy
                }
                signless
                sponsor
                followModule {
                    ... on UnknownFollowModuleSettings {
                        type
                        followModuleReturnData
                        contract {
                            address
                            chainId
                        }
                    }
                    ... on FeeFollowModuleSettings {
                        type
                        recipient
                        contract {
                            address
                            chainId
                        }
                        amount {
                            asset {
                                ... on Erc20 {
                                    name
                                    symbol
                                    decimals
                                    contract {
                                        address
                                        chainId
                                    }
                                }
                            }
                            value
                        }
                    }
                    ... on RevertFollowModuleSettings {
                        type
                        contract {
                            address
                            chainId
                        }
                    }
                }
            }
            pageInfo {
                prev
                next
            }
        }
      }
    `;
    const profiles = await urqlClient.query(getProfile, {
      request: {
        where: {
          ownedBy: '0x2f7662cD8E784750E116E44a536278d2b429167E',
        },
      },
    });
    console.log('profiles', profiles);
    setProfile(profiles.data.profiles.items[0]);
    getFeed();
  };

  const getFeed = async () => {
    const feedReq = `query Feed($request: FeedRequest!) {
  feed(request: $request) {
    items {
      id
      root {
        ... on Post {
          ...PostFields
          __typename
        }
        ... on Comment {
          ...CommentFields
          __typename
        }
        ... on Quote {
          ...QuoteFields
          __typename
        }
        __typename
      }
      mirrors {
        by {
          ...PublicationProfileFields
          __typename
        }
        __typename
      }
      acted {
        by {
          ...PublicationProfileFields
          __typename
        }
        __typename
      }
      reactions {
        by {
          ...PublicationProfileFields
          __typename
        }
        __typename
      }
      comments {
        ...CommentBaseFields
        __typename
      }
      __typename
    }
    pageInfo {
      next
      __typename
    }
    __typename
  }
}

fragment PostFields on Post {
  id
  publishedOn {
    id
    __typename
  }
  isHidden
  isEncrypted
  momoka {
    proof
    __typename
  }
  txHash
  createdAt
  by {
    ...PublicationProfileFields
    __typename
  }
  stats {
    ...PublicationStatsFields
    __typename
  }
  operations {
    ...PublicationOperationFields
    __typename
  }
  metadata {
    ...AnyPublicationMetadataFields
    __typename
  }
  openActionModules {
    ...OpenActionModulesFields
    __typename
  }
  profilesMentioned {
    snapshotHandleMentioned {
      ...HandleInfoFields
      __typename
    }
    __typename
  }
  __typename
}

fragment PublicationProfileFields on Profile {
  id
  handle {
    ...HandleInfoFields
    __typename
  }
  ownedBy {
    ...NetworkAddressFields
    __typename
  }
  metadata {
    ...ProfileMetadataFields
    __typename
  }
  __typename
}

fragment HandleInfoFields on HandleInfo {
  fullHandle
  localName
  suggestedFormatted {
    localName
    __typename
  }
  linkedTo {
    nftTokenId
    __typename
  }
  __typename
}

fragment NetworkAddressFields on NetworkAddress {
  address
  chainId
  __typename
}

fragment ProfileMetadataFields on ProfileMetadata {
  displayName
  bio
  rawURI
  picture {
    ... on ImageSet {
      ...ImageSetFields
      __typename
    }
    ... on NftImage {
      image {
        optimized {
          uri
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  coverPicture {
    ...ImageSetFields
    __typename
  }
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  __typename
}

fragment ImageSetFields on ImageSet {
  optimized {
    uri
    __typename
  }
  __typename
}

fragment MetadataAttributeFields on MetadataAttribute {
  type
  key
  value
  __typename
}

fragment PublicationStatsFields on PublicationStats {
  id
  comments
  mirrors
  quotes
  reactions(request: {type: UPVOTE})
  countOpenActions
  bookmarks
  __typename
}

fragment PublicationOperationFields on PublicationOperations {
  isNotInterested
  hasBookmarked
  hasActed {
    value
    __typename
  }
  hasReacted(request: {type: UPVOTE})
  canComment
  canMirror
  hasMirrored
  hasQuoted
  __typename
}

fragment AnyPublicationMetadataFields on PublicationMetadata {
  ... on VideoMetadataV3 {
    ...VideoMetadataV3Fields
    __typename
  }
  ... on ArticleMetadataV3 {
    ...ArticleMetadataV3Fields
    __typename
  }
  ... on AudioMetadataV3 {
    ...AudioMetadataV3Fields
    __typename
  }
  ... on EmbedMetadataV3 {
    ...EmbedMetadataV3Fields
    __typename
  }
  ... on ImageMetadataV3 {
    ...ImageMetadataV3Fields
    __typename
  }
  ... on LinkMetadataV3 {
    ...LinkMetadataV3Fields
    __typename
  }
  ... on LiveStreamMetadataV3 {
    ...LiveStreamMetadataV3Fields
    __typename
  }
  ... on MintMetadataV3 {
    ...MintMetadataV3Fields
    __typename
  }
  ... on TextOnlyMetadataV3 {
    ...TextOnlyMetadataV3Fields
    __typename
  }
  __typename
}

fragment VideoMetadataV3Fields on VideoMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  asset {
    ...PublicationMetadataMediaVideoFields
    __typename
  }
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  title
  content
  __typename
}

fragment PublicationMetadataMediaVideoFields on PublicationMetadataMediaVideo {
  video {
    optimized {
      uri
      __typename
    }
    __typename
  }
  cover {
    optimized {
      uri
      __typename
    }
    __typename
  }
  __typename
}

fragment PublicationMetadataMediaFields on PublicationMetadataMedia {
  ... on PublicationMetadataMediaVideo {
    ...PublicationMetadataMediaVideoFields
    __typename
  }
  ... on PublicationMetadataMediaImage {
    ...PublicationMetadataMediaImageFields
    __typename
  }
  ... on PublicationMetadataMediaAudio {
    ...PublicationMetadataMediaAudioFields
    __typename
  }
  __typename
}

fragment PublicationMetadataMediaImageFields on PublicationMetadataMediaImage {
  image {
    optimized {
      uri
      __typename
    }
    __typename
  }
  __typename
}

fragment PublicationMetadataMediaAudioFields on PublicationMetadataMediaAudio {
  artist
  audio {
    optimized {
      uri
      __typename
    }
    __typename
  }
  cover {
    optimized {
      uri
      __typename
    }
    __typename
  }
  __typename
}

fragment ArticleMetadataV3Fields on ArticleMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  title
  content
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  __typename
}

fragment AudioMetadataV3Fields on AudioMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  asset {
    ...PublicationMetadataMediaAudioFields
    __typename
  }
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  title
  content
  __typename
}

fragment EmbedMetadataV3Fields on EmbedMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  embed
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  content
  __typename
}

fragment ImageMetadataV3Fields on ImageMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  asset {
    ...PublicationMetadataMediaImageFields
    __typename
  }
  title
  content
  __typename
}

fragment LinkMetadataV3Fields on LinkMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  content
  __typename
}

fragment LiveStreamMetadataV3Fields on LiveStreamMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  playbackURL
  liveURL
  title
  content
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  __typename
}

fragment MintMetadataV3Fields on MintMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  mintLink
  attachments {
    ...PublicationMetadataMediaFields
    __typename
  }
  content
  __typename
}

fragment TextOnlyMetadataV3Fields on TextOnlyMetadataV3 {
  id
  rawURI
  tags
  attributes {
    ...MetadataAttributeFields
    __typename
  }
  content
  __typename
}

fragment OpenActionModulesFields on OpenActionModule {
  ... on SimpleCollectOpenActionSettings {
    type
    contract {
      ...NetworkAddressFields
      __typename
    }
    amount {
      ...AmountFields
      __typename
    }
    collectLimit
    followerOnly
    recipient
    referralFee
    endsAt
    __typename
  }
  ... on MultirecipientFeeCollectOpenActionSettings {
    type
    contract {
      ...NetworkAddressFields
      __typename
    }
    amount {
      ...AmountFields
      __typename
    }
    collectLimit
    referralFee
    followerOnly
    endsAt
    recipients {
      recipient
      split
      __typename
    }
    __typename
  }
  ... on LegacyFreeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyFeeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyLimitedFeeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyLimitedTimedFeeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyRevertCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyTimedFeeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyMultirecipientFeeCollectModuleSettings {
    type
    contract {
      ...NetworkAddressFields
      __typename
    }
    amount {
      ...AmountFields
      __typename
    }
    collectLimit
    referralFee
    followerOnly
    endsAt
    recipients {
      recipient
      split
      __typename
    }
    __typename
  }
  ... on LegacySimpleCollectModuleSettings {
    type
    contract {
      ...NetworkAddressFields
      __typename
    }
    amount {
      ...AmountFields
      __typename
    }
    collectLimit
    followerOnly
    recipient
    referralFee
    endsAt
    __typename
  }
  ... on LegacyERC4626FeeCollectModuleSettings {
    type
    __typename
  }
  ... on LegacyAaveFeeCollectModuleSettings {
    type
    __typename
  }
  ... on UnknownOpenActionModuleSettings {
    type
    contract {
      ...NetworkAddressFields
      __typename
    }
    openActionModuleReturnData
    __typename
  }
  __typename
}

fragment AmountFields on Amount {
  asset {
    ...Erc20Fields
    __typename
  }
  value
  __typename
}

fragment Erc20Fields on Asset {
  ... on Erc20 {
    name
    symbol
    decimals
    contract {
      ...NetworkAddressFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  commentOn {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      ...CommentBaseFields
      __typename
    }
    ... on Quote {
      ...QuoteBaseFields
      __typename
    }
    __typename
  }
  __typename
}

fragment CommentBaseFields on Comment {
  id
  publishedOn {
    id
    __typename
  }
  isHidden
  isEncrypted
  momoka {
    proof
    __typename
  }
  txHash
  createdAt
  by {
    ...PublicationProfileFields
    __typename
  }
  stats {
    ...PublicationStatsFields
    __typename
  }
  operations {
    ...PublicationOperationFields
    __typename
  }
  metadata {
    ...AnyPublicationMetadataFields
    __typename
  }
  openActionModules {
    ...OpenActionModulesFields
    __typename
  }
  root {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Quote {
      ...QuoteBaseFields
      __typename
    }
    __typename
  }
  profilesMentioned {
    snapshotHandleMentioned {
      ...HandleInfoFields
      __typename
    }
    __typename
  }
  __typename
}

fragment QuoteBaseFields on Quote {
  id
  publishedOn {
    id
    __typename
  }
  isHidden
  isEncrypted
  momoka {
    proof
    __typename
  }
  txHash
  createdAt
  by {
    ...PublicationProfileFields
    __typename
  }
  stats {
    ...PublicationStatsFields
    __typename
  }
  operations {
    ...PublicationOperationFields
    __typename
  }
  metadata {
    ...AnyPublicationMetadataFields
    __typename
  }
  openActionModules {
    ...OpenActionModulesFields
    __typename
  }
  profilesMentioned {
    snapshotHandleMentioned {
      ...HandleInfoFields
      __typename
    }
    __typename
  }
  __typename
}

fragment QuoteFields on Quote {
  ...QuoteBaseFields
  quoteOn {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      ...CommentBaseFields
      __typename
    }
    ... on Quote {
      ...QuoteBaseFields
      __typename
    }
    __typename
  }
  __typename
    }`;
    const accessToken = await storage.getString('accessToken');
    const feed = await urqlClient.query(
      feedReq,
      {
        request: {
          where: {
            for: '0x01ed42',
            feedEventItemTypes: ['POST', 'COMMENT', 'COLLECT', 'COMMENT', 'MIRROR'],
          },
        },
      },
      {
        fetchOptions: {
          headers: {
            'user-agent': 'spectaql',
            'x-access-token': 'Bearer ' + accessToken,
          },
        },
      },
    );
    feed.data && setPosts(feed.data.feed.items);
  };

  const formatTimeSince = (date: Date): string => {
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minutes ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} days ago`;
    }
  };

  // TODO: highlight the mentions, hashtags, and links to make them pressable
  const renderPost = ({ item }: any) => {
    return (
      <View
        style={[
          Layout.fill,
          Layout.center,
          Layout.fullWidth,
          Gutters.smallVMargin,
          Common.border,
          {
            borderRadius: MetricsSizes.small,
            borderColor: Colors.border_01,
          },
        ]}>
        <View
          style={[
            Layout.row,
            Layout.fullWidth,
            Gutters.largePadding,
            Layout.alignItemsCenter,
            {
              backgroundColor: Colors.transparent,
            },
          ]}>
          <Image
            style={{ width: 48, height: 48, borderRadius: 24, alignSelf: 'center' }}
            source={{ uri: item.root.by.metadata?.picture?.optimized?.uri }}
          />
          <View style={[Layout.col, Layout.center, Gutters.regularLPadding, { gap: 2 }]}>
            <Text
              style={[
                Fonts.titleSmall,
                Fonts.textLeft,
                Layout.fullWidth,
                {
                  color: Colors.text_01,
                },
              ]}>
              {item.root.by.metadata?.displayName}
            </Text>
            <View style={[Layout.row, Layout.center]}>
              <Text
                style={[
                  Fonts.titleSmall,
                  Fonts.textLeft,
                  {
                    color: Colors.positive_01,
                  },
                ]}>
                @{item.root.by.handle?.localName}
              </Text>
              <Text style={[Fonts.titleSmall, Fonts.textLeft]}>
                {` · ${formatTimeSince(new Date(item.root.createdAt))}`}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            Layout.fullWidth,
            Gutters.xlargeHPadding,
            Gutters.largeVPadding,
            Common.borderTop,
            {
              borderTopColor: Colors.border_01,
            },
          ]}>
          <Text
            style={[
              Fonts.titleSmall,
              Gutters.largeVPadding,
              {
                color: Colors.text_01,
              },
            ]}>
            {item.root.metadata.content}
          </Text>
          {item.root.metadata.__typename === 'ImageMetadataV3' && (
            <Image
              style={{ width: '100%', height: 200, borderRadius: 8 }}
              source={{ uri: item.root.metadata.asset.image.optimized.uri }}
            />
          )}
        </View>
        <View
          style={[
            Layout.row,
            Layout.fullWidth,
            Layout.justifyContentAround,
            Common.borderTop,
            Gutters.largePadding,
            {
              borderTopColor: Colors.border_01,
            },
          ]}>
          <View style={Layout.rowCenter}>
            <Ionicons name="heart-outline" size={18} color={Colors.text_01} style={Gutters.smallRPadding} />
            <Text style={[Fonts.titleSmall, Fonts.textLeft, { color: Colors.text_02 }]}>
              Like {item.root.stats.reactions > 0 && `(${item.root.stats.reactions})`}
            </Text>
          </View>
          <View style={Layout.rowCenter}>
            <MaterialCIcons name="comment" size={18} color={Colors.text_01} style={Gutters.smallRPadding} />
            <Text style={[Fonts.titleSmall, Fonts.textLeft, { color: Colors.text_02 }]}>
              Comment {item.root.stats.comments > 0 && `(${item.root.stats.comments})`}
            </Text>
          </View>
          <View style={Layout.rowCenter}>
            <Ionicons name="share" size={18} color={Colors.text_01} style={Gutters.smallRPadding} />
            <Text style={[Fonts.titleSmall, Fonts.textLeft, { color: Colors.text_02 }]}>
              Share {item.root.stats.mirrors > 0 && `(${item.root.stats.mirrors})`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[Layout.fill, Layout.alignItemsCenter]}>
      {posts.length > 0 ? (
        <FlatList
          style={[Layout.fullWidth]}
          contentContainerStyle={[Layout.fullWidth, Gutters.xlargeHPadding]}
          data={posts}
          // eslint-disable-next-line react/no-unstable-nested-components
          ListHeaderComponent={() => {
            return profile ? (
              <View
                style={[
                  Layout.rowCenter,
                  Layout.fullWidth,
                  Gutters.xlargePadding,
                  { maxHeight: device.getDeviceHeight() * 0.14 },
                ]}>
                {profile.metadata.picture && (
                  <Image
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      marginRight: 16,
                      borderWidth: 2,
                      borderColor: Colors.text_02,
                    }}
                    source={{ uri: profile.metadata.picture.optimized.uri }}
                  />
                )}
                <View
                  style={[
                    Layout.fill,
                    Layout.center,
                    Layout.fullHeight,
                    Common.border,
                    Gutters.smallPadding,
                    {
                      borderRadius: MetricsSizes.large,
                      borderColor: Colors.border_01,
                    },
                  ]}>
                  <TextInput
                    value={input}
                    onChangeText={setInput}
                    textAlign="left"
                    placeholder="What's on your mind?"
                    placeholderTextColor={Colors.text_02}
                    style={[Layout.fullWidth, Fonts.textRegular, { color: Colors.text_01 }]}
                  />
                </View>
              </View>
            ) : (
              <Text style={Fonts.titleRegular}>Loading...</Text>
            );
          }}
          renderItem={renderPost}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={[Layout.fill, Layout.center, Gutters.xlargePadding]}>
          {/* <Instagram height={device.getDeviceHeight() * 0.4} /> */}
          <LottieView
            source={require('@/theme/assets/lottie/multichain.lottie')}
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
    </View>
  );
};

const Chat = () => {
  const { Colors, Common, Gutters, Fonts, Layout, MetricsSizes } = useTheme();

  return (
    <View style={[Layout.fill, Layout.fullWidth]}>
      <TopTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.text_01,
          tabBarInactiveTintColor: Colors.text_02,
          tabBarStyle: { backgroundColor: Colors.blurred_bg },
          tabBarIndicatorStyle: { backgroundColor: Colors.text_04 },
          tabBarLabelStyle: { textTransform: 'capitalize' },
        }}>
        <TopTabs.Screen name="chats" component={Chats} />
        <TopTabs.Screen name="requests" component={ChatRequest} />
      </TopTabs.Navigator>
    </View>
  );
};

export default Social;

const Chats = () => {
  const wallet = useWallet();
  const navigation = useNavigation<any>();

  const { Gutters, Fonts, Layout, Common, Colors } = useTheme();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('chat');
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      if (wallet) {
        const chat = await chatAPI(wallet);
        setConversations(chat.chats);
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[Layout.fill, Layout.center]}>
        <LottieView
          source={require('@/theme/assets/lottie/multichain.lottie')}
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
    );
  }

  return conversations.length === 0 ? (
    <View style={[Layout.fill, Layout.center]}>
      <Text style={[Fonts.titleRegular, Gutters.largeVPadding]}>No chats yet</Text>
      <Image source={require('@/theme/assets/images/empty-chat.png')} style={{ width: 200, height: 200 }} />
    </View>
  ) : (
    <FlatList
      data={conversations}
      keyExtractor={(item, index) => item.chatId || index.toString()}
      renderItem={({ item }: { item: IFeeds }) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('main', { screen: 'chat', params: { chat: item } });
          }}
          style={[
            Layout.row,
            Layout.fullWidth,
            Gutters.smallPadding,
            Common.borderBottom,
            { borderBottomColor: Colors.border_01 },
          ]}>
          <View>
            <Image source={{ uri: item.profilePicture }} style={{ width: 48, height: 48 }} />
          </View>
          <View style={[Layout.justifyContentCenter, Gutters.xlargeLPadding, Layout.largeWidth]}>
            <Text style={[Fonts.titleSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
              {item.intent?.split(':')[1].substring(0, 4)}...{item.intent?.split(':')[1].substring(38)}
            </Text>
            <Text style={[Fonts.titleXSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
              {item.msg.messageObj?.content}
            </Text>
          </View>
          <View style={[Layout.fill, Layout.row, Layout.justifyContentEnd, Layout.alignItemsCenter]}>
            <Entypo style={Fonts.textBold} name="chevron-right" size={24} color={Colors.text_02} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const ChatRequest = () => {
  const wallet = useWallet();
  const { Gutters, Fonts, Layout, Common, Colors } = useTheme();

  const [chatRequests, setChatRequests] = useState<any[]>([]);

  useEffect(() => {
    console.log('chat');
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      console.log('fetchChats', wallet?.address);
      if (wallet) {
        const chat = await chatAPI(wallet);
        console.log(chat.requests.length);
        setChatRequests(chat.requests);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return chatRequests.length === 0 ? (
    <View style={[Layout.fill, Layout.center]}>
      <Text style={[Fonts.titleRegular, Gutters.largeVPadding]}>No chat requests</Text>
      <Image source={require('@/theme/assets/images/empty-chat.png')} style={{ width: 200, height: 200 }} />
    </View>
  ) : (
    <FlatList
      data={chatRequests}
      keyExtractor={(item, index) => item.chatId || index.toString()}
      renderItem={({ item }: { item: IFeeds }) => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Accept chat request?', '', [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('cancel');
                  // pushAPI.chat.reject(item.chatId as string);
                },
                style: 'cancel',
              },
              {
                text: 'Accept',
                onPress: async () => {
                  try {
                    pushAPI.chat.accept(item.chatId as string);
                    console.log('item', item);
                  } catch (error) {
                    console.log('error', error);
                  }
                },
              },
            ]);
          }}
          style={[
            Layout.row,
            Layout.fullWidth,
            Gutters.smallPadding,
            Common.borderBottom,
            { borderBottomColor: Colors.border_01 },
          ]}>
          <View>
            <Image source={{ uri: item.profilePicture }} style={{ width: 48, height: 48 }} />
          </View>
          <View style={[Layout.justifyContentCenter, Gutters.xlargeLPadding, Layout.largeWidth]}>
            <Text style={[Fonts.titleSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
              {item.intent?.split(':')[1].substring(0, 4)}...{item.intent?.split(':')[1].substring(38)}
            </Text>
            <Text style={[Fonts.titleXSmall, Fonts.textLeft, Fonts.overflowHidden, Gutters.tinyVMargin]}>
              {item.msg.messageObj?.content}
            </Text>
          </View>
          <View style={[Layout.fill, Layout.row, Layout.justifyContentEnd, Layout.alignItemsCenter]}>
            <Entypo style={Fonts.textBold} name="chevron-right" size={24} color={Colors.text_02} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};
