import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

export default function SignUp({ path }: { path: string }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Pet Owner');

  const navigation = useNavigation();  // Initialize navigation


  const handleSubmit = async () => {
    // Determine roleId and roleDescription based on the userType
    const roleId = userType === 'Pet Owner' ? '1' : '2';
    const roleDescription = userType === 'Pet Owner' ? 'Pet Owner' : 'Pet Adopter';

    try {
      const response = await fetch('https://pawsibilities-api.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          roleId,
          roleDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      Alert.alert('Success', 'Sign up successful');
    } catch (error) {
      Alert.alert('Error', 'There was a problem signing up');
      console.log(error);
    }

    // Reset the input fields after submission
    setUsername('');
    setEmail('');
    setPassword('');
    setUserType('Pet Owner')
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);  // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              <View style={styles.getStartedContainer}>
                <Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
                  Please enter details below
                </Text>

                {/* Radio buttons for User Type */}
                <View style={styles.radioContainer}>
                  <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('Pet Owner')}>
                    <View style={styles.radioCircle}>
                      {userType === 'Pet Owner' && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.radioText}>Pet Owner</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.radioButton} onPress={() => setUserType('Pet Adopter')}>
                    <View style={styles.radioCircle}>
                      {userType === 'Pet Adopter' && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.radioText}>Pet Adopter</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={setUsername}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Button title="Submit" onPress={handleSubmit} />
                <Button title="Click here to sign in" onPress={handleLogin} />
              </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    height: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  heading: {
    fontSize: 38,
    fontWeight: '700',
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 11
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 20,
  },
  getStartedText: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 16,
  },
});
