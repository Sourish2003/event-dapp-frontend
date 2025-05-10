import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Text } from 'react-native';
import { useWeb3 } from '../../contexts/Web3Context';
import { getEventCoreContract } from '../../config/blockchainConfig';
import EventCard from '../../components/events/EventCard';
import Loading from '../../components/common/Loading';
import { ethers } from 'ethers';
import { getEventMetadata, isEventFavorite, unfavoriteEvent } from '../../services/ethereum/contracts';

const FavoriteEventsScreen = ({ navigation }) => {
  const { contracts, walletAddress, ethSigner } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadFavoriteEvents();
  }, [contracts, walletAddress]);

  // Load events when focusing the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavoriteEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavoriteEvents = async () => {
    if (!contracts || !walletAddress) return;
    
    try {
      setLoading(true);
      
      // Get all events from the factory
      const eventCount = await contracts.eventFactory.nextEventId();
      const eventIds = Array.from({ length: eventCount.toNumber() }, (_, i) => i);
      
      // Get favorited status for each event
      const favoritePromises = eventIds.map(async (id) => {
        try {
          const isFav = await isEventFavorite(contracts.userTicketHub, walletAddress, id);
          return { id, isFavorite: isFav };
        } catch (error) {
          console.error(`Error checking favorite status for event ${id}:`, error);
          return { id, isFavorite: false };
        }
      });
      
      const favoriteStatuses = await Promise.all(favoritePromises);
      const favoriteEventIds = favoriteStatuses
        .filter(status => status.isFavorite)
        .map(status => status.id);
      
      // Get details for favorited events
      const eventsData = await Promise.all(
        favoriteEventIds.map(async (id) => {
          try {
            const eventAddress = await contracts.eventFactory.getEventContract(id);
            
            if (!eventAddress || eventAddress === ethers.constants.AddressZero) {
              return null;
            }
            
            // Get event core details
            const eventCoreContract = getEventCoreContract(eventAddress, ethSigner);
            const eventDetails = await eventCoreContract.getEventDetails();
            
            // Get event metadata
            const metadata = await getEventMetadata(contracts.eventDiscovery, id);
            
            return {
              id,
              name: eventDetails._name,
              date: eventDetails._date.toString(),
              price: ethers.utils.formatEther(eventDetails._price.toString()),
              ticketCount: eventDetails._ticketCount.toString(),
              ticketRemain: eventDetails._ticketRemain.toString(),
              organizer: eventDetails._organizer,
              category: metadata.category,
              location: metadata.location,
              description: metadata.description,
              imageUrl: `https://ipfs.io/ipfs/${metadata.imageHash}`,
              isFavorite: true,
            };
          } catch (error) {
            console.error(`Error loading event ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null events (errors)
      setEvents(eventsData.filter(e => e !== null));
    } catch (error) {
      console.error('Error loading favorite events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleUnfavorite = async (eventId) => {
    try {
      await unfavoriteEvent(contracts.userTicketHub, eventId);
      
      // Update events list
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error unfavoriting event:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading favorite events..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => handleEventPress(item)}
                onFavorite={() => handleUnfavorite(item.id)}
                isFavorite={true}
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={loadFavoriteEvents}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any favorite events yet</Text>
            <Text style={styles.emptySubtext}>
              Browse events and favorite ones you're interested in
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FavoriteEventsScreen;