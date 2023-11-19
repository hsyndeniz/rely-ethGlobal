import { reduxStorage } from '@/store';
import { cacheExchange, createClient, fetchExchange, Client } from 'urql';
import { LensClient, development, production, IStorageProvider } from '@lens-protocol/client';

class LocalStorageProvider implements IStorageProvider {
  getItem(key: string) {
    return reduxStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    return reduxStorage.setItem(key, value);
  }

  removeItem(key: string) {
    return reduxStorage.removeItem(key);
  }
}

const storage = new LocalStorageProvider();

const environments = {
  testnet: development,
  mainnet: production,
};

const lensClientConfig = {
  storage,
  environment: production,
};

export const lensClient = new LensClient(lensClientConfig);

export let urqlClient: Client;

export const initLensProtocol = async () => {
  const token = await storage.getItem('accessToken');
  urqlClient = createClient({
    url: environments.mainnet.gqlEndpoint,
    exchanges: [cacheExchange, fetchExchange],
    requestPolicy: 'network-only',
    fetchOptions: () => {
      return {
        cache: 'no-cache',
        headers: {
          'user-agent': 'spectaql',
          'x-access-token': `Bearer ${token}`,
        },
      };
    },
  });
  return urqlClient;
};
