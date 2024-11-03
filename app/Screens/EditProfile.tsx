import { use } from 'chai';
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Button, PaperProvider, TextInput } from 'react-native-paper';
import { Text, Card } from 'react-native-paper';
import config from '../../envconfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../models/UserModel';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { set } from 'lodash';

const EditProfile: React.FC = () => {
  // Get the User ID from the route
  const route = useRoute();
  const { userId } = route.params as { userId: string };

  const [user, setUser] = useState<User>({} as User);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Load a single user from the API
    const fetchUser = async (id: string) => {
      await axios
        .get(config.baseURL + '/user/' + id)
        .then((response) => {
          let user = response.data;
          user.newPassword = '';
          setUser(user);
          console.log('User:', user);
        })
        .catch((error) => {});
    };

    fetchUser(userId);
  }, [userId, lastUpdated]);

  const handleSave = async () => {
    try {
      console.log('User to update:', user);
      await axios.put(config.baseURL + '/user/' + user._id, user).then(() => {
        console.log('User updated');
        setLastUpdated(new Date());
        navigation.goBack();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PaperProvider>
      <Card style={{ backgroundColor: '#666' }}>
        <Card.Title title="Edit User" />
        <Card.Content>
          <TextInput
            label="Username"
            value={user?.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
          />
          <TextInput
            label="Email"
            value={user?.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
          <TextInput
            label="Password"
            value={user?.newPassword}
            secureTextEntry
            onChangeText={(text) => setUser({ ...user, newPassword: text })}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={{ marginTop: 10 }}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 10, borderColor: '#6200ee', borderWidth: 1 }}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>
    </PaperProvider>
  );
};

export default EditProfile;
