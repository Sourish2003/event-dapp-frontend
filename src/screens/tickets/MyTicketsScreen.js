import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Text } from 'react-native';
import { useWeb3 } from '../../contexts/Web3Context';
import { getUserTickets } from '../../services/ethereum/contracts';
import TicketCard from '../../components/tickets/TicketCard';
import Loading from '../../components/common/Loading';
import { getEventCoreContract } from '../../config/blockchainConfig';
import { ethers } from 'ethers';

const MyTicketsScreen = ({ navigation }) => {
  const { contracts, walletAddress, ethSigner } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, [contracts, walletAddress]);

  // Load tickets when focusing the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTickets();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTickets = async () => {
    if (!contracts || !walletAddress) return;
    
    try {
      setLoading(true);
      
      // Get user tickets from the contract
      const userTickets = await getUserTickets(contracts.userTicketHub, walletAddress);
      
      // Get detailed information for each ticket
      const ticketsWithDetails = await Promise.all(
        userTickets.map(async (ticket) => {
          try {
            // Get event contract address
            const eventAddress = await contracts.eventFactory.getEventContract(ticket.eventId);
            
            if (!eventAddress || eventAddress === ethers.constants.AddressZero) {
              return null;
            }
            
            // Get event details
            const eventCoreContract = getEventCoreContract(eventAddress, ethSigner);
            const details = await eventCoreContract.getEventDetails();
            
            // Get metadata
            const metadata = await contracts.eventDiscovery.getEventMetadata(ticket.eventId);
            
            return {
              eventId: ticket.eventId,
              count: ticket.count,
              name: details._name,
              date: details._date.toString(),
              location: metadata.location,
              imageUrl: `https://ipfs.io/ipfs/${metadata.imageHash}`,
            };
          } catch (error) {
            console.error(`Error loading ticket ${ticket.eventId}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null tickets (errors)
      setTickets(ticketsWithDetails.filter(ticket => ticket !== null));
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