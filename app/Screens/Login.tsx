import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert, BackHandler } from 'react-native';
import { Text, View } from '../../components/Themed';

import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();  // Initialize navigation

  const { setShowTabBar } = useTabBarVisibility();

  useEffect(() => {

    setShowTabBar(false);

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

          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Create new account" onPress={handleSignUp} />
          </View>
            
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
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,  // Add vertical space between buttons
  },
});
