// Mock data for events, tickets, and favorites
export const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Summer Music Festival',
    date: '2024-07-15',
    price: '0.05',
    ticketCount: '1000',
    ticketRemain: '650',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 0, // Music
    location: 'Central Park, New York',
    description: 'Join us for a day of amazing music performances from top artists across genres.',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Tech Conference 2024',
    date: '2024-09-10',
    price: '0.1',
    ticketCount: '500',
    ticketRemain: '200',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 3, // Technology
    location: 'Convention Center, San Francisco',
    description: 'Explore the latest in AI, blockchain, and other cutting-edge technologies.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Blockchain Summit',
    date: '2024-08-22',
    price: '0.08',
    ticketCount: '300',
    ticketRemain: '120',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 4, // Business
    location: 'Grand Hotel, Singapore',
    description: 'Network with blockchain experts and learn about the future of decentralized finance.',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isFeatured: false,
  },
  {
    id: '4',
    name: 'Art Exhibition',
    date: '2024-07-28',
    price: '0.03',
    ticketCount: '200',
    ticketRemain: '180',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 2, // Arts
    location: 'Modern Gallery, London',
    description: 'Experience contemporary art from emerging artists around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Sports Championship',
    date: '2024-08-05',
    price: '0.06',
    ticketCount: '5000',
    ticketRemain: '2000',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 1, // Sports
    location: 'Main Stadium, Berlin',
    description: 'Watch the final match of this year\'s championship with the best teams competing.',
    imageUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80',
    isFeatured: false,
  }
];

export const MOCK_USER_TICKETS = [
  {
    eventId: '1',
    count: '2',
    name: 'Summer Music Festival',
    date: '2024-07-15',
    location: 'Central Park, New York',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1050&q=80',
  },
  {
    eventId: '4',
    count: '1',
    name: 'Art Exhibition',
    date: '2024-07-28',
    location: 'Modern Gallery, London',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  }
];

export const MOCK_FAVORITE_EVENTS = [
  {
    id: '2',
    name: 'Tech Conference 2024',
    date: '2024-09-10',
    price: '0.1',
    ticketCount: '500',
    ticketRemain: '200',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 3, // Technology
    location: 'Convention Center, San Francisco',
    description: 'Explore the latest in AI, blockchain, and other cutting-edge technologies.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Art Exhibition',
    date: '2024-07-28',
    price: '0.03',
    ticketCount: '200',
    ticketRemain: '180',
    organizer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    category: 2, // Arts
    location: 'Modern Gallery, London',
    description: 'Experience contemporary art from emerging artists around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isFavorite: true,
  }
];

// Helper function to simulate API call with delay
export const mockApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Categories
export const EVENT_CATEGORIES = [
  { id: 0, name: 'Music' },
  { id: 1, name: 'Sports' },
  { id: 2, name: 'Arts' },
  { id: 3, name: 'Technology' },
  { id: 4, name: 'Business' },
  { id: 5, name: 'Other' },
]; 