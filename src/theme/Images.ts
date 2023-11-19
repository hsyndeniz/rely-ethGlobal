import { ThemeVariables } from '../../@types/theme';

export default function ({}: ThemeVariables) {
  return {
    common: {
      logo: require('./assets/lottie/wallet.lottie'),
      getStarted: require('./assets/images/digital-wallet.png'),
      notification: require('./assets/images/notification.png'),
      camera: require('./assets/images/camera.png'),
      cameraError: require('./assets/images/camera-error.png'),
      cameraPermission: require('./assets/images/phone-camera.png'),
    },
    lottie: {
      secure: require('./assets/lottie/secure.lottie'),
      solana: require('./assets/lottie/solana.lottie'),
      security: require('./assets/lottie/security-scanning.lottie'),
      wallet: require('./assets/lottie/wallet-loading.lottie'),
    },
    onboarding: {
      wallet: require('./assets/lottie/wallet.lottie'),
      multiChain: require('./assets/lottie/multichain.lottie'),
      secure: require('./assets/lottie/secure.lottie'),
      browser: require('./assets/images/browser.png'),
      defi: require('./assets/lottie/finance.lottie'),
      nft: require('./assets/lottie/nft.lottie'),
    },
    wallet: {
      wallet: require('./assets/images/wallet.png'),
      loading: require('./assets/lottie/wallet.lottie'),
    },
    tokens: {
      zerox: require('./assets/images/tokens/0x.png'),
      arb: require('./assets/images/tokens/arbitrum.png'),
      avax: require('./assets/images/tokens/avalanche.png'),
      bnb: require('./assets/images/tokens/binance.png'),
      btc: require('./assets/images/tokens/bitcoin.png'),
      link: require('./assets/images/tokens/chainlink.png'),
      eth: require('./assets/images/tokens/eth.png'),
      sol: require('./assets/images/tokens/solana-2.png'),
      usdt: require('./assets/images/tokens/usdt.png'),
      cro: require('./assets/images/tokens/cronos.png'),
      doge: require('./assets/images/tokens/doge.png'),
      ftm: require('./assets/images/tokens/fantom.png'),
      matic: require('./assets/images/tokens/polygon.png'),
      optimism: require('./assets/images/tokens/optimism.png'),
      tron: require('./assets/images/tokens/tron.png'),
      uni: require('./assets/images/tokens/uniswap.png'),
    },
  };
}

export const getTokenImage = (symbol: string) => {
  switch (symbol) {
    case '0x':
      return require('./assets/images/tokens/0x.png');
    case 'zerox':
      return require('./assets/images/tokens/0x.png');
    case 'arb':
      return require('./assets/images/tokens/arbitrum.png');
    case 'avax':
      return require('./assets/images/tokens/avalanche.png');
    case 'bnb':
      return require('./assets/images/tokens/binance.png');
    case 'btc':
      return require('./assets/images/tokens/bitcoin.png');
    case 'link':
      return require('./assets/images/tokens/chainlink.png');
    case 'eth':
      return require('./assets/images/tokens/eth.png');
    case 'sol':
      return require('./assets/images/tokens/sol.png');
    case 'usdt':
      return require('./assets/images/tokens/usdt.png');
    case 'cro':
      return require('./assets/images/tokens/cronos.png');
    case 'doge':
      return require('./assets/images/tokens/doge.png');
    case 'ftm':
      return require('./assets/images/tokens/fantom.png');
    case 'matic':
      return require('./assets/images/tokens/polygon.png');
    case 'optimism':
      return require('./assets/images/tokens/optimism.png');
    case 'tron':
      return require('./assets/images/tokens/tron.png');
    case 'uni':
      return require('./assets/images/tokens/uniswap.png');
    default:
      return require('./assets/images/tokens/eth.png');
  }
};
