import { ethers } from 'ethers';

// Event Factory Functions
export const createEvent = async (contract, name, date, price, ticketCount) => {
  try {
    // Convert price to wei (assuming price is in ETH)
    const priceInWei = ethers.utils.parseEther(price.toString());
    
    // Create transaction
    const tx = await contract.createEvent(name, date, priceInWei, ticketCount);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Parse event from receipt
    const event = receipt.events.find(e => e.event === 'EventCreated');
    if (!event) {
      throw new Error('Event creation failed');
    }
    
    // Return event ID
    return event.args.eventId.toString();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Event Discovery Functions
export const getEventsByCategory = async (contract, category, count) => {
  try {
    const eventIds = await contract.getEventsByCategory(category, count);
    return eventIds.map(id => id.toString());
  } catch (error) {
    console.error('Error getting events by category:', error);
    throw error;
  }
};

export const getFeaturedEvents = async (contract, count) => {
  try {
    const eventIds = await contract.getFeaturedEvents(count);
    return eventIds.map(id => id.toString());
  } catch (error) {
    console.error('Error getting featured events:', error);
    throw error;
  }
};

export const getEventMetadata = async (contract, eventId) => {
  try {
    const metadata = await contract.getEventMetadata(eventId);
    return {
      category: metadata.category,
      location: metadata.location,
      description: metadata.description,
      imageHash: metadata.imageHash,
      createdAt: metadata.createdAt.toString(),
      isFeatured: metadata.isFeatured,
      popularity: metadata.popularity.toString()
    };
  } catch (error) {
    console.error('Error getting event metadata:', error);
    throw error;
  }
};

// User Ticket Hub Functions
export const buyTickets = async (contract, eventId, quantity, price) => {
  try {
    // Convert price to wei and multiply by quantity
    const totalPrice = ethers.utils.parseEther(price.toString()).mul(quantity);
    
    // Buy tickets
    const tx = await contract.buyTickets(eventId, quantity, { value: totalPrice });
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error buying tickets:', error);
    throw error;
  }
};

export const transferTickets = async (contract, eventId, to, quantity) => {
  try {
    const tx = await contract.transferTickets(eventId, to, quantity);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error transferring tickets:', error);
    throw error;
  }
};

export const getUserTickets = async (contract, userAddress) => {
  try {
    // Get events the user is attending
    const eventIds = await contract.getUserAttendingEvents(userAddress);
    
    // Get ticket count for each event
    const tickets = await Promise.all(
      eventIds.map(async (eventId) => {
        const count = await contract.getUserTicketCount(userAddress, eventId);
        return {
          eventId: eventId.toString(),
          count: count.toString()
        };
      })
    );
    
    return tickets;
  } catch (error) {
    console.error('Error getting user tickets:', error);
    throw error;
  }
};

export const favoriteEvent = async (contract, eventId) => {
  try {
    const tx = await contract.favoriteEvent(eventId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error favoriting event:', error);
    throw error;
  }
};

export const unfavoriteEvent = async (contract, eventId) => {
  try {
    const tx = await contract.unfavoriteEvent(eventId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error unfavoriting event:', error);
    throw error;
  }
};

export const isEventFavorite = async (contract, userAddress, eventId) => {
  try {
    return await contract.isEventFavorite(userAddress, eventId);
  } catch (error) {
    console.error('Error checking if event is favorite:', error);
    throw error;
  }
};