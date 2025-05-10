import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import { useWeb3 } from '../../contexts/Web3Context';
import { getEventCoreContract } from '../../config/blockchainConfig';
import { getEventMetadata, isEventFavorite, favoriteEvent, unfavoriteEvent, buyTickets } from '../../services/ethereum/contracts';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EventDetails from '../../components/events/EventDetails';
import { ethers } from 'ethers';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { contracts, walletAddress, ethSigner } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [eventId, contracts]);

  const loadEventDetails = async () => {
    if (!contracts || !eventId) return;

    try {
      setLoading(true);
      // Get event contract address
      const eventAddress = await contracts.eventFactory.getEventContract(eventId);
      
      if (!eventAddress || eventAddress === ethers.constants.AddressZero) {
        Alert.alert('Error', 'Event not found');
        navigation.goBack();
        return;
      }

      // Get event core contract
      const eventCoreContract = getEventCoreContract(eventAddress, ethSigner);
      
      // Get event details
      const details = await eventCoreContract.getEventDetails();
      
      // Get event metadata
      const metadata = await getEventMetadata(contracts.eventDiscovery, eventId);
      
      // Check if event is favorited
      const favStatus = await isEventFavorite(contracts.userTicketHub, walletAddress, eventId);
      setIsFavorite(favStatus);

      setEvent({
        id: eventId,
        name: details._name,
        date: details._date.toString(),
        price: ethers.utils.formatEther(details._price.toString()),
        ticketCount: details._ticketCount.toString(),
        ticketRemain: details._ticketRemain.toString(),
        organizer: details._organizer,
        category: metadata.category,
        location: metadata.location,
        description: metadata.description,
        imageUrl: `https://ipfs.io/ipfs/${metadata.imageHash}`,
        isFeatured: metadata.isFeatured,
        popularity: metadata.popularity,
      });
    } catch (error) {
      console.error('Error loading event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await unfavoriteEvent(contracts.userTicketHub, eventId);
      } else {
        await favoriteEvent(contracts.userTicketHub, eventId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleBuyTickets = async () => {
    if (!event || !contracts) return;
    
    try {
      setPurchaseLoading(true);
      
      // Call the buyTickets function with the event price
      await buyTickets(
        contracts.userTicketHub, 
        eventId, 
        ticketQuantity, 
        event.price
      );
      
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