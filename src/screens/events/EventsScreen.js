import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventCard from '../../components/events/EventCard';
import Loading from '../../components/common/Loading';
import { useWeb3 } from '../../contexts/Web3Context';
import { getEventsByCategory, getFeaturedEvents, getEventMetadata, isEventFavorite, favoriteEvent, unfavoriteEvent } from '../../services/ethereum/contracts';

const categories = [
  { id: 0, name: 'Music' },
  { id: 1, name: 'Sports' },
  { id: 2, name: 'Arts' },
  { id: 3, name: 'Technology' },
  { id: 4, name: 'Business' },
  { id: 5, name: 'Other' },
];

const EventsScreen = ({ navigation }) => {
  const { contracts, walletAddress } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    loadEvents();
  }, [contracts, selectedCategory]);
  
  const loadEvents = async () => {
    if (!contracts) return;
    
    try {
      setLoading(true);
      
      let eventIds;
      if (selectedCategory !== null) {
        eventIds = await getEventsByCategory(contracts.eventDiscovery, selectedCategory, 20);
      } else {
        eventIds = await getFeaturedEvents(contracts.eventDiscovery, 20);
      }
      
      const eventsData = await Promise.all(
        eventIds.map(async (id) => {
          try {
            const eventAddress = await contracts.eventFactory.getEventContract(id);
            
            // Get event core details
            const eventCoreContract = await getEventCoreContract(eventAddress, contracts.ethSigner);
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
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFavorite = async (eventId) => {
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
  
  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };
  
  const handleCreateEventPress = () => {
    navigation.navigate('CreateEvent');
  };

  if (loading) {
    return <Loading message="Loading events..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedCategory !== null ? categories[selectedCategory].name : 'Featured Events'}
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateEventPress}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === null && styles.categoryItemSelected,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.categoryTextSelected,
              ]}
            >
              Featured
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => handleEventPress(item)}
            onFavorite={() => handleFavorite(item.id)}
            isFavorite={favorites[item.id]}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadEvents}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4C68D7',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categories: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
  },
  categoryItemSelected: {
    backgroundColor: '#4C68D7',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
});

export default EventsScreen;