import { ethers } from 'ethers';

// Format currency values (ETH)
export const formatCurrency = (value, decimals = 3) => {
  if (!value) return '0';
  
  // If it's already a string with the right number of decimals, return as is
  if (typeof value === 'string' && value.includes('.')) {
    const parts = value.split('.');
    if (parts[1].length <= decimals) {
      return value;
    }
  }
  
  // Otherwise, format to the specified number of decimals
  try {
    // Convert to a number and format
    const valueNum = parseFloat(value);
    return valueNum.toFixed(decimals);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '0';
  }
};

// Format a large number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  
  try {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
  }
};

// Truncate a string (e.g. for long descriptions)
export const truncateString = (str, maxLength = 100) => {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  
  return str.substring(0, maxLength) + '...';
};

// Format an address for display
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Convert wei to ETH
export const weiToEth = (wei) => {
  try {
    return ethers.utils.formatEther(wei.toString());
  } catch (error) {
    console.error('Error converting wei to ETH:', error);
    return '0';
  }
};

// Convert ETH to wei
export const ethToWei = (eth) => {
  try {
    return ethers.utils.parseEther(eth.toString());
  } catch (error) {
    console.error('Error converting ETH to wei:', error);
    return '0';
  }
};

// Format percentage
export const formatPercentage = (percentage, decimals = 2) => {
  if (!percentage && percentage !== 0) return '0%';
  
  try {
    return `${parseFloat(percentage).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
};