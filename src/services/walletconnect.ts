import { Wallet } from 'ethers';
import notifee from '@notifee/react-native';
import { Core } from '@walletconnect/core';
import { Web3InboxClient } from '@web3inbox/core';
import { SignClient } from '@walletconnect/sign-client';
import { ChatClient, IChatClient } from '@walletconnect/chat-client';
import { AuthClient, IAuthClient } from '@walletconnect/auth-client';
import { NotifyClient, INotifyClient } from '@walletconnect/notify-client';
import { SyncClient, SyncStore, ISyncClient } from '@walletconnect/sync-client';
import { IWeb3Wallet, Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet';
import { buildApprovedNamespaces, parseUri, getSdkError } from '@walletconnect/utils';

const projectId = process.env.WALLETCONNECT_PROJECT_ID || 'd122748298f9416e11d4671b4591f30e';

const metadata = {
  name: 'Rely Wallet',
  description: 'Seamless and secure crypto super app',
  url: 'https://getrely.io',
  icons: ['https://i.ibb.co/zx2Np10/layer-4496045-min.png'],
  redirect: {
    native: 'rely://',
    universal: 'https://getrely.io/wc',
  },
};

let wallet: Wallet;

const core = new Core({ logger: 'warn', projectId });

export let web3wallet: IWeb3Wallet;
export let signClient: any;
export let authClient: IAuthClient;
export let syncClient: ISyncClient;
export let chatClient: IChatClient;
export let notifyClient: INotifyClient;
export let inboxClient: Web3InboxClient;

export const initWalletConnect = async (_wallet: Wallet) => {
  try {
    wallet = _wallet;
    web3wallet = await Web3Wallet.init({ core, metadata });

    console.log('activeSessions', getActiveSessions());

    web3wallet.on('auth_request', onAuthRequest);
    web3wallet.on('session_proposal', onSessionProposal);
    web3wallet.on('session_request', onSessionRequest);
    web3wallet.on('session_delete', onSessionDelete);

    initClients();
    notifee.requestPermission();
  } catch (error) {
    console.log('failed to initialize walletconnect', error);
  }
};

export const pair = ({ uri }: { uri: string }) => {
  const { topic, ...rest } = parseUri(uri);
  console.log('pairing');
  console.log('topic', topic);
  console.log('rest', rest);
  return core.pairing.pair({ uri });
};

const onAuthRequest = async (request: Web3WalletTypes.AuthRequest) => {
  try {
    console.log('authRequest', JSON.stringify(request, null, 2));
    const { id, params } = request;
    console.log('id', id);
    console.log('params', params);
  } catch (error) {
    console.log('onAuthRequest error', error);
  }
};

const onSessionProposal = async (proposal: Web3WalletTypes.SessionProposal) => {
  try {
    console.log('sessionProposal', JSON.stringify(proposal, null, 2));
    const { id, params, verifyContext } = proposal;
    console.log('id', id);
    console.log('params', params);
    console.log('verifyContext', verifyContext);

    const chains = [
      ...new Set([
        ...(params.requiredNamespaces?.eip155?.chains || []),
        ...(params.optionalNamespaces?.eip155?.chains || []),
      ]),
    ];
    const methods = [
      ...new Set([
        ...(params.requiredNamespaces?.eip155?.methods || []),
        ...(params.optionalNamespaces?.eip155?.methods || []),
      ]),
    ];
    const events = [
      ...new Set([
        ...(params.requiredNamespaces?.eip155?.events || []),
        ...(params.optionalNamespaces?.eip155?.events || []),
      ]),
    ];
    const accounts = chains.map(chain => `${chain}:0x2f7662cD8E784750E116E44a536278d2b429167E`);
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: chains,
          methods: methods,
          events: events,
          accounts: accounts,
        },
      },
    });

    web3wallet.approveSession({
      id,
      namespaces: approvedNamespaces,
    });
  } catch (error) {
    console.log('onSessionProposal error', error);
  }
};

const onSessionRequest = async (sessionRequest: Web3WalletTypes.SessionRequest) => {
  try {
    console.log('sessionRequest', JSON.stringify(sessionRequest, null, 2));
    const { topic, params, id } = sessionRequest;
    const { request, chainId } = params;
    console.log('id', id);
    console.log('topic', topic);
    console.log('params', params);
    console.log('chainId', chainId);
    console.log('request', request);
  } catch (error) {
    console.log('onSessionRequest error', error);
  }
};

const onSessionDelete = async (sessionDelete: Web3WalletTypes.SessionDelete) => {
  try {
    console.log('sessionDelete', JSON.stringify(sessionDelete, null, 2));
    const { topic } = sessionDelete;
    console.log('topic', topic);
  } catch (error) {
    console.log('onSessionDelete error', error);
  }
};

export const getActiveSessions = () => {
  return web3wallet.getActiveSessions();
};

