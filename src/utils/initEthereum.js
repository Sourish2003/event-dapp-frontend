import { initializeEthers } from '../services/ethereum/setup';

// Initialize Ethereum connection when app starts
export const initEthereum = async () => {
  try {
    const ethConnection = await initializeEthers();
    
    if (ethConnection.connected) {
      console.log('Ethereum connection initialized successfully');
      console.log(`Connected wallet: ${ethConnection.address}`);
      return ethConnection;
    } else {
      console.error('Failed to initialize Ethereum connection');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Ethereum:', error);
    return null;
  }
}; 