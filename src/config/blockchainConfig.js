import { SEPOLIA_RPC_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

// ABI imports for your contracts
import EventCoreABI from '../abis/EventCore.json';
import EventDiscoveryABI from '../abis/EventDiscovery.json';
import EventFactoryABI from '../abis/EventFactory.json';
import TicketManagerABI from '../abis/TicketManager.json';
import UserTicketHubABI from '../abis/UserTicketHub.json';

// Ethereum configuration
export const getEthereumProvider = () => {
  return new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
};

export const getEthereumSigner = async (provider) => {
  const wallet = ethers.Wallet.createRandom();
  // For real implementation, you would retrieve the wallet from secure storage
  return wallet.connect(provider);
};

export const getContracts = (signer) => {
  return {
    userTicketHub: new ethers.Contract(process.env.CONTRACT_USER_TICKET_HUB, UserTicketHubABI, signer),
    eventFactory: new ethers.Contract(process.env.CONTRACT_EVENT_FACTORY, EventFactoryABI, signer),
    eventDiscovery: new ethers.Contract(process.env.CONTRACT_EVENT_DISCOVERY, EventDiscoveryABI, signer),
  };
};

// Get an EventCore contract instance using its address
export const getEventCoreContract = (address, signer) => {
  return new ethers.Contract(address, EventCoreABI, signer);
};

// Get a TicketManager contract instance using its address
export const getTicketManagerContract = (address, signer) => {
  return new ethers.Contract(address, TicketManagerABI, signer);
};

// Store wallet information securely
export const storeWallet = async (walletInfo) => {
  try {
    await AsyncStorage.setItem('wallet', JSON.stringify(walletInfo));
    return true;
  } catch (error) {
    console.error('Error storing wallet:', error);
    return false;
  }
};

// Retrieve wallet information
export const getWallet = async () => {
  try {
    const walletData = await AsyncStorage.getItem('wallet');
    return walletData ? JSON.parse(walletData) : null;
  } catch (error) {
    console.error('Error retrieving wallet:', error);
    return null;
  }
};