export const disconnectActiveSessions = () => {
  try {
    const activeSessions = web3wallet.getActiveSessions();
    console.log('activeSessions', Object.keys(activeSessions));

    Object.keys(activeSessions).forEach(key => {
      const value = activeSessions[key];
      web3wallet.disconnectSession({ topic: value.topic, reason: getSdkError('USER_DISCONNECTED') });
    });
  } catch (error) {
    console.log('disconnectActiveSessions error', error);
  }
};

export const rejectPendingSessionProposals = () => {
  try {
    const pendingSessionProposals = web3wallet.getPendingSessionProposals();
    console.log('pendingSessionProposals', pendingSessionProposals);
    Object.keys(pendingSessionProposals).forEach(key => {
      const value = pendingSessionProposals[key as any];
      web3wallet.rejectSession({ id: value.id, reason: getSdkError('USER_DISCONNECTED') });
    });
  } catch (error) {
    console.log('rejectPendingSessionProposals error', error);
  }
};

export const rejectPendingSessionRequests = () => {
  try {
    const pendingSessionRequests = web3wallet.getPendingSessionRequests();
    console.log('pendingSessionRequests', pendingSessionRequests);
    pendingSessionRequests.forEach(value => {
      web3wallet.rejectSession({ id: value.id, reason: getSdkError('USER_DISCONNECTED') });
    });
  } catch (error) {
    console.log('rejectPendingSessionRequests error', error);
  }
};

export const rejectPendingAuthRequests = () => {
  try {
    const pendingAuthRequests = web3wallet.getPendingAuthRequests();
    console.log('pendingAuthRequests', pendingAuthRequests);
    Object.keys(pendingAuthRequests).forEach(key => {
      const value = pendingAuthRequests[key as any];
      web3wallet.respondAuthRequest(
        { id: value.id, error: getSdkError('USER_DISCONNECTED') },
        value.pairingTopic, // value.iss
      );
    });
  } catch (error) {
    console.log('rejectPendingAuthRequests error', error);
  }
};

export const disconnect = () => {
  disconnectActiveSessions();
  rejectPendingSessionProposals();
  rejectPendingSessionRequests();
  rejectPendingAuthRequests();
};

const initSignClient = async () => {
  signClient = await SignClient.init({ core, projectId, metadata });
  console.log('signClient', signClient.core.name);

  signClient.on('session_proposal', console.log);
  signClient.on('session_event', console.log);
  signClient.on('session_request', console.log);
  signClient.on('session_ping', console.log);
  signClient.on('session_delete', console.log);
};

const initAuthClient = async () => {
  authClient = await AuthClient.init({ core, projectId, metadata });
  console.log('authClient', authClient.core.name);

  authClient.on('auth_request', async ({ id, params }) => {
    // the user’s address
    const iss = `did:pkh:eip155:1:${'0x2f7662cD8E784750E116E44a536278d2b429167E'}`;

    // format the cacao payload with the user’s address
    const message = authClient.formatMessage(params.cacaoPayload, iss);
    console.log('message', message);

    // This is a good point to trigger a UI event to provide the user
    // with a button to accept or reject the authentication request,
    // instead of automatically responding.
    const signature = await wallet.signMessage(message);

    await authClient.respond(
      {
        id: id,
        signature: {
          s: signature,
          t: 'eip191',
        },
      },
      iss,
    );
  });
};

const initSyncClient = async () => {
  syncClient = await SyncClient.init({ core, projectId });
  console.log('syncClient', syncClient.core.name);
  syncClient.on('sync_update', console.log);
};

const initChatClient = async () => {
  chatClient = await ChatClient.init({
    core,
    projectId,
    syncClient,
    SyncStoreController: SyncStore,
  });
  console.log('chatClient', chatClient.core.name);
  return chatClient;
};

