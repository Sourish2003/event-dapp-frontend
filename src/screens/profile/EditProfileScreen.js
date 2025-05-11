import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

const EditProfileScreen = ({ navigation }) => {
  const { userProfile, updateUserProfile, isLoading } = useAuth();
  const [userName, setUserName] = useState(userProfile?.userName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (email && !email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validate()) return;
    
    try {
      const success = await updateUserProfile(userName, email);
      
      if (success) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        setErrors({ general: 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'An error occurred while updating profile' });
    }
  };

  if (isLoading) {
    return <Loading message="Updating profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Edit Profile</Text>
          
          <Input
            label="Display Name"
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            error={errors.userName}
          />
          
          <Input
            label="Email (Optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />
          
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          
          <View style={styles.buttonContainer}>
            <Button title="Update Profile" onPress={handleUpdateProfile} />
            <Button 
              title="Cancel" 
              onPress={() => navigation.goBack()} 
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginVertical: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
  cancelButton: {
    marginTop: 12,
  },
});

export default EditProfileScreen;