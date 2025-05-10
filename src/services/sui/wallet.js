import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createSuiWallet = async () => {
  const keypair = Ed25519Keypair.generate();
  const address = keypair.getPublicKey().toSuiAddress();
  
  const walletInfo = {
    privateKey: Buffer.from(keypair.getSecretKey()).toString('hex'),
    publicKey: Buffer.from(keypair.getPublicKey().toBytes()).toString('hex'),
    address: address,
  };
  
  await AsyncStorage.setItem('sui_wallet', JSON.stringify(walletInfo));
  return walletInfo;
};

export const getSuiWallet = async () => {
  const wallet = await AsyncStorage.getItem('sui_wallet');
  if (!wallet) return null;
  
  const walletInfo = JSON.parse(wallet);
  const keypair = Ed25519Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(walletInfo.privateKey, 'hex'))
  );
  
  return {
    keypair,
    address: walletInfo.address,
  };
};