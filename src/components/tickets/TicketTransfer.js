import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../common/Button';

const TicketTransfer = ({ eventName, ticketCount, onTransfer, onCancel }) => {
  const [recipient, setRecipient] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState({});

  const increaseQuantity = () => {
    if (parseInt(quantity) < parseInt(ticketCount)) {
      setQuantity((parseInt(quantity) + 1).toString());
    }
  };

  const decreaseQuantity = () => {
    if (parseInt(quantity) > 1) {
      setQuantity((parseInt(quantity) - 1).toString());
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!recipient.startsWith('0x') || recipient.length !== 42) {
      newErrors.recipient = 'Invalid Ethereum address';
    }
    
    if (!quantity.trim() || isNaN(parseInt(quantity))) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (parseInt(quantity) > parseInt(ticketCount)) {
      newErrors.quantity = `You only have ${ticketCount} ticket(s)`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = () => {
    if (!validate()) return;
    onTransfer(recipient, parseInt(quantity));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Tickets</Text>
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.availableCount}>
          You have {ticketCount} ticket(s)
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Recipient Address</Text>
        <TextInput
          style={[styles.input, errors.recipient && styles.inputError]}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="0x..."
          autoCapitalize="none"
        />
        {errors.recipient && (
          <Text style={styles.errorText}>{errors.recipient}</Text>
        )}
      </View>
      
      <View style={styles.quantityContainer}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={decreaseQuantity}
            disabled={parseInt(quantity) <= 1}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={parseInt(quantity) <= 1 ? '#CCC' : '#666'} 
            />
          </TouchableOpacity>
          
          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={increaseQuantity}
            disabled={parseInt(quantity) >= parseInt(ticketCount)}
          >
            <Ionicons 
              name="add" 
              size={18} 
              color={parseInt(quantity) >= parseInt(ticketCount) ? '#CCC' : '#666'} 
            />
          </TouchableOpacity>
        </View>
        {errors.quantity && (
          <Text style={styles.errorText}>{errors.quantity}</Text>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Transfer" onPress={handleTransfer} />
        <Button 
          title="Cancel" 
          onPress={onCancel} 
          variant="secondary"
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  eventInfo: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  availableCount: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default TicketTransfer;