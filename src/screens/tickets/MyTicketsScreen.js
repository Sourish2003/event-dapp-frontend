import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Loading from '../../components/common/Loading';
import TicketCard from '../../components/tickets/TicketCard';
import { useWeb3 } from '../../contexts/Web3Context';
import { MOCK_USER_TICKETS, mockApiCall } from '../../services/mockData';

const MyTicketsScreen = ({ navigation }) => {
  const { walletAddress } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, [walletAddress]);

  // Load tickets when focusing the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTickets();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await mockApiCall(null, 800);
      
      // Use mock tickets
      setTickets(MOCK_USER_TICKETS);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketPress = (ticket) => {
    navigation.navigate('EventDetails', { eventId: ticket.eventId });
  };

  const handleTransferTicket = (ticket) => {
    navigation.navigate('TransferTicket', { 
      eventId: ticket.eventId,
      ticketCount: ticket.count,
      eventName: ticket.name
    });
  };

  if (loading) {
    return <Loading message="Loading your tickets..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {tickets.length > 0 ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.eventId}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={() => handleTicketPress(item)}
                onTransfer={() => handleTransferTicket(item)}
              />
            )}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={loadTickets}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any tickets yet</Text>
            <Text style={styles.emptySubtext}>
              Browse events and purchase tickets to see them here
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

export default MyTicketsScreen;