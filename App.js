import { SafeAreaProvider } from 'react-native-safe-area-context';
import './polyfills'; // Import this first before any other imports
import './shims';
import { AuthProvider } from './src/contexts/AuthContext';
import { Web3Provider } from './src/contexts/Web3Context';
import Navigation from './src/navigation';

// Use your actual app navigation instead of expo-router
export default function App() {
  return (
    <SafeAreaProvider>
      <Web3Provider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </Web3Provider>
    </SafeAreaProvider>
  );
}