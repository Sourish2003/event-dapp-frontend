import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';

const AuthContext = createContext();

// Mock user profile for development
const MOCK_USER_PROFILE = {
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://example.com/avatar.png'
};

export const AuthProvider = ({ children }) => {
  const { isConnected } = useWeb3();
  const [userProfile, setUserProfile] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is registered
  useEffect(() => {
    checkUserRegistration();
  }, [isConnected]);

  const checkUserRegistration = async () => {
    try {
      setIsLoading(true);
      const savedProfile = await AsyncStorage.getItem('userProfile');
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
        setUserProfile(null);
      }
    } catch (error) {
      console.log('Error checking registration:', error);
      setIsRegistered(false);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      // Save mock profile data
      const profile = { ...MOCK_USER_PROFILE, ...userData };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
      setIsRegistered(true);
      return true;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setUserProfile(null);
      setIsRegistered(false);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isRegistered,
        isLoading,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};