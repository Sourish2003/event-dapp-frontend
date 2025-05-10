import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletConnectScreen from '../screens/auth/WalletConnectScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useWeb3 } from '../contexts/Web3Context';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { isConnected } = useWeb3();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isConnected ? (
        <Stack.Screen name="WalletConnect" component={WalletConnectScreen} />
      ) : (
        <Stack.Screen name="Register" component={RegisterScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;