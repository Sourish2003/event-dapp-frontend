import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import EventsScreen from '../screens/events/EventsScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import MyTicketsScreen from '../screens/tickets/MyTicketsScreen';
import TransferTicketScreen from '../screens/tickets/TransferTicketScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import FavoriteEventsScreen from '../screens/profile/FavoriteEventsScreen';

const Tab = createBottomTabNavigator();
const EventsStack = createStackNavigator();
const TicketsStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Events Stack
const EventsStackNavigator = () => {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen name="EventsList" component={EventsScreen} options={{ title: 'Events' }} />
      <EventsStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
      <EventsStack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event' }} />
    </EventsStack.Navigator>
  );
};

// Tickets Stack
const TicketsStackNavigator = () => {
  return (
    <TicketsStack.Navigator>
      <TicketsStack.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: 'My Tickets' }} />
      <TicketsStack.Screen name="TransferTicket" component={TransferTicketScreen} options={{ title: 'Transfer Ticket' }} />
      <TicketsStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
    </TicketsStack.Navigator>
  );
};

// Profile Stack
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="FavoriteEvents" component={FavoriteEventsScreen} options={{ title: 'Favorite Events' }} />
      <ProfileStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Event Details' }} />
    </ProfileStack.Navigator>
  );
};

// Tab Navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Tickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Events" component={EventsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Tickets" component={TicketsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;