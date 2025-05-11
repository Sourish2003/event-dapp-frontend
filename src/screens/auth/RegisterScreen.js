import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = () => {
  const { register, isLoading } = useAuth();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
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

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      const success = await register({ name: userName, email });
      if (!success) {
        setErrors({ general: 'Failed to register. Please try again.' });
      }
    } catch (e) {
      setErrors({ general: 'An error occurred during registration.' });
      console.error(e);
    }
  };

  if (isLoading) {
    return <Loading message="Creating your profile..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>
              Set up your profile to start buying tickets and attending events
            </Text>
            
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
            
            <Button title="Create Profile" onPress={handleRegister} />
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
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  errorText: {
    color: '#FF3B30',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;