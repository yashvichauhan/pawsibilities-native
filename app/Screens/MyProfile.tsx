/**
 * My Profile Screen for Pet Owners and Pet Adopters
 */
import * as React from 'react';
import { PaperProvider, Text, Button } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import config from '../../envconfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../models/UserModel';
import { useNavigation } from '@react-navigation/native';
import { useTabBarVisibility } from '@/context/TabBarContext';

const MyProfile: React.FC = () => {
  const [user, setUser] = useState<User>({} as User);
  const navigation = useNavigation();
  const { userId } = useTabBarVisibility();

  // Fetch the user details from the API
  useEffect(() => {
    // Load the current user details from the API using userId
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `https://pawsibilities-api.onrender.com/api/user/${userId}`,
          );
          setUser(response.data);
          console.log('User:', response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>My Profile</Text>
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s',
            }}
            style={styles.profileImage}
          />
          <View style={styles.userDetails}>
            <Text style={styles.username}>Username: {user?.username}</Text>
            <Text style={styles.userInfo}>Email: {user?.email}</Text>
            <Text style={styles.userInfo}>
              Role Description: {user?.roleDescription}
            </Text>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('EditProfile' as never)}
                style={[styles.button, styles.editButton]}
                labelStyle={styles.buttonText}
              >
                Edit Profile
              </Button>
            </View>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6200ee',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6200ee',
  },
  userInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default MyProfile;
