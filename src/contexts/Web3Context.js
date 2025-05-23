import { PRIVATE_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { initializeEthers } from '../services/ethereum/setup';

// ABI imports

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState('0');

  // Initialize blockchain connection
  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      setIsLoading(true);
      
      const ethConnection = await initializeEthers();
      
      if (ethConnection.connected) {
        setWalletAddress(ethConnection.address);
        setProvider(ethConnection.provider);
        setSigner(ethConnection.wallet);
        setBalance(ethConnection.balance);
        setIsConnected(true);
      } else {
        console.error('Failed to initialize blockchain:', ethConnection.error);
      }
    } catch (error) {
      console.error('Error initializing blockchain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Use the environment private key or create a new wallet
      let wallet;
      if (PRIVATE_KEY) {
        const privateKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;
        wallet = new ethers.Wallet(privateKey);
      } else {
        wallet = ethers.Wallet.createRandom();
      }
      
      const walletInfo = {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
      
      // Store wallet info
      await AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo));
      
      // Initialize connection with new wallet
      await initializeBlockchain();
      
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Error', 'Failed to connect wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await AsyncStorage.removeItem('walletInfo');
      setWalletAddress(null);
      setSigner(null);
      setIsConnected(false);
      setBalance('0');
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      Alert.alert('Error', 'Failed to disconnect wallet');
      return false;
    }
  };

  const refreshBalance = async () => {
    if (provider && walletAddress) {
      try {
        const balance = await provider.getBalance(walletAddress);
        const formattedBalance = ethers.utils.formatEther(balance);
        setBalance(formattedBalance);
        return formattedBalance;
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    }
    return '0';
  };

  const value = {
    walletAddress,
    provider,
    signer,
    contracts,
    isConnected,
    isLoading,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};