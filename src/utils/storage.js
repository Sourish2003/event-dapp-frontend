import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data in persistent storage
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

// Retrieve data from persistent storage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Remove data from persistent storage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Clear all data from persistent storage
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Store a single value securely
export const storeSecureValue = async (key, value) => {
  try {
    // Note: In a real app, you would use a secure storage solution
    // like react-native-keychain or expo-secure-store
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Error storing secure value:', error);
    return false;
  }
};

// Retrieve a single value from secure storage
export const getSecureValue = async (key) => {
  try {
    // Note: In a real app, you would use a secure storage solution
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error retrieving secure value:', error);
    return null;
  }
};

// Store a user's wallet information
export const storeWalletInfo = async (walletInfo) => {
  return await storeData('walletInfo', walletInfo);
};

// Get a user's wallet information
export const getWalletInfo = async () => {
  return await getData('walletInfo');
};

// Remove a user's wallet information
export const removeWalletInfo = async () => {
  return await removeData('walletInfo');
};

// Store user preferences
export const storeUserPreferences = async (preferences) => {
  return await storeData('userPreferences', preferences);
};

// Get user preferences
export const getUserPreferences = async () => {
  return await getData('userPreferences') || {};
};