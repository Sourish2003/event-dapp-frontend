import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../../components/common/Loading';
import { useWeb3 } from '../../contexts/Web3Context';

const WalletConnectScreen = () => {
  const { isConnected, isLoading, connectWallet } = useWeb3();

  if (isLoading) {
    return <Loading message="Connecting to MetaMask..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to EventApp</Text>
        <Text style={styles.subtitle}>
          Connect with MetaMask to start exploring events
        </Text>
        
        <Image
          source={require('../../../assets/images/metamask.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="MetaMask Logo"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={connectWallet}
          >
            <Image
              source={require('../../../assets/images/metamask-fox.png')}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Connect with MetaMask</Text>
          </TouchableOpacity>
        </View>
        
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6851B',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default WalletConnectScreen;