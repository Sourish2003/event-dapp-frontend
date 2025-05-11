import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ETH_RPC_URL } from '@env';

// Create a new random wallet
export const createWallet = async () => {
  try {
    const wallet = ethers.Wallet.createRandom();
    
    const walletInfo = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
    
    // Store wallet info in secure storage
    await storeWalletInfo(walletInfo);
    
    return walletInfo;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

// Import a wallet using private key
export const importWalletFromPrivateKey = async (privateKey) => {
  try {
    // Validate private key
    if (!privateKey.startsWith('0x')) {
      privateKey = `0x${privateKey}`;
    }
    
    const wallet = new ethers.Wallet(privateKey);
    
    const walletInfo = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: null, // No mnemonic when importing from private key
    };
    
    // Store wallet info in secure storage
    await storeWalletInfo(walletInfo);
    
    return walletInfo;
  } catch (error) {
    console.error('Error importing wallet from private key:', error);
    throw error;
  }
};

// Import a wallet using mnemonic
export const importWalletFromMnemonic = async (mnemonic) => {
  try {
    // Validate mnemonic
    if (!ethers.utils.isValidMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }
    
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    
    const walletInfo = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
    
    // Store wallet info in secure storage
    await storeWalletInfo(walletInfo);
    
    return walletInfo;
  } catch (error) {
    console.error('Error importing wallet from mnemonic:', error);
    throw error;
  }
};

// Get wallet from storage
export const getWallet = async () => {
  try {
    const walletInfo = await AsyncStorage.getItem('walletInfo');
    
    if (!walletInfo) {
      return null;
    }
    
    return JSON.parse(walletInfo);
  } catch (error) {
    console.error('Error getting wallet:', error);
    return null;
  }
};

// Store wallet info
export const storeWalletInfo = async (walletInfo) => {
  try {
    // In a real app, you would use a secure storage solution
    // instead of AsyncStorage for storing sensitive info
    await AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo));
    return true;
  } catch (error) {
    console.error('Error storing wallet info:', error);
    return false;
  }
};

// Remove wallet info
export const removeWalletInfo = async () => {
  try {
    await AsyncStorage.removeItem('walletInfo');
    return true;
  } catch (error) {
    console.error('Error removing wallet info:', error);
    return false;
  }
};

// Connect to provider and get signer
export const getSigner = async () => {
  try {
    const walletInfo = await getWallet();
    
    if (!walletInfo) {
      throw new Error('No wallet found');
    }
    
    const provider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL);
    const wallet = new ethers.Wallet(walletInfo.privateKey, provider);
    
    return wallet;
  } catch (error) {
    console.error('Error getting signer:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async (address) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(ETH_RPC_URL);
    const balance = await provider.getBalance(address);
    
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Send transaction
export const sendTransaction = async (to, amount) => {
  try {
    const signer = await getSigner();
    
    // Convert amount from ETH to wei
    const amountWei = ethers.utils.parseEther(amount.toString());
    
    // Create transaction
    const tx = {
      to,
      value: amountWei,
      gasLimit: 21000,
    };
    
    // Send transaction
    const txResponse = await signer.sendTransaction(tx);
    
    // Wait for transaction to be mined
    const receipt = await txResponse.wait();
    
    return {
      success: true,
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};