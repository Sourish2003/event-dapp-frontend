import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useWeb3 } from '../../contexts/Web3Context';
import { createEvent } from '../../services/ethereum/contracts';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

const categories = [
  { id: 0, name: 'Music' },
  { id: 1, name: 'Sports' },
  { id: 2, name: 'Arts' },
  { id: 3, name: 'Technology' },
  { id: 4, name: 'Business' },
  { id: 5, name: 'Other' },
];

const CreateEventScreen = ({ navigation }) => {
  const { contracts } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventTime, setEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(0);
  const [price, setPrice] = useState('');
  const [ticketCount, setTicketCount] = useState('');
  const [imageHash, setImageHash] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    // Validate price
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Price must be a valid number';
    }
    
    // Validate ticket count
    if (!ticketCount.trim()) {
      newErrors.ticketCount = 'Ticket count is required';
    } else if (isNaN(parseInt(ticketCount)) || parseInt(ticketCount) <= 0) {
      newErrors.ticketCount = 'Ticket count must be a positive number';
    }
    
    // Validate date (must be in the future)
    const combinedDate = new Date(eventDate);
    combinedDate.setHours(eventTime.getHours(), eventTime.getMinutes());
    if (combinedDate <= new Date()) {
      newErrors.date = 'Event date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      // Combine date and time
      const combinedDate = new Date(eventDate);
      combinedDate.setHours(eventTime.getHours(), eventTime.getMinutes());
      const timestamp = Math.floor(combinedDate.getTime() / 1000); // Convert to Unix timestamp
      
      // Create the event on the blockchain
      const eventId = await createEvent(
        contracts.eventFactory,
        eventName,
        timestamp,
        price,
        parseInt(ticketCount)
      );
      
      // Add metadata to the event
      await contracts.eventDiscovery.addEventMetadata(
        eventId,
        category,
        location,
        description,
        imageHash || 'QmdefaultImageHash' // Use default if not provided
      );
      
      Alert.alert(
        'Success',
        'Your event has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('EventsList') }]
      );
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    // In a real app, this would connect to IPFS or similar
    // For now, we'll just set a dummy hash
    setImageHash('QmexampleImageHash');
    Alert.alert('Success', 'Image uploaded successfully');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setEventTime(selectedTime);
    }
  };

  if (loading) {
    return <Loading message="Creating your event..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create New Event</Text>
            
            <Input
              label="Event Name"
              value={eventName}
              onChangeText={setEventName}
              placeholder="Enter event name"
              error={errors.eventName}
            />
            
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Event Date</Text>
              <Button 
                title={eventDate.toLocaleDateString()} 
                onPress={() => setShowDatePicker(true)}
                variant="secondary"
              />
              {showDatePicker && (
                <DateTimePicker
                  value={eventDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>
            
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Event Time</Text>
              <Button 
                title={eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                onPress={() => setShowTimePicker(true)}
                variant="secondary"
              />
              {showTimePicker && (
                <DateTimePicker
                  value={eventTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
            
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter event location"
              error={errors.location}
            />
            
            <Input
              label="Price (ETH)"
              value={price}
              onChangeText={setPrice}
              placeholder="0.01"
              keyboardType="numeric"
              error={errors.price}
            />
            
            <Input
              label="Number of Tickets"
              value={ticketCount}
              onChangeText={setTicketCount}
              placeholder="100"
              keyboardType="numeric"
              error={errors.ticketCount}
            />
            
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
              error={errors.description}
            />
            
            <View style={styles.imageSection}>
              <Text style={styles.label}>Event Image</Text>
              <Button 
                title={imageHash ? "Change Image" : "Upload Image"} 
                onPress={handleUploadImage}
                variant="secondary"
              />
              {imageHash && (
                <Text style={styles.imageHash}>
                  Image uploaded: {imageHash.substring(0, 10)}...
                </Text>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <Button title="Create Event" onPress={handleCreateEvent} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  textArea: {
    height: 100,
  },
  imageSection: {
    marginBottom: 16,
  },
  imageHash: {
    marginTop: 8,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});

export default CreateEventScreen;