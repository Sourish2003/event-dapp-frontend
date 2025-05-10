import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { useWeb3 } from '../../contexts/Web3Context';
import { transferTickets } from '../../services/ethereum/contracts';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { ethers } from 'ethers';

const TransferTicketScreen = ({ route, navigation }) => {
  const { eventId, ticketCount, eventName } = route.params;
  const { contracts } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    // Validate recipient address
    if (!recipientAddress.trim()) {
      newErrors.recipientAddress = 'Recipient address is required';
    } else if (!ethers.utils.isAddress(recipientAddress)) {
      newErrors.recipientAddress = 'Invalid Ethereum address';
    }
    
    // Validate quantity
    const quantityNum = parseInt(quantity);
    if (!quantity.trim() || isNaN(quantityNum)) {
      newErrors.quantity = 'Quantity is required';
    } else if (quantityNum <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (quantityNum > parseInt(ticketCount)) {
      newErrors.quantity = `You only have ${ticketCount} ticket(s)`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      // Transfer tickets
      await transferTickets(
        contracts.userTicketHub,
        eventId,
        recipientAddress,
        parseInt(quantity)
      );
      
      Alert.alert(
        'Success',
        `Successfully transferred ${quantity} ticket(s) to ${recipientAddress.substring(0, 10)}...`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error transferring tickets:', error);
      Alert.alert('Error', 'Failed to transfer tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Transferring tickets..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Transfer Tickets</Text>
          
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{eventName}</Text>
            <Text style={styles.ticketCount}>
              You have {ticketCount} ticket(s)
            </Text>
          </View>
          
          <Input
            label="Recipient Address"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            placeholder="0x..."
            error={errors.recipientAddress}
          />
          
          <Input
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            keyboardType="numeric"
            error={errors.quantity}
          />
          
          <View style={styles.buttonContainer}>
            <Button title="Transfer Tickets" onPress={handleTransfer} />
            <Button 
              title="Cancel" 
              onPress={() => navigation.goBack()} 
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  eventInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketCount: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default TransferTicketScreen;