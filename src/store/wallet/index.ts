import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletSliceState {
  initialized: boolean;
  onboarding: boolean;
  biometrics: boolean;
  uniqueId: string;
  active_ethereum_wallet: number;
  active_solana_wallet: number;
  active_network: string;
  ethereum: {
    wallets: HDNodeWallet[];
    networks: [];
    tokens: [];
    nfts: [];
    transactions: [];
  };
  solana: {
    wallets: SignKeyPair[];
    networks: [];
    tokens: [];
    nfts: [];
    transactions: [];
  };
}

interface HDNodeWallet {
  address: string;
  privateKey: string;
  balance: number;
}

interface SignKeyPair {
  publicKey: string;
  privateKey: string;
  balance: number;
}

const initialState: WalletSliceState = {
  initialized: false,
  onboarding: false,
  biometrics: false,
  uniqueId: '',
  active_ethereum_wallet: 0,
  active_solana_wallet: 0,
  active_network: '0x1',
  ethereum: {
    wallets: [],
    networks: [],
    tokens: [],
    nfts: [],
    transactions: [],
  },
  solana: {
    wallets: [],
    networks: [],
    tokens: [],
    nfts: [],
    transactions: [],
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setInitialised: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setOnboarding: (state, action: PayloadAction<boolean>) => {
      state.onboarding = action.payload;
    },
    setBiometrics: (state, action: PayloadAction<boolean>) => {
      state.biometrics = action.payload;
    },
    setUniqueId: (state, action: PayloadAction<string>) => {
      state.uniqueId = action.payload;
    },
    setActiveEthereumWallet: (state, action: PayloadAction<number>) => {
      state.active_ethereum_wallet = action.payload;
    },
    setActiveSolanaWallet: (state, action: PayloadAction<number>) => {
      state.active_solana_wallet = action.payload;
    },
    setActiveNetwork: (state, action: PayloadAction<string>) => {
      state.active_network = action.payload;
    },
    addEthereumWallet: (state, action: PayloadAction<HDNodeWallet>) => {
      state.ethereum.wallets.push(action.payload);
    },
    addSolanaWallet: (state, action: PayloadAction<SignKeyPair>) => {
      state.solana.wallets.push(action.payload);
    },
    removeEthereumWallet: (state, action: PayloadAction<string>) => {
      state.ethereum.wallets = state.ethereum.wallets.filter(wallet => wallet.address !== action.payload);
    },
    removeSolanaWallet: (state, action: PayloadAction<string>) => {
      state.solana.wallets = state.solana.wallets.filter(wallet => wallet.publicKey !== action.payload);
    },
    resetState: state => {
      state = initialState;
      console.log('resetting state', state.initialized);
    },
  },
});

export default walletSlice.reducer;

export const {
  setInitialised,
  setOnboarding,
  setBiometrics,
  setUniqueId,
  setActiveEthereumWallet,
  setActiveSolanaWallet,
  setActiveNetwork,
  addEthereumWallet,
  addSolanaWallet,
  removeEthereumWallet,
  removeSolanaWallet,
} = walletSlice.actions;
