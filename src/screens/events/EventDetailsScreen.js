import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EventDetails from '../../components/events/EventDetails';
import { useWeb3 } from '../../contexts/Web3Context';
import { MOCK_EVENTS, mockApiCall } from '../../services/mockData';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { walletAddress } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await mockApiCall(null, 800);
      
      // Find event in mock data
      const foundEvent = MOCK_EVENTS.find(e => e.id === eventId);
      
      if (!foundEvent) {
        Alert.alert('Error', 'Event not found');
        navigation.goBack();
        return;
      }

      // Set random favorite status
      setIsFavorite(Math.random() > 0.5);
      
      // Set event data
      setEvent(foundEvent);
    } catch (error) {
      console.error('Error loading event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      // Just toggle the state for UI mockup
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleBuyTickets = async () => {
    if (!event) return;
    
    try {
      setPurchaseLoading(true);
      
      // Simulate API call delay
      await mockApiCall(null, 1500);
      
      Alert.alert(
        'Success', 
        `You have successfully purchased ${ticketQuantity} ticket(s)!`,
        [{ text: 'OK', onPress: () => navigation.navigate('Tickets') }]
      );
    } catch (error) {
      console.error('Error buying tickets:', error);
      Alert.alert('Error', 'Failed to purchase tickets. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleQuantityChange = (quantity) => {
    setTicketQuantity(quantity);
  };

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => navigation.goBack()} 
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <EventDetails 
          event={event} 
          isFavorite={isFavorite} 
          onFavoriteToggle={handleFavoriteToggle}
          onQuantityChange={handleQuantityChange}
          quantity={ticketQuantity}
        />
        
        <View style={styles.buyContainer}>
          <Button 
            title={purchaseLoading ? "Processing..." : `Buy ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`}
            onPress={handleBuyTickets}
            disabled={purchaseLoading || event.ticketRemain === '0'}
          />
          
          {event.ticketRemain === '0' && (
            <Text style={styles.soldOutText}>Sold Out</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    height: 250,
    width: '100%',
  },
  buyContainer: {
    padding: 16,
    marginBottom: 24,
  },
  soldOutText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
});

export default EventDetailsScreen;