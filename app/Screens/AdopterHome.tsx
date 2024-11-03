import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useTabBarVisibility } from '@/context/TabBarContext';

export default function AdopterHome() {
  const navigation = useNavigation();
  const { username } = useTabBarVisibility();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>
      {username && <Text style={styles.title}>Hello, {username}!</Text>}
      <View style={styles.separator} />

      {/* Section 1: View Available Pets */}
      <View style={[styles.section, styles.sectionAvailablePets]}>
        <FontAwesome name="paw" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>Explore Available Pets</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AvailablePets' as never)}
        >
          <Text style={styles.buttonText}>View Pets</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: My Favorite Pets */}
      <View style={[styles.section, styles.sectionFavorites]}>
        <FontAwesome name="heart" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>My Favorites</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Favorites' as never)}
        >
          <Text style={styles.buttonText}>Go to Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* Section 3: About Us  */}
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

      {/* Section 4: My Profile */}
      <View style={[styles.section, styles.sectionProfile]}>
        <FontAwesome name="user" size={24} color="#fff" />
        <Text style={styles.sectionTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MyProfile' as never)}
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    color: '#fff',
  },
  sectionAvailablePets: {
    backgroundColor: '#4CAF50', // Green for "View Available Pets"
  },
  sectionFavorites: {
    backgroundColor: '#FF6F61', // Red for "My Favorites"
  },
  sectionAboutUs: {
    backgroundColor: '#5D9CEC', // Blue for "Learn About Adoption"
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
