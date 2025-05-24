import { ethers } from 'ethers';
import { createContext, useContext, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { connectToMetaMask } from '../services/ethereum/mobileWallet';

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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const result = await connectToMetaMask();

      if (!result.connected) {
        if (!result.installed) {
          Alert.alert(
            'MetaMask Not Installed',
            'Would you like to install MetaMask?',
            [
              {
                text: 'Install',
                onPress: () => Linking.openURL(result.storeLink),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }
        return false;
      }

      // Set wallet address and provider
      setWalletAddress(result.address);
      setProvider(result.provider);
      setIsConnected(true);

      // Get balance
      const balance = await result.provider.getBalance(result.address);
      setBalance(ethers.utils.formatEther(balance));

      // Initialize signer
      const signer = result.provider.getSigner(result.address);
      setSigner(signer);

      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to MetaMask. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setWalletAddress(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setBalance('0');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const value = {
    walletAddress,
    provider,
    signer,
    isConnected,
    isLoading,
    balance,
    connectWallet,
    disconnectWallet
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};