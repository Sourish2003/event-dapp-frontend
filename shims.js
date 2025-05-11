import '@ethersproject/shims';
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';

// Ensure crypto.getRandomValues is available
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = expoCryptoGetRandomValues;
}