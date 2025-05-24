import { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useWeb3 } from '../../contexts/Web3Context';

const WalletConnectScreen = () => {
  const { connectWallet, isLoading } = useWeb3();
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setError(null);
    try {
      const success = await connectWallet();
      if (!success) {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (e) {
      setError('An error occurred while connecting. Please try again.');
      console.error(e);
    }
  };

  if (isLoading) {
    return <Loading message="Connecting wallet..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to EventApp</Text>        <Text style={styles.subtitle}>
          Connect your wallet to start exploring events
        </Text>
        
        <Image
          source={require('../../../assets/images/wallet-connect.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Wallet Connect Icon"
        />
        
        <Button title="Connect Wallet" onPress={handleConnect} />
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <Text style={styles.disclaimer}>
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 48,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 16,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    marginTop: 24,
    textAlign: 'center',
  },
});

export default WalletConnectScreen;