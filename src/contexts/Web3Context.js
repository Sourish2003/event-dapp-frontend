import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const Web3Context = createContext();

// Mock wallet address and contracts for development
const MOCK_WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const MOCK_CONTRACTS = {
  userTicketHub: {},
  eventFactory: {},
  eventDiscovery: {},
};

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has a wallet
      const walletInfo = await AsyncStorage.getItem('walletInfo');
      
      if (walletInfo) {
        // Set mock wallet address and contracts
        setWalletAddress(MOCK_WALLET_ADDRESS);
        setContracts(MOCK_CONTRACTS);
        setIsConnected(true);
      }
    } catch (error) {
      console.log('Development mode: Using mock blockchain data');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      // Set mock wallet data
      const mockWalletInfo = { address: MOCK_WALLET_ADDRESS };
      await AsyncStorage.setItem('walletInfo', JSON.stringify(mockWalletInfo));
      setWalletAddress(MOCK_WALLET_ADDRESS);
      setContracts(MOCK_CONTRACTS);
      setIsConnected(true);
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      Alert.alert('Error', 'Failed to connect wallet');
      return false;
    }
  };

  const disconnectWallet = async () => {
    try {
      await AsyncStorage.removeItem('walletInfo');
      setWalletAddress(null);
      setContracts(null);
      setIsConnected(false);
      return true;
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      Alert.alert('Error', 'Failed to disconnect wallet');
      return false;
    }
  };

  // Simplified context value with only necessary mock data
  const value = {
    walletAddress,
    contracts,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};