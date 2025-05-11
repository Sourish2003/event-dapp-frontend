// src/services/sui/transactions.js
import { SUI_PACKAGE_ID, SUI_RPC_URL } from '@env';
import { JsonRpcProvider } from '@mysten/sui.js/client';
import { RawSigner } from '@mysten/sui.js/signers';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getSuiWallet } from './wallet';

// Initialize provider
const getProvider = () => {
  return new JsonRpcProvider(SUI_RPC_URL);
};

// Create an event on Sui blockchain
export const createEventOnSui = async (name, date, location, description, ticketPrice, totalTickets) => {
  try {
    const { keypair } = await getSuiWallet();
    if (!keypair) throw new Error('Wallet not found');
    
    const provider = getProvider();
    const signer = new RawSigner(keypair, provider);
    
    // Create a transaction block
    const txb = new TransactionBlock();
    
    // Add the create_event call
    txb.moveCall({
      target: `${SUI_PACKAGE_ID}::event_manager::create_event`,
      arguments: [
        txb.pure(name),
        txb.pure(Math.floor(date / 1000)), // Convert from JS date (ms) to seconds
        txb.pure(location),
        txb.pure(description),
        txb.pure(ticketPrice), // In SUI base units
        txb.pure(totalTickets),
      ],
    });
    
    // Sign and execute the transaction
    const response = await signer.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });
    
    // Extract the event ID from the transaction response
    const eventId = parseEventIdFromResponse(response);
    
    return {
      success: true,
      eventId,
      response
    };
  } catch (error) {
    console.error('Error creating event on Sui:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Buy a ticket for an event on Sui blockchain
export const buyTicketOnSui = async (eventId, paymentAmount) => {
  try {
    const { keypair } = await getSuiWallet();
    if (!keypair) throw new Error('Wallet not found');
    
    const provider = getProvider();
    const signer = new RawSigner(keypair, provider);
    
    // Create a transaction block
    const txb = new TransactionBlock();
    
    // Get user's coins
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(paymentAmount)]);
    
    // Add the buy_ticket call
    txb.moveCall({
      target: `${SUI_PACKAGE_ID}::event_manager::buy_ticket`,
      arguments: [
        txb.object(eventId), // Event object ID
        coin, // Payment
      ],
    });
    
    // Sign and execute the transaction
    const response = await signer.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      }
    });
    
    // Extract the ticket ID from the transaction response
    const ticketId = parseTicketIdFromResponse(response);
    
    return {
      success: true,
      ticketId,
      response
    };
  } catch (error) {
    console.error('Error buying ticket on Sui:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Transfer a ticket to another user on Sui blockchain
export const transferTicketOnSui = async (ticketId, recipientAddress) => {
  try {
    const { keypair } = await getSuiWallet();
    if (!keypair) throw new Error('Wallet not found');
    
    const provider = getProvider();
    const signer = new RawSigner(keypair, provider);
    
    // Create a transaction block
    const txb = new TransactionBlock();
    
    // Add the transfer_ticket call
    txb.moveCall({
      target: `${SUI_PACKAGE_ID}::event_manager::transfer_ticket`,
      arguments: [
        txb.object(ticketId), // Ticket object ID
        txb.pure(recipientAddress), // Recipient address
      ],
    });
    
    // Sign and execute the transaction
    const response = await signer.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
      }
    });
    
    return {
      success: true,
      response
    };
  } catch (error) {
    console.error('Error transferring ticket on Sui:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get all events created on Sui blockchain
export const getEventsOnSui = async () => {
  try {
    const provider = getProvider();
    
    // Query events by type
    const events = await provider.getEvents({
      query: {
        MoveEventType: `${SUI_PACKAGE_ID}::event_manager::EventCreated`
      },
      limit: 50
    });
    
    return {
      success: true,
      events: events.data.map(event => ({
        eventId: event.moveEvent.fields.event_id,
        name: event.moveEvent.fields.name,
        organizer: event.moveEvent.fields.organizer,
        timestamp: event.timestampMs
      }))
    };
  } catch (error) {
    console.error('Error getting events on Sui:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user's tickets on Sui blockchain
export const getUserTicketsOnSui = async () => {
  try {
    const { address } = await getSuiWallet();
    if (!address) throw new Error('Wallet not found');
    
    const provider = getProvider();
    
    // Get objects owned by the user
    const objects = await provider.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${SUI_PACKAGE_ID}::event_manager::Ticket`
      },
      options: {
        showContent: true
      }
    });
    
    // Format ticket data
    const tickets = objects.data.map(obj => {
      const content = obj.data.content;
      
      return {
        ticketId: obj.data.objectId,
        eventId: content.fields.event_id,
        ticketNumber: content.fields.ticket_number,
        version: obj.data.version
      };
    });
    
    // Get event details for each ticket
    const ticketsWithEvents = await Promise.all(
      tickets.map(async (ticket) => {
        try {
          const eventObj = await provider.getObject({
            id: ticket.eventId,
            options: {
              showContent: true
            }
          });
          
          const eventContent = eventObj.data.content;
          
          return {
            ...ticket,
            eventName: eventContent.fields.name,
            eventDate: eventContent.fields.date,
            eventLocation: eventContent.fields.location,
            ticketPrice: eventContent.fields.ticket_price
          };
        } catch (error) {
          console.error(`Error fetching event ${ticket.eventId}:`, error);
          return ticket;
        }
      })
    );
    
    return {
      success: true,
      tickets: ticketsWithEvents
    };
  } catch (error) {
    console.error('Error getting user tickets on Sui:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper functions to parse transaction responses
const parseEventIdFromResponse = (response) => {
  if (!response.events || response.events.length === 0) {
    throw new Error('No events found in transaction response');
  }
  
  // Find the EventCreated event
  const createdEvent = response.events.find(e => 
    e.type.includes('::event_manager::EventCreated')
  );
  
  if (!createdEvent) {
    throw new Error('EventCreated event not found in transaction');
  }
  
  return createdEvent.parsedJson.event_id;
};

const parseTicketIdFromResponse = (response) => {
  if (!response.events || response.events.length === 0) {
    throw new Error('No events found in transaction response');
  }
  
  // Find the TicketPurchased event
  const purchasedEvent = response.events.find(e => 
    e.type.includes('::event_manager::TicketPurchased')
  );
  
  if (!purchasedEvent) {
    throw new Error('TicketPurchased event not found in transaction');
  }
  
  return purchasedEvent.parsedJson.ticket_id;
};