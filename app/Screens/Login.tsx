/**
 * Login screen for the app
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook

// Login screen component
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation(); // Initialize navigation

  const { setShowTabBar, setRole, setUsername, setUserId } =
    useTabBarVisibility();

  // useEffect hook to run code on component mount
  useEffect(() => {
    setShowTabBar(false);
    setRole(null);
    setUsername(null);
    setUserId(null);

    // Disable hardware back button on Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    // Disable swipe back gesture on iOS
    navigation.setOptions({
      gestureEnabled: false, // Disable back navigation via swipe gesture on iOS
    });

    // Cleanup the event listener on component unmount
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log('Fetched data:', data); // Log entire data to see the response structure

        // Destructure all needed properties at once
        const { roleId, userID, username } = data;

        // Set the role based on roleId
        if (roleId === 1) {
          setRole('Pet Owner');
        } else if (roleId === 2) {
          setRole('Pet Adopter');
        }

        setUsername(username);
        setUserId(userID);

        Alert.alert('Success', 'Login successful');
        setShowTabBar(true);
        if (roleId === 1) {
          navigation.navigate('home' as never); // Pet Owner navigates to Home
        } else if (roleId === 2) {
          navigation.navigate('AdopterHome' as never); // Pet Adopter navigates to AvailablePets
        }
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

  // Function to navigate to the sign up screen
  const handleSignUp = () => {
    navigation.navigate('SignUp' as never); // Navigate to the sign up screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.loginContainer}>
        <Text
          style={styles.loginText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Please sign in below
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          testID="email-input"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="password-input"
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
    height: '100%',
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
    marginBottom: 11,
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
  },
  button: {
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
