import React, { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook

export default function TabOneScreen() {
  const navigation = useNavigation();

  //const [username, setUsername] = useState<string | null>(null);

  const { username } = useTabBarVisibility(); // Use context to get the tab visibility state

  /*useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        setUsername(storedUsername);
      } catch (error) {
        console.error('Failed to fetch username from AsyncStorage', error);
      }
    };
    fetchUsername();
  }, []);*/

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      {username && <Text style={styles.title}>Howdy, {username}!</Text>}
      <View style={styles.separator} />

      <EditScreenInfo path="app/Screens/index.tsx" />

      {/* Section 1: View Previously Posted Pets */}
      <View style={[styles.section, styles.sectionViewPets]}>
        <FontAwesome name="paw" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>View Previously Posted Pets</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewPets' as never)}
        >
          <Text style={styles.buttonText}>View Pets</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Post New Pet for Adoption */}
      <View style={[styles.section, styles.sectionPostPet]}>
        <FontAwesome name="plus-circle" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>Post a New Pet for Adoption</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PostNewPet' as never)}
        >
          <Text style={styles.buttonText}>Post a Pet</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3: About Us */}
      <View style={[styles.section, styles.sectionAboutUs]}>
        <FontAwesome name="info-circle" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>About Us</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AboutUs' as never)}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, styles.sectionProfile]}>
        <FontAwesome name="user" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Account' as never)}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
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
    backgroundColor: '#eee',
  },
  heading: {
    fontSize: 38,
    fontWeight: '700',
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 11,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5', // Default color
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    color: '#fff',
  },
  sectionViewPets: {
    backgroundColor: '#4CAF50', // Green for "View Pets"
  },
  sectionPostPet: {
    backgroundColor: '#FFA500', // Orange for "Post New Pet"
  },
  sectionAboutUs: {
    backgroundColor: '#2196F3', // Blue for "About Us"
  },
  sectionProfile: {
    backgroundColor: '#9678cd', // Light Purple for "My Profile"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#b39ddb', // Light purple border for button
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
