import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import LoadingScreen from '../components/common/Loading';

const Navigation = () => {
  const { isRegistered, isLoading: authLoading } = useAuth();
  const { isConnected, isLoading: web3Loading } = useWeb3();
  
  const isLoading = authLoading || web3Loading;
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {isConnected && isRegistered ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default Navigation;