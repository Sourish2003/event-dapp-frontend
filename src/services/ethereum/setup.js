import { SEPOLIA_RPC_URL } from '@env';
import '@ethersproject/shims';
import { ethers } from 'ethers';
import 'react-native-get-random-values';
import { getWallet } from './wallet';

export const initializeEthers = async () => {
  try {
    // Initialize provider with a fallback if SEPOLIA_RPC_URL is not set
    const provider = new ethers.providers.JsonRpcProvider(
      SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    );
    
    // Get wallet info
    const walletInfo = await getWallet();
    
    if (!walletInfo || !walletInfo.privateKey) {
      console.log('No wallet found, creating a new one');
      // Create a new random wallet if none exists
      const wallet = ethers.Wallet.createRandom();
      return {
        connected: true,
        provider,
        wallet: wallet.connect(provider),
        address: wallet.address,
        balance: '0'
      };
    }
    
    // Create wallet instance
    const wallet = new ethers.Wallet(walletInfo.privateKey, provider);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    
    return {
      connected: true,
      provider,
      wallet,
      address: wallet.address,
      balance: ethers.utils.formatEther(balance)
    };
  } catch (error) {
    console.error('Error initializing ethers:', error);
    return {
      connected: false,
      error: error.message
    };
  }
}; 