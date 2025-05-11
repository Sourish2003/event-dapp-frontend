import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../../components/common/Loading';
import EventCard from '../../components/events/EventCard';
import { useWeb3 } from '../../contexts/Web3Context';
import { EVENT_CATEGORIES, MOCK_EVENTS, mockApiCall } from '../../services/mockData';

const EventsScreen = ({ navigation }) => {
  const { walletAddress } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    loadEvents();
  }, [selectedCategory]);
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Filter events by category or get all events if no category is selected
      const filteredEvents = selectedCategory !== null
        ? MOCK_EVENTS.filter(event => event.category === selectedCategory)
        : MOCK_EVENTS.filter(event => event.isFeatured);
      
      // Simulate network delay
      await mockApiCall(null, 800);
      
      // Initialize favorites
      const favs = {};
      filteredEvents.forEach(event => {
        favs[event.id] = Math.random() > 0.5; // Randomly set some events as favorites
      });
      
      setFavorites(favs);
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFavorite = async (eventId) => {
    try {
      setFavorites(prev => ({ ...prev, [eventId]: !prev[eventId] }));
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
          {selectedCategory !== null ? EVENT_CATEGORIES[selectedCategory].name : 'Featured Events'}
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
          
          {EVENT_CATEGORIES.map((category) => (
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