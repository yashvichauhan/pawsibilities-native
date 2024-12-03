/**
 * Edit Profile Screen for users to update their profile details
 */
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  PaperProvider,
  TextInput,
  Button,
  Card,
  Text,
} from 'react-native-paper';
import config from '../../envconfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../models/UserModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTabBarVisibility } from '@/context/TabBarContext';

const EditProfile: React.FC = () => {
  const { userId } = useTabBarVisibility();
  const [user, setUser] = useState<User>({} as User);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user details using userId
    const fetchUser = async (id: string) => {
      try {
        const response = await axios.get(`${config.baseURL}/user/${id}`);
        const userData = { ...response.data, newPassword: '' };
        setUser(userData);
        console.log('User:', userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (userId) {
      fetchUser(userId);
    }
  }, [userId, lastUpdated]);

  /**
   * Update user details in the database
   * @returns void
   */
  const handleSave = async () => {
    try {
      console.log('Updating user:', user);
      await axios.put(`${config.baseURL}/user/${user._id}`, user);
      setLastUpdated(new Date());
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Profile</Text>
        <Card style={styles.profileCard}>
          <Card.Content>
            <TextInput
              label="Username"
              value={user?.username}
              onChangeText={(text) => setUser({ ...user, username: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Email"
              value={user?.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Password"
              value={user?.newPassword}
              secureTextEntry
              onChangeText={(text) => setUser({ ...user, newPassword: text })}
              style={styles.input}
              mode="outlined"
            />
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleSave}
                style={[styles.button, styles.saveButton]}
                labelStyle={styles.buttonText}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={[styles.button, styles.cancelButton]}
                labelStyle={styles.buttonText}
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
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
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6200ee',
  },
  cancelButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default EditProfile;
