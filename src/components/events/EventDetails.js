import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

const EventDetails = ({ event, isFavorite, onFavoriteToggle, onQuantityChange, quantity }) => {
  const increaseQuantity = () => {
    if (parseInt(quantity) < parseInt(event.ticketRemain)) {
      onQuantityChange(parseInt(quantity) + 1);
    }
  };

  const decreaseQuantity = () => {
    if (parseInt(quantity) > 1) {
      onQuantityChange(parseInt(quantity) - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{event.name}</Text>
          <TouchableOpacity onPress={onFavoriteToggle}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#FF3B30' : '#666'}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {['Music', 'Sports', 'Arts', 'Technology', 'Business', 'Other'][event.category]}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{formatDate(event.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{formatTime(event.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="ticket-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {event.ticketRemain} of {event.ticketCount} tickets available
          </Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>
            {formatCurrency(event.price)} ETH per ticket
          </Text>
        </View>
        
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
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
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={increaseQuantity}
              disabled={parseInt(quantity) >= parseInt(event.ticketRemain)}
            >
              <Ionicons 
                name="add" 
                size={18} 
                color={parseInt(quantity) >= parseInt(event.ticketRemain) ? '#CCC' : '#666'} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            {formatCurrency(parseFloat(event.price) * parseInt(quantity))} ETH
          </Text>
        </View>
      </View>
      
      <View style={styles.organizerContainer}>
        <Text style={styles.organizerLabel}>Organized by:</Text>
        <Text style={styles.organizerAddress}>
          {event.organizer.substring(0, 6)}...{event.organizer.substring(event.organizer.length - 4)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#4C68D7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  priceContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4C68D7',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  organizerAddress: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default EventDetails;