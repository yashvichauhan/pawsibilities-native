import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert, BackHandler, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();  // Initialize navigation

  const { setShowTabBar, setRole } = useTabBarVisibility();

  useEffect(() => {

    setShowTabBar(false);
    setRole(null);

    // Disable hardware back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Disable swipe back gesture on iOS
    navigation.setOptions({
      gestureEnabled: false,  // Disable back navigation via swipe gesture on iOS
    });

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://pawsibilities-api.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Fetched data:', data);  // Log entire data to see the response structure

        // Destructure all needed properties at once
        const { roleId, userID, username } = data;

        // Set the role based on roleId
        if (roleId === 1) {
          setRole('Pet Owner');
        } else if (roleId === 2) {
          setRole('Pet Adopter');
        }

        // Save userID if it exists
        if (userID) {
          try {
            await AsyncStorage.setItem('userID', userID);
            console.log('User ID saved successfully');
          } catch (error) {
            console.error('Error saving User ID to AsyncStorage:', error);
          }
        } else {
          console.error('Error: userID is undefined or null');
        }

        // Save username if it exists
        if (username) {
          try {
            await AsyncStorage.setItem('username', username);
            console.log('Username saved successfully');
          } catch (error) {
            console.error('Error saving username to AsyncStorage:', error);
          }
        } else {
          console.error('Error: username is undefined or null');
        }

        Alert.alert('Success', 'Login successful');
        setShowTabBar(true);
        navigation.navigate('home' as never);

      } else {
        Alert.alert('Error', 'Login attempt failed');
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem logging in');
      console.log(error);
    }

    // Clear the input fields after submission
    setEmail('');
    setPassword('');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp' as never);  // Navigate to the sign up screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <View style={styles.loginContainer}>
            <Text style={styles.loginText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
              Please sign in below
            </Text>

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

<TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create new account</Text>
        </TouchableOpacity>
            
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
  loginContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 20,
  },
  loginText: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#6200ee',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
