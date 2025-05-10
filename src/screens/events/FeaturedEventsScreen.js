import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Text } from 'react-native';
import { useWeb3 } from '../../contexts/Web3Context';
import { getEventCoreContract } from '../../config/blockchainConfig';
import EventCard from '../../components/events/EventCard';
import Loading from '../../components/common/Loading';
import { ethers } from 'ethers';
import { getFeaturedEvents, getEventMetadata, isEventFavorite, favoriteEvent, unfavoriteEvent } from '../../services/ethereum/contracts';

const FeaturedEventsScreen = ({ navigation }) => {
  const { contracts, walletAddress, ethSigner } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    loadFeaturedEvents();
  }, [contracts, walletAddress]);

  const loadFeaturedEvents = async () => {
    if (!contracts) return;
    
    try {
      setLoading(true);
      
      // Get featured events
      const eventIds = await getFeaturedEvents(contracts.eventDiscovery, 10);
      
      // Get details for each event
      const eventsData = await Promise.all(
        eventIds.map(async (id) => {
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
            
            // Check if event is favorited
            const isFav = await isEventFavorite(contracts.userTicketHub, walletAddress, id);
            
            setFavorites(prev => ({ ...prev, [id]: isFav }));
            
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
              isFeatured: metadata.isFeatured,
              popularity: metadata.popularity,
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
      console.error('Error loading featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleFavoriteToggle = async (eventId) => {
    try {
      const isFav = favorites[eventId];
      
      if (isFav) {
        await unfavoriteEvent(contracts.userTicketHub, eventId);
      } else {
        await favoriteEvent(contracts.userTicketHub, eventId);
      }
      
      // Update state
      setFavorites(prev => ({ ...prev, [eventId]: !isFav }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <Loading message="Loading featured events..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Featured Events</Text>
        
        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => handleEventPress(item)}
                onFavorite={() => handleFavoriteToggle(item.id)}
                isFavorite={favorites[item.id]}
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={loadFeaturedEvents}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No featured events available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for featured events
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
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
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

export default FeaturedEventsScreen;