import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import RNFS from 'react-native-fs';
import { ethers } from 'ethers';
import { useTheme } from '@/hooks';

import { JsBridgeNativeHost } from '@onekeyfe/onekey-cross-webview';
import type {
  IJsBridgeReceiveHandler,
  IJsBridgeMessagePayload,
  IJsonRpcRequest,
} from '@onekeyfe/cross-inpage-provider-types';
import { getCredentials } from '@/services/keychain';
import { AUTHENTICATION_TYPE } from 'react-native-keychain';
import { getHDWallet } from '@/utils/wallet';

const Browser = ({ navigation }: any) => {
  const { Layout } = useTheme();

  const webviewRef = React.useRef<WebView>(null);

  const [url, setUrl] = useState<string>('https://opensea.io/');
  const [injected, setInjected] = useState<string | undefined>();

  useEffect(() => {
    // webviewRef.current?.injectJavaScript(
    // setUrl('https://lab.web3modal.com/library/wagmi/');
    setUrl('https://hsyndeniz.github.io/test-dapp-vconsole/');
    webviewRef.current?.reload();
    // setUrl('https://solsea.io/');
    if (Platform.OS === 'android') {
      RNFS.readFileAssets('injected')
        .then(res => setInjected(res))
        .catch(err => console.log(err));
    } else {
      RNFS.readFile(RNFS.MainBundlePath + '/injected')
        .then(res => setInjected(res))
        .catch(err => console.log(err));
    }
  }, []);

  const renderError = useCallback(
    (domain: string | undefined, code: number, description: string) => {
      // create a custom error component and allow the user to reload the page or go home
      return (
        <View>
          <Text>{domain}</Text>
          <Text>{code}</Text>
          <Text>{description}</Text>
        </View>
      );
    },
    [url],
  );

  const receiveHandler = useCallback<IJsBridgeReceiveHandler>(
    async (payload: IJsBridgeMessagePayload, hostBridge) => {
      // const result = await backgroundApiProxy.bridgeReceiveHandler(payload);
      console.log('receiveHandler', JSON.stringify(payload, null, 2));
      // console.log('receiveHandler', hostBridge);
      const { id, data } = payload as IJsBridgeMessagePayload;
      const { method, params } = data as IJsonRpcRequest;
      if (method === 'eth_requestAccounts') {
        console.log('eth_requestAccounts', payload);
        console.log(params);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: ['0x2f7662cd8e784750e116e44a536278d2b429167e'],
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'eth_accounts') {
        console.log('eth_accounts', payload);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: ['0x2f7662cd8e784750e116e44a536278d2b429167e'],
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'metamask_getProviderState') {
        console.log('metamask_getProviderState', payload);
        console.log(params);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: {
              accounts: ['0x2f7662cd8e784750e116e44a536278d2b429167e'],
              chainId: '0x1',
              networkVersion: '1',
              isUnlocked: true,
            },
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'getActiveChain') {
        console.log('getActiveChain', payload);
        console.log(params);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: {},
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'wallet_sendSiteMetadata') {
        console.log('wallet_sendSiteMetadata', payload);
      } else if (method === 'eth_chainId') {
        console.log('eth_chainId', payload);
        console.log(params);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: '0x1',
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'hasPermissions') {
        // TODO: sui network
        console.log('SUI network: hasPermissions');
      } else if (method === 'net_version') {
        console.log('net_version', payload);
        console.log(params);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: '1',
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'eth_getBlockByNumber') {
        console.log('eth_getBlockByNumber', payload);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: {
              baseFeePerGas: '0x9b9fa275f',
              difficulty: '0x0',
              extraData: '0x546974616e2028746974616e6275696c6465722e78797a29',
              gasLimit: '0x1c9c364',
              gasUsed: '0xa18df3',
              hash: '0x80dbcb9235b0ba88c224bd1f0005a231053a12df74571cc18228bec15e6f3da0',
              logsBloom:
                '0x1c63d446458ea0009108809584631429a450935069d11d4508e1024a94328ca3141d10101119a9539313392800c0e55822252691eeee7691a0000448e07d68d4120a895a40349d68eb1a4a6995a801e0822c260d77e4d910c0880801827c32445fb40210675700241015f88106acad4824a462bc54b1045076055d5080c809430ac1454244691d482751256504228d06410137816b090c1862c0104400965426bbebd961558860c6d7105a839e86df5886926c11a492310b5db5284e824cf0f5290ae7c3089e84630172c2a161ac1054f075260217283b9053442a061207a45006daa08940bfc3c19bec134621e02a090909d091000f2146417c88a20343946b',
              miner: '0x70d5ccc14a1a264c05ff48b3ec6751b0959541aa',
              mixHash: '0xc6a9d818a3b3f739896d5ecbdb9da2df6f069978b28fa1b5c32c7d6eb83cadc5',
              nonce: '0x0000000000000000',
              number: '0x119f818',
              parentHash: '0x7826193148a365cb2e51a3ca1bf87b349b629205d622298bca3589a14db6e27d',
              receiptsRoot: '0x6d96d2572c08b59f7a0783943b7eac4b72bb14d5018a575692bf3684ad0c636a',
              sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
              size: '0x2828c',
              stateRoot: '0xb5dde8754c2e016c440a47098be18076b944376c020692fc85ddeafa70de9225',
              timestamp: '0x65429c9f',
              totalDifficulty: '0xc70d815d562d3cfa955',
              transactions: [
                '0xd315a3544727e1a37b4bce851820b2b37a5c23dbea6e757ca46ac291c4253a4a',
                '0xe8928d4b58dbf4a852d97daacb292b4a2c78e9fe864c7554bde62408d85f3b48',
                '0xbec68477d90a604be9b7a67c024031eb92dbb3e3965a5e9cd8072ced6b541fac',
                '0x953b93cac3bea4b7a0def55a7a32f1cc4808e25e63d921e533191d42051e7d69',
                '0xd8b4027898602ec89210ee748c4d0673a3cbbdf5005648ed16def0593a81c932',
                '0x9953da2f11e6e664e3ed2921ce6ef9b156f0ebe9f5f14519ae7fc36ab0c94d92',
                '0x4fb64e0dd9aa4437b5924b8a035731bd135345e2ca8e17c82945c68e0b866342',
                '0x4daee078c13f58b1f7b7fdf50c7ebadcb7908dda8a0bdcd0904d8f8bee9961d1',
                '0xafc3ed68eb013231c360246fabdc1fa99a492afc5cdff0112b5d3b51d61bc1b5',
                '0x174a9dd01450af09e0c860cae69b473a4669e08084732e88f00bcdd78d582674',
                '0x2aa0b920286d7ad5e43ba7e2a46c8276931bc25e2f8973afd47eac5935b86991',
                '0x0e840a5cb4930c86b6e89eb11fc8728f259c9820d3ec79bf9137aae9e227913b',
                '0x7259701b20eb74c44c6d4f78804ace098e3c69baace57602c98e210871676bed',
                '0x4c790ddb3f7f85b5f233c48713d162cd2d671d29bb3651a81358e040ad393258',
                '0x068d87eebfd8872c90a940541b42640bea5ac5e8c41f0bf655b7d44a4070258a',
                '0xaa9e7c1bc86f1b8d1c901597fcf2fd484d4d968ddf923bfbfb70ab6941563647',
                '0x8dccc3f6ac62efe23e9ebebd9016d642814bad64e2da6bcaea8839567fd88d06',
                '0x11411c9d6883b88ecf542b60f852d09da5868ca908b4b56028fc1748342c9e1a',
                '0x03e9a699aa4ff397cd9a2e1c37e2c3243e484abda30b3a6ac8e2a6bd24bd165c',
                '0xc156920a23a3a9b02fb4e6afe5fd7b5c2495b96c056810d69c608366cf8a7bde',
                '0xe3a23af153455c67e0980dc6e31bec0d1ccb2927c592bbf08613d24944c7bece',
                '0xd265c865f73bcb39805719be4d7c90bb5f69858e570d65a41adfd55fcd7d17f8',
                '0x5e777ee830b99002e5b87dbd99b50fad1a20981ac3e3ffd044bb483bce1d85ff',
                '0x00f9f14e54e4f931d98756d024c15087bbbe1b489e113c907c3e502a29a413f2',
                '0x6619c9126eebe1d43b96c9c9576e9885e8d4de5e670b3700b5074eb3e9ffa627',
                '0x1903d39d6690177a5e1ac3501b46acb3e4a85410369e79d559f054f08ad5cf66',
                '0xe8e3597487d7b7594d5ea83d2770d7085f9e7ca47d874faf5d3f8fe70c174ab3',
                '0xa20d49ddaf349b6732ffc07e647d292d1cfb3fa917ca5b681bffe72d984d0fe6',
                '0x66f0b0f6136e86b418867034cb11b1678489a04a1cca66c2450fd808b0898757',
                '0x3060a9e6eebe50f48223c60f2b00d1881d553629fccba514aca6712f41799de4',
                '0x280d3a2e3e28bd15b51b6ada76200cabf5bf54c800e68395f2b63dbb60324f99',
                '0x3579e77d3d64eb5f8024bb35270c412166ea2241a711eeb7d2f13ab96c6dd6c8',
                '0x12ff674512a22dfbd1638f8fe2ebf87ef3e22d0808cda8bbfda6c52998140036',
                '0xf7aa94522e34d50e90bb1728e262e53bfa7a3ea52324663f919238c0efff8282',
                '0xa9a0e71dff8e253ae7bbc5afd870c96f4c6a78b69759be413aa24c3ce09c6be1',
                '0xb7c9a2b1be0e4dfc002a9791b6368ca4aab246aba586e92e0f40518e250049f8',
                '0x718d03e6b0065ea9dda24833673ab1d523429b18c94ade8758c5c2eca0c3621b',
                '0x247a3083ec224b92076a8ae04b41bbcbdeba912a6ea534cda05239297709b966',
                '0x24ce3a0ed2e3281cd9c6625f0a88836661ec78aadbec6575dc6d4b99aab6aeb5',
                '0x6acd54305ba95b4a1c13beda99b7c4445fa05436516bddddc038ab718dc68a5a',
                '0x1db6701a174c567e47dc902fa66e8e29242d26c3a8b7b37a05df9717465ba28a',
                '0x5730f82ac50130be4caab13d84bc22dbfa26f9ae1b3a8c12023ec88b0c23a8f9',
                '0x51b03554ee50dd8ca44cc4ba72b583fcbdd71788e8f5abb586b2ff97e6b2364a',
                '0xd1188e51d4bebf3ceab630d6c913238c2f0756d6f5c0c4269b73dfad72cd73bc',
                '0x0b0c5995e105eae038fe7dfde67e061d0ae19b652a955b905cc7355e9b9eeeee',
                '0x14fdd3fa48311c96e09c1faef995c92662b2240ec6ab70ee1ce0067aaf1d1257',
                '0xd6043caf6e1f81acc8c5983d4f872a4bff174855144f3f7663a2108ae1ff3ef3',
                '0xb78eb1bbb9eb614bc2a94dddc4a30d742d567ef8ace73779ed9309bab48c3e3b',
                '0x9e3f204c6c1e504eba3ced0fc807d8d4a001591fd17c2edf4aff754563c5f2fe',
                '0x4afd4b21c6ee7c8136f905ca83b1ba20c155ffb045f8ddf9344b028a304c6f55',
                '0xf32841d114c31f9e5c2dd2138a144a0f81508ebc83d513a8733be3d1a095ead2',
                '0x4dc9cba6de118c8ff94438a4c4ca9ac22d911d4507d6f3e0a2f0d91e36d193fa',
                '0x6bf032fba2be54399b091c12753921a9ecce33748acd4f5c03e6c66815f3baf9',
                '0xfc3edbca1f87a9f1cab39f0e66d62420a2aec861e46d3e377640e8810eec07ee',
                '0x4e45bb24db27cf869580dffe80f9701a2b7938ab9e7a31db21725e5a91946d66',
                '0xd665321f93e63d10d48252b3d386cc6f3f07ea0879836aafe6bb74ed6780a0f1',
                '0x8a01ba955783ae84dbc2c52a9f91d92c71249684e533e7fc30d26e7e88361730',
                '0xc08f3794de5a9382ceaa9cd7b6190e04793c970a4c38c6e606f933730233735b',
                '0x3a9dd0d7886097bc7057d9496f3e63df1f502320acffb31ed758641185dac780',
                '0x4dbd19537332b5fedbb7009bfd24d0db61e976325f5240134c2f82db5a3b9cbd',
                '0xe8a904ca9e20d77f178303524333ac9ce44df3ed78147ee6af5339d077d047bb',
                '0xb61118705a0d2ebc9ebf874366296527db8bf3ab8e09029f1edeacc82dde465b',
                '0x5109634694f05e698a69d3b0940d5b92015a853ac1df399a5a795a9230e7a2e2',
                '0x10a9d535bd116272ab217016ca6cf7af93001e61fedcf169e5030a5e6a0a5b9b',
                '0x8c51dd8c5fa6f9bdeb01217f86aa017b9f08d85fbf127b375dd449ebd8b8b947',
                '0x6294fb65bf7c8d3328d6d68e33ee83f6e3de36eaa66f7f822d46e0074ba78dec',
                '0xd451adb5475b816db5fec23f42ef57b96a01f753f292e730e1cbca88d14eec85',
                '0x2da16fb140d54008cca9e712673d9e5f994593e3012658a54600a257afc8126f',
                '0x449ba64dd8550ac4c0e51cbd60bceb09f29373be4d0f42fc16ce103cf7b8ade2',
                '0x8e888382edb26ced97e305de6628356a107e55e1e0940a957bf6dc3bec51df9a',
                '0xc7bb674391035151c2190f1916fde10ecf2faf9cafdc368b9e7a69241d72e2d9',
                '0xfdd1bab9d146953c8b8137b25cb1189831b3ecc6ed93f47bd2df716dbc85a61b',
                '0x7d4406d22491ed835aa9e00a20b547dc3ea0d3b1f73d88cd8c0b630a3bb10e0c',
                '0xf6175ad50144ec289518afdb86df15fb30c212d90f20ce81bd1f754a2e4f52ad',
                '0xe768d5efbaa974849705a481a08ba1d4c75340d4b7c2069bd9f289bde669e7ec',
                '0x25fe395b93748394a6c4783af022ee840315170fa67cd9d1fd2c5bce652df731',
                '0x6ee2d9b5198dfabe1117965d2a4a8bd6b99b234ed369b6bbd5110ef87c1c4c26',
                '0x8f07d41e1df2a8957a0a0dbaa759b331b779f92c4a6694397bb170ad7a44a084',
                '0x2f2ced2122ac9132e7578e74e3bec060ab35758a7cabc11263300ad35ba0f662',
                '0xfad104df83899eca6ae9a906e39968cadaf2b846579f4ee770d3f3aa7bc36962',
                '0xcb9ad0d1402e594e34767e537db16681d9d827249ab688ed0d7fb49d0f2385f1',
                '0x3da22deea218b4556216bab9fe682b36801f7f5eb6e41c9ed784247a4688cf0f',
                '0x8d6332e7b1709b219d4c542450deb936646439c3c6d16e4ad2391a922818cdf6',
                '0x5a7dddab3bcb068480baa8443f0f7589dbf8235d872d211eedd74574489ea2d9',
                '0xe7da9184c73d1a1255b2967e1e317f0dec2fa428867c7a0c08f3a2d0421f4506',
                '0x7d7dc92d85954d15d7acbc888658d59b2ae4f48442a3655bc3dc32cd0142c7fc',
                '0xcbca825266059960f3bc1c8a413bb0768f63313c50134ced6ca16eb2cf497659',
                '0xb6f8a2fca090612be98bc4b51b72952aeb6bba17bb001159f3ce29d2767e4736',
                '0x3f2b0b387337890b3ba1496249fa441d69a87cf32b1fe6d859cfbb39255df03c',
                '0x0737890b81b27a3d97b8a1ecccf3d96eba6e81d33348ff0f868be436014d9104',
                '0xcafd6845b25ffa89c35a49cabdec0c6204ba406c67911a20a81312c451e74e03',
                '0x27746c4582191ba57e8b25039aead945a6191365d7bc18e9b3c858ca1045dac0',
                '0xb92f6101c8dff74ebea089e9597e7993c09f79f24a125f320dfb72e8729b0a5e',
                '0x1100c38a91766ccc51cef88b76ff41a2c38d247a7e5ef5fb58ba31d87079904e',
                '0x92082f673772d74c80f06bcc01cd0d7c0d5c8dad960f24fc412c95fb813b6602',
                '0xa563b80caeca73acd87b61f71f72e33e9fa353306a7a6b45afae40580966cb28',
                '0xbdb1c4574a2922f2ad897bebb1c64c528ca842305b155d3776f1573df8b4f9f9',
                '0x3f345fcbc136e48aeefd240aafd9c6a49c32e98d08bd1f1bdc37f9dff1c088d9',
                '0x0c6e1c7ef08c8ff48277141cdd01de2084c0ce836a1aba4d69d81e2e7634de6a',
                '0x9e69cb42b565b731e8bbf7f0114371c30a9d41f9333a0b8a33ab6a8135c7afb7',
                '0xc408c2d1e5aae053b3d04c3244e18838bf5a6c0f4645e1b5bc5be787ff4c6ae6',
                '0xe9b0c8a671769fa78b4b5570ecb54bb235a65e52684721bb5a9b7106b8c9a919',
                '0x6333e7e415656fccee8186738efed010343e50d2b9f87489945bdb8160600cd4',
                '0x19305dda606f82435ce4d176b2b7c2616207d01664a1fdafd0f7276d7ef25517',
                '0x403712c781af1b84e94a3ad3cc3494f2332797360c69786ae5d9cea982a9e112',
                '0x7f75e31233f7ff29da49f265dd9bab713427b2be5d66961e16a061e47acdf34e',
                '0xaa1b2512967072997a0ce4a2d1f3814585ced8118dc727be1dbde6c9cf8aa71a',
                '0xb9f69496f20ca9a11de3a9bf14fc984589c0a92de95701e9a6f49821f3c8d3a2',
                '0x1d85b370b1b719c01195dc6ea25ed208f2f9a209d0271961bd41a0c8c2f01db7',
                '0xf849138d2d892a7a545737d7d5f7ed70fc62915834f67b7227acd59d1427daf0',
                '0xcc99398fa2667e641db8f75111ae3894ad1465b9b48f772ca6283355766ba99f',
              ],
              transactionsRoot: '0x23ae4bdbdc6de821f39ffe7dc8607d59ea88af69204499a39bea7d3aedc12e9d',
              uncles: [],
              withdrawals: [
                {
                  index: '0x1609476',
                  validatorIndex: '0x5b470',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x101bf2c',
                },
                {
                  index: '0x1609477',
                  validatorIndex: '0x5b471',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x10137f6',
                },
                {
                  index: '0x1609478',
                  validatorIndex: '0x5b472',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x101a4fd',
                },
                {
                  index: '0x1609479',
                  validatorIndex: '0x5b473',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x100de39',
                },
                {
                  index: '0x160947a',
                  validatorIndex: '0x5b474',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x10139d3',
                },
                {
                  index: '0x160947b',
                  validatorIndex: '0x5b475',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x3797bbd',
                },
                {
                  index: '0x160947c',
                  validatorIndex: '0x5b476',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x1004ae3',
                },
                {
                  index: '0x160947d',
                  validatorIndex: '0x5b477',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x101825c',
                },
                {
                  index: '0x160947e',
                  validatorIndex: '0x5b478',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x100eaf6',
                },
                {
                  index: '0x160947f',
                  validatorIndex: '0x5b479',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x10190b5',
                },
                {
                  index: '0x1609480',
                  validatorIndex: '0x5b47a',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x101b079',
                },
                {
                  index: '0x1609481',
                  validatorIndex: '0x5b47b',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x1014511',
                },
                {
                  index: '0x1609482',
                  validatorIndex: '0x5b47c',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x100f62e',
                },
                {
                  index: '0x1609483',
                  validatorIndex: '0x5b47d',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x1016e28',
                },
                {
                  index: '0x1609484',
                  validatorIndex: '0x5b47e',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x1007d89',
                },
                {
                  index: '0x1609485',
                  validatorIndex: '0x5b47f',
                  address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
                  amount: '0x10070d1',
                },
              ],
              withdrawalsRoot: '0x085b466d069457da8f66d74fe110f13aaf51abe1e4a3fc7b94e273e3163e2a38',
            },
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'personal_sign') {
        console.log('personal_sign', payload);
        const messageParams = params as string[];
        const message = ethers.toUtf8String(messageParams[0]);
        console.log(message);
        const credentials: any = await getCredentials(AUTHENTICATION_TYPE.BIOMETRICS);
        console.log(credentials);
        const hd_wallet = await getHDWallet(credentials.username, 0);
        console.log(hd_wallet);
        const wallet = new ethers.Wallet(hd_wallet.ethereum.privateKey);
        console.log(wallet);
        const signature = await wallet.signMessage(message);
        console.log(signature);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: `${signature}`,
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      } else if (method === 'personal_ecRecover') {
        console.log('personal_ecRecover', payload);
        const messageParams = params as string[];
        const message = ethers.toUtf8String(messageParams[0]);
        const signature = messageParams[1];
        const address = ethers.verifyMessage(message, signature);
        console.log(address);
        jsBridge.sendPayload({
          id: id,
          data: {
            jsonrpc: '2.0',
            result: `${address}`,
          },
          type: 'RESPONSE',
          origin: payload.origin,
          peerOrigin: payload.peerOrigin,
          scope: payload.scope,
        });
      }
      console.log('done');
      //return response data
    },
    [],
  );

  const jsBridge = useMemo(
    () =>
      new JsBridgeNativeHost({
        webviewRef,
        receiveHandler,
      }),
    [receiveHandler],
  );

  const webviewOnMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const { data } = event.nativeEvent;
      try {
        const uri = new URL(event.nativeEvent.url);
        const origin = uri?.origin || '';
        jsBridge.receive(data, { origin });
      } catch {
        console.warn('onMessage', data);
      }
    },
    [jsBridge],
  );

  return (
    <View style={[Layout.fill]}>
      {injected && (
        <WebView
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          allowsBackForwardNavigationGestures
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          fraudulentWebsiteWarningEnabled={false}
          style={[Layout.fill]}
          ref={webviewRef}
          source={{ uri: url }}
          injectedJavaScriptBeforeContentLoaded={`(function() {
              ${injected}
            })();`}
          onLoadProgress={({ nativeEvent }) => console.log(nativeEvent)}
          onLoadStart={({ nativeEvent }) => console.log(nativeEvent)}
          onLoadEnd={({ nativeEvent }) => console.log(nativeEvent)}
          onMessage={webviewOnMessage}
          renderError={renderError}
        />
      )}
    </View>
  );
};

export default Browser;
