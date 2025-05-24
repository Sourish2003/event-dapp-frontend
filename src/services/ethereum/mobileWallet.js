import { ethers } from 'ethers';
import { Linking, Platform } from 'react-native';

const METAMASK_DEEPLINK = 'metamask://';
const METAMASK_UNIVERSAL = 'https://metamask.app.link';

export const checkMetaMaskAvailability = async () => {
  return await Linking.canOpenURL(METAMASK_DEEPLINK);
};

export const getMetaMaskStoreLink = () => {
  return Platform.select({
    ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
    android: 'https://play.google.com/store/apps/details?id=io.metamask',
    default: 'https://metamask.io/download/',
  });
};

export const connectToMetaMask = async () => {
  try {
    const isMetaMaskInstalled = await checkMetaMaskAvailability();
    
    if (!isMetaMaskInstalled) {
      return {
        installed: false,
        storeLink: getMetaMaskStoreLink()
      };
    }

    // Create a deep link to open MetaMask
    const dappUrl = Platform.select({
      ios: 'exp://localhost:19000',
      android: 'exp://192.168.1.1:19000',
      default: 'http://localhost:19000'
    });

    const deepLink = `${METAMASK_DEEPLINK}dapp/${encodeURIComponent(dappUrl)}`;
    
    // Open MetaMask
    await Linking.openURL(deepLink);

    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR-PROJECT-ID');
    
    // Listen for MetaMask connection
    return new Promise((resolve) => {
      const checkConnection = async () => {
        try {
          // Check if MetaMask is connected
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            resolve({
              connected: true,
              address: accounts[0],
              provider
            });
          } else {
            // Check again in 1 second
            setTimeout(checkConnection, 1000);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          setTimeout(checkConnection, 1000);
        }
      };

      checkConnection();
    });
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};
