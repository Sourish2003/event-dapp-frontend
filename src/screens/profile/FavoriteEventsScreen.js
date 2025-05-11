import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Loading from '../../components/common/Loading';
import EventCard from '../../components/events/EventCard';
import { useWeb3 } from '../../contexts/Web3Context';
import { MOCK_FAVORITE_EVENTS, mockApiCall } from '../../services/mockData';

const FavoriteEventsScreen = ({ navigation }) => {
  const { walletAddress } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadFavoriteEvents();
  }, [walletAddress]);

  // Load events when focusing the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavoriteEvents();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavoriteEvents = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await mockApiCall(null, 800);
      
      // Use mock favorite events
      setEvents(MOCK_FAVORITE_EVENTS);
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
      // Update events list by removing the unfavorited event
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