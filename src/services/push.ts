import { Wallet } from 'ethers';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream';
import { IPGPHelper, aesDecrypt } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { PushAPI, STREAM, channels, user } from '@pushprotocol/restapi';
import OpenPGP from 'react-native-fast-openpgp';
import * as api from '@pushprotocol/restapi';
import {
  ChatsOptionsType,
  RequestOptionsType,
  conversationHash,
  latestCore,
} from '@pushprotocol/restapi/src/lib/chat';

export let pushAPI: PushAPI;
export let streamAPI: PushStream;
let pgpDecryptedPvtKey: string;

export const initPushProtocol = async (wallet: Wallet) => {
  try {
    pushAPI = await PushAPI.initialize(wallet, { env: ENV.STAGING });
    // To listen to real time notifications
    streamAPI = await pushAPI.initStream([STREAM.NOTIF]);
    streamAPI.on(STREAM.NOTIF, data => {
      console.log('STREAM.NOTIF', data);
    });
    streamAPI.connect();
    return {
      pushAPI,
      streamAPI,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const chatAPI = async (wallet: Wallet) => {
  const account = `eip155:${wallet.address}`;

  const _user = await api.user.get({ account: account, env: ENV.STAGING });

  pgpDecryptedPvtKey = await api.chat.decryptPGPKey({
    encryptedPGPPrivateKey: _user.encryptedPrivateKey,
    signer: wallet,
  });

  const chatOptions: ChatsOptionsType = {
    account,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
  };
  const requestOptions: RequestOptionsType = {
    account,
    pgpPrivateKey: pgpDecryptedPvtKey,
    env: ENV.STAGING,
    toDecrypt: false,
  };
  let chats = await api.chat.chatsCore(chatOptions, PGPHelper);
  let requests = await api.chat.requests(requestOptions);
  requests = await Promise.all(
    requests.map(async request => {
      request.msg.messageObj = JSON.parse(await decryptMessage(request.msg));
      return request;
    }),
  );
  chats = await Promise.all(
    chats.map(async chat => {
      chat.msg.messageObj = JSON.parse(await decryptMessage(chat.msg));
      return chat;
    }),
  );
  return { chats, requests };
};

export const chatHistory = (wallet: Wallet, conversationId: string) => {
  return new Promise(async (resolve, reject) => {
    const account = `eip155:${wallet.address}`;
    const conversation = await conversationHash({ conversationId, account, env: ENV.STAGING });
    console.log('conversation', conversation);
    let messages = await latestCore(
      {
        account,
        threadhash: conversation.threadHash,
        pgpPrivateKey: pgpDecryptedPvtKey,
        toDecrypt: false,
        env: ENV.STAGING,
      },
      PGPHelper,
    );
    messages = await Promise.all(
      messages.map(async message => {
        message.messageObj = JSON.parse(await decryptMessage(message));
        return message;
      }),
    );
    resolve(messages);
  });
};

export const decryptMessage = async (message: any) => {
  const encryptedSecret = await OpenPGP.decrypt(message.encryptedSecret, pgpDecryptedPvtKey, '');

  const messageObj = aesDecrypt({
    cipherText: message.messageObj as string,
    secretKey: encryptedSecret,
  });
  return messageObj;
};

export { channels, user };

const PGPHelper: IPGPHelper = {
  async generateKeyPair() {
    let keys = await OpenPGP.generate({ keyOptions: { rsaBits: 2048 } });
    return {
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  },

  async sign({ message, signingKey }) {
    const publicKey = await OpenPGP.convertPrivateKeyToPublicKey(signingKey);
    const signature = await OpenPGP.sign(message, publicKey, signingKey, '');
    return signature.replace('\nVersion: openpgp-mobile', '');
  },

  async pgpEncrypt({ keys, plainText }) {
    const encryptedSecret = await OpenPGP.encrypt(plainText, keys.join('\n'));
    return encryptedSecret;
  },
};
