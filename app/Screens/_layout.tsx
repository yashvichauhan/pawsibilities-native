import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import axios from 'axios';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { showTabBar, role } = useTabBarVisibility(); // Use context to get the tab visibility state

  const { setShowTabBar, setRole, setUsername, setUserId } =
    useTabBarVisibility();

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await axios.get('https://pawsibilities-api.onrender.com/api/signout');
      setShowTabBar(false);
      setRole(null);
      setUsername(null);
      setUserId(null);
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { display: showTabBar ? 'flex' : 'none' }, // Hide/show the tab bar
      }}
    >
      {showTabBar && role === 'Pet Owner' ? (
        <Tabs.Screen
          name="home"
          options={{
            title: role === 'Pet Owner' ? 'Owner Home' : 'Adopter Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="home" options={{ href: null }} />
      )}

      {showTabBar && role === 'Pet Adopter' ? (
        <Tabs.Screen
          name="AdopterHome"
          options={{
            title: 'Adopter Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="AdopterHome" options={{ href: null }} />
      )}

      {/* View Pets Tab */}
      {showTabBar && role === 'Pet Owner' ? (
        <Tabs.Screen
          name="ViewPets"
          options={{
            title: 'View Pets',
            tabBarIcon: ({ color }) => <TabBarIcon name="paw" color={color} />,
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="ViewPets" options={{ href: null }} />
      )}

      {/* Post New Pet Tab */}
      {showTabBar && role === 'Pet Owner' ? (
        <Tabs.Screen
          name="PostNewPet"
          options={{
            title: 'Post New Pet',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="plus-circle" color={color} />
            ),
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="PostNewPet" options={{ href: null }} />
      )}

      {showTabBar && role === 'Pet Adopter' ? (
        <Tabs.Screen
          name="AvailablePets"
          options={{
            title: 'Available Pets',
            tabBarIcon: ({ color }) => <TabBarIcon name="paw" color={color} />,
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="AvailablePets" options={{ href: null }} />
      )}

      {showTabBar && role === 'Pet Adopter' ? (
        <Tabs.Screen
          name="Favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="heart" color={color} />
            ),
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="Favorites" options={{ href: null }} />
      )}

      {/* About Us Tab */}
      {showTabBar ? (
        <Tabs.Screen
          name="AboutUs"
          options={{
            title: 'About Us',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="info-circle" color={color} />
            ),
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="AboutUs" options={{ href: null }} />
      )}

      {showTabBar ? (
        <Tabs.Screen
          name="Account"
          options={{
            title: role === 'Pet Owner' ? 'Owner Profile' : 'Adopter Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
            headerRight: () => (
              <Pressable onPress={handleLogout}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="Account" options={{ href: null }} />
      )}

      <Tabs.Screen name="Login" options={{ href: null }} />

      <Tabs.Screen name="SignUp" options={{ href: null }} />

      <Tabs.Screen name="EditProfile" options={{ href: null }} />

      <Tabs.Screen name="MyProfile" options={{ href: null }} />
    </Tabs>
  );
}