const initNotifyClient = async () => {
  console.log('initNotifyClient start');
  notifyClient = await NotifyClient.init({ projectId, core });
  console.log('notifyClient', notifyClient.core.name);

  const account = `eip155:1:${wallet.address}`;
  const domain = 'com.craftlabs.rely';
  const onSign = (message: string) => wallet.signMessage(message);

  // ? this is one time registration ?
  await notifyClient.register({
    account,
    onSign,
    domain, // must be the app bundle identifier for wallet. use domain for dapps
    isLimited: false, // The user will be prompted to authorize this wallet to send and receive messages on their behalf for ALL domains using their WalletConnect identity.
  });

  // Get the domain of the target dapp from the Explorer API response
  // const explorer = `https://explorer-api.walletconnect.com/v3/dapps?projectId=${projectId}&is_notify_enabled=true`;
  // console.log('explorer', explorer);

  // const response = await fetch(explorer);
  // console.log('response', response);
  // const dapps = await response.json();

  // let appDomain = Object.values(dapps.listings)[0].homepage;
  // console.log('appDomain', appDomain);
  // appDomain = new URL(appDomain).hostname;
  // console.log('appDomain', appDomain);

  // Subscribe to `fetchedExplorerDapp` by passing the account to be subscribed and the domain of the target dapp.
  // -> Success/Failure will be received via the `notify_update` event registered previously.
  // -> New subscription will be emitted via the `notify_subscriptions_changed` watcher event.
  /////////// await notifyClient.subscribe({
  ///////////   account,
  ///////////   appDomain,
  /////////// });

  const topic = '93abcb8e9e9fa2cc1d7a2dec77e64e5ee5ad6fcb76a4c066c90fe8ae17bc5b09';
  // ------- update subscription
  // `topic` - subscription topic of the subscription that should be updated.
  // `scope` - an array of notification types that should be enabled going forward. The current scopes can be found under `subscription.scope`.
  /////////// await notifyClient.update({
  ///////////   topic,
  ///////////   scope: ['alerts'],
  /////////// });

  // -> Success/Failure will be received via the `notify_update` event registered previously.
  // -> Updated subscription will be emitted via the `notify_subscriptions_changed` watcher event.
  // -------

  // ------- unsubscribe
  // `topic` - subscription topic of the subscription that should be deleted.
  /////////// await notifyClient.deleteSubscription({ topic });

  // Will return all active subscriptions for the provided account, keyed by subscription topic.
  const accountSubscriptions = notifyClient.getActiveSubscriptions({ account });

  console.log('accountSubscriptions', accountSubscriptions);

  // Will return all past Notify messages for the provided subscription topic, keyed by messageId.
  const messageHistory = notifyClient.getMessageHistory({ topic });
  console.log('messageHistory', messageHistory);

  // Handle response to a `notifyClient.subscribe(...)` call
  notifyClient.on('notify_subscription', async ({ params }) => {
    const { error } = params;

    if (error) {
      // Setting up the subscription failed.
      // Inform the user of the error and/or clean up app state.
      console.error('Setting up subscription failed: ', error);
    } else {
      // New subscription was successfully created.
      // Inform the user and/or update app state to reflect the new subscription.
      console.log('Subscribed successfully.');
    }
  });

  // Handle an incoming notification
  notifyClient.on('notify_message', ({ params }) => {
    console.log('notify_message', params);
    const { message } = params;
    console.log('Received notification: ', message);

    // e.g. build a notification using the metadata from `message` and show to the user.
  });

  // Handle response to a `notifyClient.update(...)` call
  notifyClient.on('notify_update', ({ params }) => {
    const { error } = params;

    if (error) {
      // Updating the subscription's scope failed.
      // Inform the user of the error and/or clean up app state.
      console.error('Setting up subscription failed: ', error);
    } else {
      // Subscription's scope was updated successfully.
      // Inform the user and/or update app state to reflect the updated subscription.
      console.log('Successfully updated subscription scope.');
    }
  });

  // Handle a change in the existing subscriptions (e.g after a subscribe or update)
  notifyClient.on('notify_subscriptions_changed', ({ params }) => {
    console.log('notify_subscriptions_changed', params);
    const { subscriptions } = params;
    console.log('Subscriptions changed: ', subscriptions);
    // `subscriptions` will contain any *changed* subscriptions since the last time this event was emitted.
    // To get a full list of subscriptions for a given account you can use `notifyClient.getActiveSubscriptions({ account: 'eip155:1:0x63Be...' })`
  });

  return notifyClient;
};

const initInboxClient = async () => {
  const domain = 'getrely.io';

  inboxClient = await Web3InboxClient.init({ projectId, domain, isLimited: false });

  const account = `eip155:1:${wallet.address}`;
  const onSign = (message: string) => wallet.signMessage(message);

  await inboxClient.setAccount(account);
  inboxClient.watchAccount(_account => console.log('watchAccount', _account));

  await inboxClient.register({ account, domain, onSign });

  // check if current account is subscribed to current dapp
  const isSubscribed = inboxClient.isSubscribedToDapp(account, domain);
  console.log('isSubscribed', isSubscribed);

  // watch if specific account is subscribed to specific dapp
  inboxClient.watchIsSubscribed(isSubbed => console.log('watchIsSubscribed', isSubbed), account, domain);

  // subscribe to specific dapp with specific account
  await inboxClient.subscribeToDapp(account, domain);

  // unsubscribe from specific dapp with specific account
  // inboxClient.unsubscribeFromDapp(account, domain);

  // get specific account's subscription to specific dapp
  const subscription = inboxClient.getSubscription(account, domain);
  console.log('subscription', subscription);

  // get specific account's subscriptions.
  const subscriptions = inboxClient.getSubscriptions(account);
  console.log('subscriptions', subscriptions);
  return inboxClient;
};

const initClients = async () => {
  try {
    initSignClient();
    initAuthClient();
    initSyncClient();
    initChatClient();
    initInboxClient();
    initNotifyClient();
  } catch (error) {
    console.log('initClients error', error);
  }
};
