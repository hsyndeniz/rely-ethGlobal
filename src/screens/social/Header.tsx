import React, { useEffect } from 'react';
import {
  Item,
  HeaderButton,
  HeaderButtons,
  HeaderButtonsComponentType,
} from 'react-navigation-header-buttons';
import { ImageData, getNounData } from '@nouns/assets';
import { SvgXml } from 'react-native-svg';
import { buildSVG } from '@nouns/sdk';
import { Image, Text, View } from 'react-native';
import { useBottomSheet } from '@/components';
import { useTheme } from '@/hooks';
import { cacheExchange, createClient, fetchExchange } from 'urql';

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getNounData(seed);
console.log('parts', parts);
console.log('background', background);
const { bgcolors, palette, images } = ImageData;
const svgBinary = buildSVG(parts, palette, background);

const Header = ({ navigation }: any) => {
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();
  const { BottomSheet, bottomSheetModalRef } = useBottomSheet();

  const [nextID, setNextID] = React.useState<any>(null);

  useEffect(() => {
    const getID = `query Identity {
        identity(platform: "twitter", identity: "huseyindeniz_") {
            status
            uuid
            platform
            identity
            displayName
            profileUrl
            avatarUrl
            createdAt
            addedAt
            updatedAt
            neighbor {
                sources
                identity {
                    status
                    uuid
                    platform
                    identity
                    displayName
                    profileUrl
                    avatarUrl
                    createdAt
                    addedAt
                    updatedAt
                    nft {
                        uuid
                        source
                        transaction
                        id
                        createdAt
                        updatedAt
                        category
                        chain
                        address
                        symbol
                        fetcher
                    }
                    ownedBy {
                        status
                        uuid
                        platform
                        identity
                        displayName
                        profileUrl
                        avatarUrl
                        createdAt
                        addedAt
                        updatedAt
                    }
                    neighborWithTraversal {
                        uuid
                        source
                        createdAt
                        updatedAt
                        fetcher
                    }
                    neighbor {
                        sources
                    }
                }
            }
            nft {
                uuid
                source
                transaction
                id
                createdAt
                updatedAt
                category
                chain
                address
                symbol
                fetcher
            }
            ownedBy {
                status
                uuid
                platform
                identity
                displayName
                profileUrl
                avatarUrl
                createdAt
                addedAt
                updatedAt
            }
            neighborWithTraversal {
                uuid
                source
                createdAt
                updatedAt
                fetcher
            }
        }
    }`;

    const client = createClient({
      exchanges: [cacheExchange, fetchExchange],
      url: 'https://relation-service.next.id/',
      requestPolicy: 'network-only',
    });

    client
      .query(getID, {})
      .toPromise()
      .then(result => {
        console.log('result', result);
      })
      .catch(error => {
        console.log('error', error);
      });

    fetch('https://proof-service.next.id/v1/proof?platform=twitter&identity=huseyindeniz_')
      .then(response => response.json())
      .then(data => {
        console.log('data', JSON.stringify(data));
        setNextID(data);
      });
  }, []);

  return (
    <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
      <BottomSheet
        content={
          <View style={[Layout.fill, Layout.center]}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fpn953%2Flogo%2F1680188467903_aVevg5nN_400x400.jpeg',
              }}
              style={{ width: 64, height: 64 }}
            />
            <Text style={{ color: Colors.text_01 }}>All your Web 3.0 identities in one place.{'\n'}</Text>
          </View>
        }
      />
      <Item
        title="profile"
        color={'#ffffff'}
        iconName="user-circle"
        onPress={() => bottomSheetModalRef.current?.present()}
      />
    </HeaderButtons>
  );
};

const MaterialHeaderButton: HeaderButtonsComponentType = props => {
  return (
    <HeaderButton
      // the usual way to render:
      // IconComponent={MaterialIcons}
      // iconSize={24}
      // you can customize the colors, by default colors from React navigation theme will be used
      // pressColor="blue"
      {...props}
      // alternative way to customize what is rendered:
      renderButton={itemProps => {
        // access anything that was defined on <Item ... />
        const { color, iconName } = itemProps;
        if (iconName === 'user-circle') {
          console.log('user-circle');
          return (
            <View style={{ borderRadius: 12, overflow: 'hidden' }}>
              <SvgXml xml={svgBinary} width={24} height={24} style={{ borderRadius: 12 }} />
            </View>
          );
        }
      }}
    />
  );
};

export default Header;
