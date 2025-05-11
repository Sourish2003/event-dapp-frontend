import axios from 'axios';
import { Buffer } from 'buffer';

// Create an API instance
const api = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// IPFS API configuration (using Infura IPFS)
// Note: In a real app, you would use environment variables for these
const IPFS_API_URL = 'https://ipfs.infura.io:5001/api/v0';
const IPFS_PROJECT_ID = 'YOUR_IPFS_PROJECT_ID'; // Replace with your Infura IPFS project ID
const IPFS_PROJECT_SECRET = 'YOUR_IPFS_PROJECT_SECRET'; // Replace with your Infura IPFS project secret

// Upload a file to IPFS
export const uploadFileToIPFS = async (fileUri) => {
  try {
    // In a real app, you'd use React Native File System to read the file
    // For this example, we're simulating it with a fetch
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const fileData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(Buffer.from(reader.result));
      reader.readAsArrayBuffer(blob);
    });

    // Upload to IPFS
    const formData = new FormData();
    formData.append('file', fileData);

    const ipfsResponse = await axios.post(`${IPFS_API_URL}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Basic ${Buffer.from(`${IPFS_PROJECT_ID}:${IPFS_PROJECT_SECRET}`).toString('base64')}`,
      },
    });

    return {
      success: true,
      hash: ipfsResponse.data.Hash,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload event metadata to IPFS
export const uploadEventMetadataToIPFS = async (eventMetadata) => {
  try {
    const data = JSON.stringify(eventMetadata);
    
    const formData = new FormData();
    formData.append('file', new Blob([data], { type: 'application/json' }));

    const ipfsResponse = await axios.post(`${IPFS_API_URL}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Basic ${Buffer.from(`${IPFS_PROJECT_ID}:${IPFS_PROJECT_SECRET}`).toString('base64')}`,
      },
    });

    return {
      success: true,
      hash: ipfsResponse.data.Hash,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Fetch data from IPFS
export const fetchFromIPFS = async (hash) => {
  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${hash}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get gas price
export const getGasPrice = async () => {
  try {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: 'YOUR_ETHERSCAN_API_KEY', // Replace with your Etherscan API key
      },
    });

    if (response.data.status === '1') {
      return {
        success: true,
        data: {
          safeLow: response.data.result.SafeGasPrice,
          standard: response.data.result.ProposeGasPrice,
          fast: response.data.result.FastGasPrice,
        },
      };
    }

    return {
      success: false,
      error: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default api;