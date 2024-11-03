import { use } from 'chai';
import * as React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Text, Card } from 'react-native-paper';
import config from '../../envconfig';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../models/UserModel';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { set } from 'lodash';

const MyProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({} as User);
  const navigation = useNavigation();

  useEffect(() => {
    // Load users from the API
    const fetchUsers = async () => {
      await axios
        .get(config.baseURL + '/users')
        .then((response) => {
          setUsers(response.data);
          console.log('Users:', users);
        })
        .catch((error) => {});
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Load a single user from the API
    const fetchUser = async (id: string) => {
      await axios
        .get(config.baseURL + '/user/' + id)
        .then((response) => {
          setUser(response.data);
          console.log('User:', user);
        })
        .catch((error) => {});
    };

    if (users.length > 0) {
      fetchUser(users[0]._id);
    } else {
      setUser({} as User);
    }
  }, [users]);

  return (
    <PaperProvider>
      <Card>
        <Card.Title title="Current User" />
        <Card.Content>
          {/* <Text>Users: {users?.length}</Text> */}
          <Text>Username: {user?.username}</Text>
          <Text>Role Description: {user?.roleDescription}</Text>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate(
                'EditProfile' as never,
                { userId: user._id } as never,
              )
            }
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>
    </PaperProvider>
  );
};

export default MyProfile;
