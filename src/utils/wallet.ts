import { useSelector } from 'react-redux';
import nacl from 'tweetnacl';
import * as bip39 from 'bip39';
import * as ed25519 from 'ed25519-hd-key';
import { ethers, utils } from 'ethers';
import { RootState } from '@/store';

export interface Wallet {
  ethereum: HDNodeWallet;
  solana: SignKeyPair;
}

export interface HDNodeWallet {
  wallet: ethers.Wallet;
  address: string;
  privateKey: string;
}

export interface SignKeyPair {
  publicKey: string;
  secretKey: string;
}

const generateMnemonic = () => {
  try {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic');
    }

    return { mnemonic, seed };
  } catch (error) {
    console.log(error);
  }
};

export const validateMnemonic = (mnemonic: string) => {
  try {
    return bip39.validateMnemonic(mnemonic);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getEthereumWallet = (mnemonic: string, index = 0): Promise<HDNodeWallet> => {
  return new Promise((resolve, reject) => {
    try {
      const eth_path = `m/44'/60'/0'/0/${index}`;

      const hdWallet = ethers.Wallet.fromMnemonic(mnemonic, eth_path);

      const ethereum = {
        wallet: hdWallet,
        address: hdWallet.address,
        privateKey: hdWallet.privateKey,
      };

      resolve(ethereum);
    } catch (error) {
      reject(error);
    }
  });
};

const getSolanaWallet = (seed: Buffer, index = 0): Promise<SignKeyPair> => {
  return new Promise((resolve, reject) => {
    try {
      const sol_path = `m/44'/501'/${index}'/0'`;

      const derivedKey = ed25519.derivePath(sol_path, seed.toString('hex'));
      const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);

      const solana = {
        publicKey: utils.base58.encode(keyPair.publicKey),
        secretKey: utils.base58.encode(keyPair.secretKey),
      };

      resolve(solana);
    } catch (error) {
      reject(error);
    }
  });
};

export const generateSeed = () => {
  try {
    const secrets = generateMnemonic();
    if (!secrets) {
      throw new Error('Failed to generate mnemonic');
    }

    if (!bip39.validateMnemonic(secrets.mnemonic)) {
      throw new Error('Invalid mnemonic');
    }

    return secrets;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getHDWallet = async (mnemonic: string, index = 0) => {
  try {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic');
    }

    const ethereum = await getEthereumWallet(mnemonic, index);
    const solana = await getSolanaWallet(bip39.mnemonicToSeedSync(mnemonic));

    return { ethereum, solana };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const useWallet = () => {
  const activeWallet = useSelector((state: RootState) => state.wallet.active_ethereum_wallet);
  const secrets = useSelector((state: RootState) => state.wallet.ethereum.wallets[activeWallet]);
  if (!secrets || !secrets.privateKey) {
    return null;
  }
  const wallet = new ethers.Wallet(secrets?.privateKey);
  return wallet;
};
