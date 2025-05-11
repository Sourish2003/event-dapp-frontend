import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ProfileScreen = ({ navigation }) => {
  const { userProfile, isLoading: authLoading } = useAuth();
  const { walletAddress, disconnectWallet, isLoading: web3Loading } = useWeb3();
  
  const isLoading = authLoading || web3Loading;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleFavoriteEvents = () => {
    navigation.navigate('FavoriteEvents');
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: async () => {
            await disconnectWallet();
          }
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userProfile?.userName ? userProfile.userName[0].toUpperCase() : '?'}
            </Text>
          </View>
          
          <Text style={styles.userName}>{userProfile?.userName || 'User'}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={18} color="#4C68D7" />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userProfile?.email || 'Not set'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wallet:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Not connected'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tickets Owned:</Text>
            <Text style={styles.infoValue}>{userProfile?.totalTicketsOwned || '0'}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button 
            title="My Favorite Events" 
            onPress={handleFavoriteEvents}
            variant="secondary"
          />
          
          <Button 
            title="Disconnect Wallet" 
            onPress={handleDisconnect}
            variant="secondary"
            style={styles.disconnectButton}
          />
        </View>
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4C68D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    marginLeft: 4,
    color: '#4C68D7',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 24,
  },
  disconnectButton: {
    marginTop: 12,
    backgroundColor: '#F8F8F8',
    borderColor: '#FF3B30',
  },
});

export default ProfileScreen;